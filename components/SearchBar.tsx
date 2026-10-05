"use client";

import { Search, LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputVal.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [inputVal, onSearch]);

  return (
    <div className="relative max-w-2xl mx-auto w-full">
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-lg transition-all"
        placeholder="Search for a medication (e.g. Advil, Tylenol)..."
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
      />
      {isLoading && (
        <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
          <LoaderCircle className="h-5 w-5 text-blue-500 animate-spin" />
        </div>
      )}
    </div>
  );
}
