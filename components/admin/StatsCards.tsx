import { db } from "@/database/drizzle";
import { books, users, borrowRecords } from "@/database/schema";
import { eq, count } from "drizzle-orm";

const StatsCards = async () => {
  // Fetch real data from database
  const [totalBooks] = await db
    .select({ count: count() })
    .from(books);

  const [totalUsers] = await db
    .select({ count: count() })
    .from(users);

  const [borrowedBooks] = await db
    .select({ count: count() })
    .from(borrowRecords)
    .where(eq(borrowRecords.status, "BORROWED"));

  const stats = [
    {
      title: "Borrowed Books",
      value: borrowedBooks?.count || 0,
      trend: "↓",
      trendValue: "2",
      trendColor: "text-red-600",
      bgColor: "bg-red-100",
      subtitle: "currently borrowed",
    },
    {
      title: "Total Users",
      value: totalUsers?.count || 0,
      trend: "↑",
      trendValue: "4",
      trendColor: "text-green-600",
      bgColor: "bg-green-100",
      subtitle: "registered users",
    },
    {
      title: "Total Books",
      value: totalBooks?.count || 0,
      trend: "↑",
      trendValue: "2",
      trendColor: "text-green-600",
      bgColor: "bg-green-100",
      subtitle: "in library",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{stat.title}</p>
            <span
              className={`rounded-full ${stat.bgColor} px-2 py-1 text-xs font-semibold ${stat.trendColor}`}
            >
              {stat.trend} {stat.trendValue}
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-dark-400">{stat.value}</p>
          <p className="mt-2 text-xs text-slate-400">{stat.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;