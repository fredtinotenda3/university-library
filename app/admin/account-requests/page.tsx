import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import ApproveAccountButton from "@/components/admin/ApproveAccountButton";
import DenyAccountButton from "@/components/admin/DenyAccountButton";

export default async function AdminAccountRequestsPage() {
  const session = await auth();
  
  if (!session?.user?.id) redirect("/sign-in");

  // Fetch all pending account requests
  const pendingUsers = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      universityId: users.universityId,
      universityCard: users.universityCard,
      status: users.status,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.status, "PENDING"))
    .orderBy(desc(users.createdAt));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-dark-400">Account Registration Requests</h1>
        <p className="text-sm text-slate-500">
          Review and manage new user account requests
        </p>
      </div>

      {/* Account Requests Table */}
      <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Date Joined
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  University ID No
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  University ID Card
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  {/* Name with email */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-dark-400">{user.fullName}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </td>
                  
                  {/* Date Joined */}
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : "N/A"
                    }
                  </td>
                  
                  {/* University ID No */}
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.universityId}
                  </td>
                  
                  {/* University ID Card */}
                  <td className="px-6 py-4">
                    <Link
                      href={user.universityCard}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      <Eye className="h-4 w-4" />
                      View ID Card
                    </Link>
                  </td>
                  
                  {/* Actions - Approve & Deny */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <ApproveAccountButton
                        userId={user.id}
                        userName={user.fullName}
                        userEmail={user.email}
                      />
                      <DenyAccountButton
                        userId={user.id}
                        userName={user.fullName}
                        userEmail={user.email}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {pendingUsers.length === 0 && (
          <div className="py-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <p className="mt-4 text-slate-500">No pending account requests</p>
            <p className="text-sm text-slate-400">All user accounts have been reviewed</p>
          </div>
        )}
      </div>
    </div>
  );
}