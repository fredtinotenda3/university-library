import React, { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import StatsCards from "@/components/admin/StatsCards";
import BorrowRequests from "@/components/admin/BorrowRequests";
import AccountRequests from "@/components/admin/AccountRequests";
import RecentlyAddedBooks from "@/components/admin/RecentlyAddedBooks";
import SearchResults from "@/components/admin/SearchResults";

const AdminDashboard = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) => {
  const session = await auth();
  const params = await searchParams;
  const query = params.q || "";
  const searchType = (params.type as "all" | "users" | "books") || "all";

  if (!session?.user?.id) redirect("/sign-in");

  // If searching, show search results instead of dashboard
  if (query) {
    return (
      <div className="flex flex-col gap-6">
        <Suspense fallback={<div className="text-center py-10">Searching...</div>}>
          <SearchResults query={query} searchType={searchType} />
        </Suspense>
      </div>
    );
  }

  // Show normal dashboard (NO Header here - it's in the layout)
  return (
    <div className="flex flex-col gap-6">
      <StatsCards />
      
      {/* Main Content Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Borrow Requests & Account Requests */}
        <div className="space-y-6 lg:col-span-2">
          <BorrowRequests />
          <AccountRequests />
        </div>
        
        {/* Right Column - Recently Added Books */}
        <div className="lg:col-span-1">
          <RecentlyAddedBooks />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;