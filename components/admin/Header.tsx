import { Session } from "next-auth";
import Search from "./Search";

const Header = ({ session }: { session: Session }) => {
  const firstName = session?.user?.name?.split(" ")[0] || "Admin";

  return (
    <header className="admin-header">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-dark-400">
            Welcome, {firstName}
          </h2>
          <p className="text-base text-slate-500">
            Monitor all of your users and books here
          </p>
        </div>

        {/* Search Component - This should be here */}
        <Search placeholder="Search users, books by title, author, or genre" />
      </div>
    </header>
  );
};

export default Header;