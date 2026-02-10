/**
 * Search and Filter Bar Component
 *
 * Provides search input and filter controls for data tables
 */

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchFilterBarProps {
  onSearchChange: (search: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

export function SearchFilterBar({
  onSearchChange,
  placeholder = "Suchen...",
  className,
  defaultValue = "",
}: SearchFilterBarProps) {
  const [search, setSearch] = useState(defaultValue);

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  const handleClear = () => {
    setSearch("");
    onSearchChange("");
  };

  return (
    <div className={cn("relative flex items-center gap-2", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10 rounded-[6px] font-sans"
        />
        {search && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-[4px]"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    </div>
  );
}
