"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchMedications, FdaLabel } from "@/lib/api";
import { StatusAlert } from "@/components/StatusAlert";

export default function MedicineDetailPage() {
  const params = useParams();
  const rawName = (params?.name as string) || "";
  const decodedName = decodeURIComponent(rawName);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["drug-detail", decodedName],
    queryFn: () => fetchMedications(decodedName),
    enabled: Boolean(decodedName),
  });

  const label: FdaLabel | undefined = data?.results?.[0];

  if (isLoading) {
    return (
      <article className="max-w-3xl mx-auto px-4 py-8 md:py-12 animate-pulse">
        <div className="h-28 bg-blue-50/50 rounded-xl mb-8 border border-blue-100" />
        <header className="mb-10">
          <div className="h-10 md:h-12 bg-slate-200 rounded-lg w-3/4 mb-3" />
          <div className="h-6 md:h-7 bg-slate-200 rounded-lg w-1/2 mb-4" />
          <div className="h-6 bg-slate-200 rounded-full w-48" />
        </header>
        <div className="mb-10 h-40 bg-amber-50/50 rounded-2xl border border-amber-100" />
        <div className="space-y-10">
          <div>
            <div className="h-7 bg-slate-200 rounded-lg w-48 mb-4 border-b border-slate-200 pb-2" />
            <div className="h-4 bg-slate-100 rounded w-full mb-3" />
            <div className="h-4 bg-slate-100 rounded w-5/6" />
          </div>
          <div>
            <div className="h-7 bg-slate-200 rounded-lg w-56 mb-4 border-b border-slate-200 pb-2" />
            <div className="h-4 bg-slate-100 rounded w-full mb-3" />
            <div className="h-4 bg-slate-100 rounded w-full mb-3" />
            <div className="h-4 bg-slate-100 rounded w-4/6" />
          </div>
        </div>
      </article>
    );
  }

  if (isError || (data?.results && data.results.length === 0)) {
    return (
      <div className="py-20 px-4">
        <StatusAlert
          variant="no-results"
          searchQuery={decodedName}
        />
        <div className="text-center mt-6">
          <Link
            href="/"
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Return to Search
          </Link>
        </div>
      </div>
    );
  }

  const brandName =
    label?.openfda?.brand_name?.[0] || decodedName;
  const genericName =
    label?.openfda?.generic_name?.[0] || "Generic information not available";
  const manufacturer =
    label?.openfda?.manufacturer_name?.[0] || "Manufacturer not listed";

  const warnings =
    label?.warnings?.[0] ||
    label?.boxed_warning?.[0] ||
    label?.warnings_and_cautions?.[0] ||
    "No specific warnings listed for this formulation.";

  const activeIngredients =
    label?.active_ingredient || ["Active ingredients not explicitly listed."];

  const purpose =
    label?.purpose?.[0] ||
    label?.indications_and_usage?.[0] ||
    "Purpose or indication not specified.";

  const dosage =
    label?.dosage_and_administration?.[0] ||
    "Dosage instructions not provided.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Drug",
    name: brandName,
    nonProprietaryName: genericName,
    manufacturer: {
      "@type": "Organization",
      name: manufacturer,
    },
    activeIngredient: activeIngredients.join(", "),
    description: purpose,
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Search
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-5 rounded-xl mb-8 text-sm leading-relaxed">
        <strong>Important Disclaimer:</strong> The information on this page is
        sourced directly from the <strong>US FDA Label Database</strong>.
        Formulations, dosage conventions, active ingredients, and regulatory
        language shown here reflect the US market and <strong>may not match</strong>{" "}
        products sold under the same brand name in India or other countries. Always
        consult your local healthcare provider before use.
      </div>

      <header className="mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 capitalize mb-2">
          {brandName.toLowerCase()}
        </h1>
        <p className="text-lg md:text-xl font-medium text-slate-500 mb-4">
          {genericName}
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
            Manufactured by {manufacturer}
          </span>
        </div>
      </header>

      <section className="mb-10 bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-amber-900 mb-3 flex items-center gap-2">
          <span className="text-2xl">⚠️</span> Warnings & Safety Info
        </h2>
        <div className="text-amber-800 whitespace-pre-wrap text-sm md:text-base leading-relaxed">
          {warnings}
        </div>
      </section>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">
            Active Ingredients
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-700 leading-relaxed">
            {activeIngredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">
            Purpose & Indications
          </h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {purpose}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">
            Dosage and Administration
          </h2>
          <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
            {dosage}
          </div>
        </section>
      </div>
    </article>
  );
}
