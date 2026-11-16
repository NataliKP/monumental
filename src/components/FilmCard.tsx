import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { formatDuration } from "@/lib/hooks";
import { Film, aspectOf, indexLabel, placeLabel, plays } from "@/lib/travel";

/** A film at its own shape — wide stays wide, upright stays upright. */
export default function FilmCard({ film, index }: { film: Film; index: number }) {
  const dur = formatDuration(film.duration_ms);
  return (
    <Link
      to={`/watch?id=${encodeURIComponent(film.id)}`}
      data-testid="open-film"
      className="group block break-inside-avoid rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring)]"
    >
      <div className="relative overflow-hidden rounded-[4px] bg-[var(--c-secondary)]" style={{ aspectRatio: aspectOf(film) }}>
        {film.poster ? (
          <img
            src={film.poster}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-xs uppercase tracking-[0.25em] text-[var(--c-secondary-text)]">
            Still preparing…
          </div>
        )}
        <span className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Play className="ml-0.5 h-4 w-4 fill-current" />
        </span>
        {dur && (
          <span className="absolute bottom-3 right-3 rounded-[2px] bg-[var(--scrim-bottom)] px-2 py-1 font-mono text-xs text-[var(--on-image)]">
            {dur}
          </span>
        )}
      </div>
      <div className="pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {indexLabel(index)} — {placeLabel(film)}
        </p>
        <h3 className="mt-1 text-lg leading-snug transition-colors group-hover:text-[var(--interactive)]">{film.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{plays(film.views)}</p>
      </div>
    </Link>
  );
}
