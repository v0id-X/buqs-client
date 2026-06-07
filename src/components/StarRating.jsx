import { Star } from "lucide-react";

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-7 h-7",
};

export const StarRating = ({ value = 0, onChange, readOnly = false, size = "md" }) => {
  const cls = sizeMap[size] ?? sizeMap.md;
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(n)}
            className={`transition-transform ${readOnly ? "cursor-default" : "hover:scale-110"}`}
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
          >
            <Star className={`${cls} ${filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
          </button>
        );
      })}
    </div>
  );
};
