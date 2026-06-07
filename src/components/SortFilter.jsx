import { ArrowUpDown, SlidersHorizontal, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const SortFilter = ({
  sort, onSortChange,
  allGenres, selectedGenres, onToggleGenre,
  onClear,
}) => {
  const hasActiveFilters = selectedGenres.length > 0 || sort !== "newest";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Select value={sort} onValueChange={(v) => onSortChange(v)}>
        <SelectTrigger className="w-[170px] rounded-full bg-card shadow-soft border-border">
          <ArrowUpDown className="w-4 h-4 mr-1" />
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="discovery">Discovery</SelectItem>
          <SelectItem value="newest">Newest first</SelectItem>
          <SelectItem value="oldest">Oldest first</SelectItem>
          <SelectItem value="top_rated">Top rated</SelectItem>
          <SelectItem value="title_a_z">Title (A–Z)</SelectItem>
          <SelectItem value="title_z_a">Title (Z–A)</SelectItem>
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-full bg-card shadow-soft">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filter {selectedGenres.length > 0 && `(${selectedGenres.length})`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
          <DropdownMenuLabel>Genres</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allGenres.map((g) => (
            <DropdownMenuCheckboxItem
              key={g}
              checked={selectedGenres.includes(g)}
              onCheckedChange={() => onToggleGenre(g)}
            >
              {g}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {hasActiveFilters && onClear && (
        <Button
          variant="ghost"
          className="rounded-full text-muted-foreground hover:text-foreground"
          onClick={onClear}
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};