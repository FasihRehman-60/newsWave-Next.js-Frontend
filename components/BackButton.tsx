"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  destination?: string;
  label?: string;
}

export default function BackButton({ 
  destination = "/dashboard", 
  label = "Back to Dashboard" 
}: BackButtonProps) {
  const router = useRouter();

  const goBack = () => {
    router.push(destination);
  };

  return (
    <button
      onClick={goBack}
      className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 mb-4"
    >
      <ArrowLeft size={16} /> {label}
    </button>
  );
}