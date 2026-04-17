import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { users, borrowRecords } from "@/database/schema";
import { desc, eq, sql } from "drizzle-orm";
import { getInitials } from "@/lib/utils";
import Link from "next/link";

export default async function AdminUsersPage() {
  const session = await auth();
  
  if (!session?.user?.id) redirect("/sign-in");

  // Fetch all users with their borrowed books count directly in the server component
  const allUsers = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      universityId: users.universityId,
      universityCard: users.universityCard,
      status: users.status,
      role: users.role,
      createdAt: users.createdAt,
      borrowedCount: sql<number>`(
        SELECT COUNT(*) FROM ${borrowRecords}
        WHERE ${borrowRecords.userId} = ${users.id}
        AND ${borrowRecords.status} = 'BORROWED'
      )`,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-dark-400">All Users</h1>
        <p className="text-sm text-slate-500">
          Monitor all of your users and their activities here
        </p>
      </div>

      {/* Users Table */}
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
                  Role
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Books Borrowed
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  University ID No
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  University ID Card
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  {/* Name with avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="text-sm font-semibold">
                          {getInitials(user.fullName)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-dark-400">{user.fullName}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Date Joined */}
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })
                      : "N/A"
                    }
                  </td>
                  
                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {user.role === "ADMIN" ? "Admin" : "User"}
                    </span>
                  </td>
                  
                  {/* Books Borrowed */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-dark-400">
                      {user.borrowedCount || 0}
                    </span>
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
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View ID Card
                    </Link>
                  </td>
                  
                  {/* Action - Delete button (will add later) */}
                  <td className="px-6 py-4">
                    <button 
                      className="text-red-500 hover:text-red-700 transition-colors"
                      disabled
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {allUsers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}