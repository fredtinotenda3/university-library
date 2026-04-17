"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Printer } from "lucide-react";

interface BorrowRecord {
  id: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
  book: {
    id: string;
    title: string;
    author: string;
    genre: string;
    coverUrl: string;
    coverColor: string;
    description: string;
  };
  user: {
    id: string;
    fullName: string;
    email: string;
    universityId: number;
  };
}

export default function BorrowReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const [borrowRecord, setBorrowRecord] = useState<BorrowRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const id = params.id as string;

  useEffect(() => {
    const fetchBorrowRecord = async () => {
      try {
        const response = await fetch(`/api/admin/book-requests/${id}`);
        const data = await response.json();
        setBorrowRecord(data);
      } catch (error) {
        console.error("Error fetching borrow record:", error);
        router.push("/admin/book-requests");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBorrowRecord();
    }
  }, [id, router]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/book-requests"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-dark-400">Borrow Receipt</h1>
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">Loading receipt data...</p>
        </div>
      </div>
    );
  }

  if (!borrowRecord) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/book-requests"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-dark-400">Borrow Receipt</h1>
            <p className="text-sm text-slate-500">Receipt not found</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">Borrow record not found</p>
          <Link
            href="/admin/book-requests"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Back to Borrow Requests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/book-requests"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-dark-400">Borrow Receipt</h1>
            <p className="text-sm text-slate-500">Book borrowing confirmation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Receipt Card */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden" id="receipt">
        <div className="p-8">
          {/* Header */}
          <div className="border-b border-slate-200 pb-6 text-center">
            <h2 className="text-2xl font-bold text-dark-400">BookWise Library</h2>
            <p className="text-slate-500">Borrowing Receipt</p>
          </div>

          {/* Receipt Info */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-500">Receipt Number</h3>
              <p className="text-dark-400">{borrowRecord.id}</p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-500">Issue Date</h3>
              <p className="text-dark-400">
                {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Borrower Info */}
          <div className="mt-6">
            <h3 className="mb-3 text-lg font-semibold text-dark-400">Borrower Information</h3>
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Full Name</p>
                  <p className="font-medium text-dark-400">{borrowRecord.user?.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium text-dark-400">{borrowRecord.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">University ID</p>
                  <p className="font-medium text-dark-400">{borrowRecord.user?.universityId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="mt-6">
            <h3 className="mb-3 text-lg font-semibold text-dark-400">Book Information</h3>
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="flex gap-4">
                <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded bg-slate-200">
                  {borrowRecord.book?.coverUrl && (
                    <img
                      src={borrowRecord.book.coverUrl}
                      alt={borrowRecord.book.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-dark-400">{borrowRecord.book?.title}</h4>
                  <p className="text-sm text-slate-500">by {borrowRecord.book?.author}</p>
                  <p className="text-sm text-slate-500">Genre: {borrowRecord.book?.genre}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Borrow Details */}
          <div className="mt-6">
            <h3 className="mb-3 text-lg font-semibold text-dark-400">Borrow Details</h3>
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Borrowed Date</p>
                  <p className="font-medium text-dark-400">
                    {borrowRecord.borrowDate
                      ? new Date(borrowRecord.borrowDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Due Date</p>
                  <p className="font-medium text-dark-400">
                    {borrowRecord.dueDate
                      ? new Date(borrowRecord.dueDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    borrowRecord.status === "BORROWED"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {borrowRecord.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Return Instructions */}
          <div className="mt-6 rounded-lg bg-yellow-50 p-4">
            <h4 className="font-semibold text-yellow-800">Return Instructions</h4>
            <p className="mt-1 text-sm text-yellow-700">
              Please return the book by the due date to avoid late fees. 
              Books can be returned at the library circulation desk.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Thank you for using BookWise Library!
            </p>
            <p className="text-xs text-slate-400 mt-1">
              This is a system-generated receipt. No signature required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}