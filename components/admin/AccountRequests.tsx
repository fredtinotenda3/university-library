import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import Image from "next/image";
import { getInitials } from "@/lib/utils";

const AccountRequests = async () => {
  // Fetch pending account requests
  const pendingUsers = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      universityId: users.universityId,
      status: users.status,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.status, "PENDING"))
    .orderBy(desc(users.createdAt))
    .limit(6);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-400">Account Requests</h3>
        <a
          href="/admin/account-requests"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </a>
      </div>

      {/* Users Grid */}
      {pendingUsers.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-slate-500">No pending account requests</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {pendingUsers.map((user) => (
            <div
              key={user.id}
              className="flex cursor-pointer flex-col items-center rounded-lg border border-slate-100 p-3 transition-all hover:bg-slate-50"
            >
              {/* Avatar */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-sm font-semibold">
                  {getInitials(user.fullName)}
                </span>
              </div>

              {/* User Info */}
              <h4 className="mt-2 text-center text-sm font-semibold text-dark-400 line-clamp-1">
                {user.fullName}
              </h4>
              <p className="mt-1 text-center text-xs text-slate-500 line-clamp-1">
                {user.email}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountRequests;