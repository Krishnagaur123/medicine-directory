"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/SearchBar";
import { MedicineCard } from "@/components/MedicineCard";
import { StatusAlert } from "@/components/StatusAlert";
import { fetchMedications, FdaLabel } from "@/lib/api";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["drugs", searchQuery],
    queryFn: () => fetchMedications(searchQuery),
    enabled: searchQuery.length > 2,
  });

  const groupedResults = useMemo(() => {
    if (!data?.results) return [];

    const map: Record<string, FdaLabel[]> = {};

    data.results.forEach((item) => {
      const key = (
        item.openfda?.brand_name?.[0] ||
        item.openfda?.generic_name?.[0] ||
        "Unknown Medication"
      ).toUpperCase();

      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(item);
    });

    return Object.entries(map).map(([key, labels]) => {
      const brandName =
        labels[0].openfda?.brand_name?.[0] ||
        labels[0].openfda?.generic_name?.[0] ||
        key;
      return { brandName, labels };
    });
  }, [data]);

  const errorMessage = error instanceof Error ? error.message : undefined;
  const isTimeout = errorMessage?.toLowerCase().includes("timed out");

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
          Medicine Directory
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Search the FDA database for drug labels, indications, and active ingredients.
        </p>
      </div>

      <SearchBar onSearch={setSearchQuery} isLoading={isLoading} />

      <div className="mt-12 min-h-[400px]">
        {searchQuery.length > 0 && searchQuery.length <= 2 && (
          <p className="text-center text-slate-500 mt-12">
            Please enter at least 3 characters to search.
          </p>
        )}

        {isError && (
          <StatusAlert
            variant={isTimeout ? "timeout" : "error"}
            message={errorMessage}
          />
        )}

        {data?.results && data.results.length === 0 && !isLoading && (
          <StatusAlert variant="no-results" searchQuery={searchQuery} />
        )}

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-pulse h-[200px]"
              />
            ))}
          </div>
        )}

        {groupedResults.length > 0 && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {groupedResults.map((item) => (
              <MedicineCard
                key={item.brandName}
                brandName={item.brandName}
                labels={item.labels}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
