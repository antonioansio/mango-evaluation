"use client";

import Range from "@/components/Range";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Exercise2() {
  const router = useRouter();
  const [rangeValues, setRangeValues] = useState({ min: 0, max: 100 });
  const [predefinedSteps, setPredefinedSteps] = useState<number[]>([0, 100]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRangeValues = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/predefined-values");
        const data = await response.json();
        setRangeValues(data);
        if (data && data.length > 0) {
          setPredefinedSteps(data);
        }
      } catch (error) {
        console.error("Error fetching range values:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRangeValues();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="mb-8 text-4xl font-bold text-gray-800">Exercise 2</h1>
        <div className="w-full max-w-2xl relative pt-2 pb-8">
          <div className="relative h-2 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>
      <h1 className="mb-8 text-4xl font-bold text-gray-800">Exercise 2</h1>
      <div className="w-full max-w-2xl">
        <Range
          minLimit={predefinedSteps[0]}
          maxLimit={predefinedSteps[predefinedSteps.length - 1]}
          predefinedSteps={predefinedSteps}
          initialMin={rangeValues.min}
          initialMax={rangeValues.max}
          disableModal={true}
        />
      </div>
    </div>
  );
}
