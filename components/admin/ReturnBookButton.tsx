"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

interface ReturnBookButtonProps {
  borrowId: string;
  bookId: string;
  bookTitle: string;
}

const ReturnBookButton = ({ borrowId, bookId, bookTitle }: ReturnBookButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleReturn = async () => {
    if (!confirm(`Mark "${bookTitle}" as returned?`)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/book-requests/${borrowId}/return`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to mark as returned");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleReturn}
      disabled={isLoading}
      className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-100 disabled:opacity-50"
    >
      <CheckCircle className="h-4 w-4" />
      {isLoading ? "Processing..." : "Mark Returned"}
    </button>
  );
};

export default ReturnBookButton;