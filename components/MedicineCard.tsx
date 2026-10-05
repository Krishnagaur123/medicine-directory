"use client";

import Link from "next/link";

interface FdaLabel {
  id?: string;
  purpose?: string[];
  openfda?: {
    brand_name?: string[];
    generic_name?: string[];
    manufacturer_name?: string[];
  };
}

interface MedicineCardProps {
  brandName: string;
  labels: FdaLabel[];
}

export function MedicineCard({ brandName, labels }: MedicineCardProps) {
  const genericNames = Array.from(
    new Set(labels.flatMap((e) => e.openfda?.generic_name || []).filter(Boolean))
  );

  const manufacturers = Array.from(
    new Set(labels.flatMap((e) => e.openfda?.manufacturer_name || []).filter(Boolean))
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 capitalize">
            {brandName.toLowerCase()}
          </h2>
          {genericNames.length > 0 && (
            <p className="text-sm font-medium text-slate-500 mt-1">
              Generic: {genericNames.slice(0, 2).join(", ")}{" "}
              {genericNames.length > 2 && "..."}
            </p>
          )}
        </div>
        {manufacturers.length > 0 && (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 text-right shrink-0">
            {manufacturers[0]}{" "}
            {manufacturers.length > 1 && `+ ${manufacturers.length - 1} more`}
          </div>
        )}
      </div>

      <div className="mt-5 pt-5 border-t border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Available Formulations ({labels.length})
        </h3>
        <ul className="space-y-3">
          {labels.slice(0, 2).map((item, idx) => {
            const purposeText = item.purpose?.[0] || "Purpose not listed";
            return (
              <li key={item.id || idx} className="text-sm">
                <p className="text-slate-600 line-clamp-2">{purposeText}</p>
              </li>
            );
          })}
          {labels.length > 2 && (
            <li className="text-sm font-medium text-slate-500 pt-1">
              + {labels.length - 2} more formulation(s)
            </li>
          )}
        </ul>
      </div>

      <div className="mt-5 flex justify-end">
        <Link
          href={`/medicine/${encodeURIComponent(brandName.toLowerCase())}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View full details →
        </Link>
      </div>
    </div>
  );
}
