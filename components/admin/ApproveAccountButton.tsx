"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, X } from "lucide-react";
import { approveAccount } from "@/lib/admin/actions/account";

interface ApproveAccountButtonProps {
  userId: string;
  userName: string;
  userEmail: string;
}

const ApproveAccountButton = ({ userId, userName, userEmail }: ApproveAccountButtonProps) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    const result = await approveAccount(userId, userEmail, userName);
    
    if (result.success) {
      setShowModal(false);
      router.refresh();
    } else {
      alert(result.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-100"
      >
        <CheckCircle className="h-4 w-4" />
        Approve
      </button>

      {/* Approval Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-400">Approve Account Request</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-slate-600">
              Approve the student's account request and grant access. A confirmation email will be sent upon approval.
            </p>
            
            <div className="mt-4 rounded-lg bg-slate-50 p-3">
              <p className="text-sm font-medium text-dark-400">{userName}</p>
              <p className="text-sm text-slate-500">{userEmail}</p>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={isLoading}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? "Approving..." : "Approve & Send Confirmation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApproveAccountButton;