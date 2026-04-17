"use client";

import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface SearchProps {
  placeholder?: string;
  searchType?: "users" | "books" | "all";
}

const Search = ({ 
  placeholder = "Search users, books by title, author, or genre",
  searchType = "all"
}: SearchProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAdminSubPage = pathname !== "/admin";

  // Debounced search function
  const debouncedSearch = useCallback((value: string) => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const currentQ = params.get("q") || "";
      
      // If value hasn't changed, don't do anything
      if (value.trim() === currentQ) return;
      
      if (value.trim()) {
        params.set("q", value.trim());
        params.set("type", searchType);
      } else {
        params.delete("q");
        params.delete("type");
      }
      
      const queryString = params.toString();
      const newUrl = queryString ? `/admin?${queryString}` : "/admin";
      
      // Only redirect if we're on a subpage or the URL actually changed
      if (isAdminSubPage || queryString !== searchParams.toString()) {
        router.push(newUrl);
      }
    }, 500);
  }, [router, searchParams, searchType, isAdminSubPage]);

  useEffect(() => {
    // Only trigger search if we're on the admin dashboard or if there's an existing search
    if (pathname === "/admin" || searchParams.get("q")) {
      debouncedSearch(searchValue);
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchValue, debouncedSearch, pathname, searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  return (
    <div className="relative w-full md:w-80">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleSearch}
        className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
};

export default Search;