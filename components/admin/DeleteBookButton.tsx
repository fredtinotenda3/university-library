"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteBook } from "@/lib/admin/actions/book";

interface DeleteBookButtonProps {
  bookId: string;
  bookTitle: string;
}

const DeleteBookButton = ({ bookId, bookTitle }: DeleteBookButtonProps) => {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
      return;
    }

    const result = await deleteBook(bookId);
    
    if (result.success) {
      router.refresh();
    } else {
      alert(result.message);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
};

export default DeleteBookButton;