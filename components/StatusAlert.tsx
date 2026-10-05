"use client";

import { SearchX, CircleX, CircleAlert } from "lucide-react";

interface StatusAlertProps {
  variant: "no-results" | "error" | "timeout";
  message?: string;
  searchQuery?: string;
}

export function StatusAlert({ variant, message, searchQuery }: StatusAlertProps) {
  const config = {
    "no-results": {
      icon: SearchX,
      title: "No results found",
      description: `We couldn't find any medications matching "${searchQuery || ""}". Please check the spelling or try a different term.`,
      color: "text-slate-500",
      bg: "bg-slate-100",
      border: "border-slate-200",
    },
    error: {
      icon: CircleX,
      title: "Something went wrong",
      description: message || "There was an error fetching the medication data. Please try again later.",
      color: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-100",
    },
    timeout: {
      icon: CircleAlert,
      title: "Request timed out",
      description: "The FDA database is taking too long to respond. Please try again.",
      color: "text-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
  }[variant];

  const IconComponent = config.icon;

  return (
    <div className={`flex flex-col items-center justify-center p-12 rounded-2xl border ${config.border} text-center ${config.bg} max-w-2xl mx-auto mt-8`}>
      <IconComponent className={`w-12 h-12 mb-4 ${config.color}`} />
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{config.title}</h3>
      <p className="text-slate-600 max-w-md">{config.description}</p>
    </div>
  );
}
