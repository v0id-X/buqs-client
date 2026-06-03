import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const TopTenCarousel = ({ books }) => {
  const scrollerRef = useRef(null);

  const scroll = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.max(280, Math.floor(el.clientWidth * 0.7));
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const items = books.slice(0, 10);

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 pt-2 pl-1 pr-1"
      >
        {items.map((b, i) => (
          <Link
            key={b.isbn}
            to={`/books/${b.isbn}`}
            className="snap-start shrink-0 group relative flex items-end gap-1 sm:gap-2 pl-10 sm:pl-14"
            aria-label={`#${i + 1} ${b.title}`}
          >
            <span
              aria-hidden="true"
              className="absolute left-0 bottom-0 font-serif italic font-black leading-none select-none pointer-events-none
                         text-[7rem] sm:text-[10rem] md:text-[12rem]
                         text-transparent
                         [-webkit-text-stroke:2px_hsl(var(--foreground))]
                         translate-y-2"
            >
              {i + 1}
            </span>

            <div className="relative w-32 sm:w-40 md:w-44 aspect-[2/3] rounded-2xl overflow-hidden bg-muted shadow-card group-hover:scale-[1.03] transition-transform">
              <img
                src={b.cover_image}
                alt={`Cover of ${b.title}`}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-card/90 backdrop-blur shadow-card flex items-center justify-center hover:bg-card transition-colors"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-card/90 backdrop-blur shadow-card flex items-center justify-center hover:bg-card transition-colors"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};
