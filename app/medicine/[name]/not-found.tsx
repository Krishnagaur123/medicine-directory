"use client";

import Link from "next/link";
import { StatusAlert } from "@/components/StatusAlert";

export default function MedicineNotFound() {
  return (
    <div className="py-20 px-4">
      <StatusAlert
        variant="no-results"
        searchQuery="this specific medication"
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
