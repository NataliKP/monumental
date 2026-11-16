import { useEffect, useMemo } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import { useVideos } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import FilmCard from "@/components/FilmCard";
import Reveal from "@/components/Reveal";
import { Film, REGIONS, atlasOf, countriesOf, filmsLabel, regionOf } from "@/lib/travel";

export default function Destinations() {
  const { videos, loading, error } = useVideos();
  const films = videos as unknown as Film[];
  const atlas = useMemo(() => atlasOf(films), [films]);
  const [params, setParams] = useSearchParams();
  const country = params.get("country");
  const { hash } = useLocation();
  const unplaced = films.filter((f) => countriesOf(f).length === 0).length;
  const placed = Array.from(atlas.keys()).length;

  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    return () => clearTimeout(t);
  }, [hash, loading]);

  const selected = country ? atlas.get(country) || [] : [];

  return (
    <main data-page-kind="collection" className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8">
      <header data-region="intro" className="grid gap-6 border-b border-border py-14 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:py-20">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">The atlas · six regions</p>
          <h1 className="mt-3 text-5xl uppercase leading-[0.95] sm:text-7xl">Destinations</h1>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Every country on the map. The bright ones have a film.</p>
          {!loading && (
            <p className="font-mono text-xs uppercase tracking-[0.15em]">
              {placed} {placed === 1 ? "place" : "places"} filmed
              {unplaced > 0 && (
                <>
                  {" · "}
                  <Link to="/films" className="underline underline-offset-4 hover:text-[var(--interactive)]" data-testid="unplaced-films">
                    {filmsLabel(unplaced)} not yet on the map
                  </Link>
                </>
              )}
            </p>
          )}
        </div>
      </header>

      <nav aria-label="Regions" className="sticky top-16 z-20 -mx-5 flex gap-1 overflow-x-auto border-b border-border bg-background/95 px-5 py-2 backdrop-blur sm:-mx-8 sm:px-8">
        {REGIONS.map((r, i) => (
          <a
            key={r.id}
            href={`#${r.id}`}
            data-testid={`jump-${r.id}`}
            className="flex min-h-11 flex-none items-center gap-2 rounded-sm px-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:bg-[var(--surface-hover)] hover:text-foreground"
          >
            <span className="font-mono">0{i + 1}</span> {r.name}
          </a>
        ))}
      </nav>

      {error && <p className="mt-8 text-[var(--danger)]">{error}</p>}

      {country && (
        <section data-region="results" aria-live="polite" className="mt-10 rounded-[4px] bg-[var(--c-secondary)] p-6 text-[var(--c-secondary-text)] sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] opacity-75">{regionOf(country)?.name || "Somewhere"}</p>
              <h2 className="mt-2 text-4xl">{country}</h2>
            </div>
            <Button
              variant="outline"
              className="h-11 rounded-sm border-current bg-transparent text-current hover:bg-background/30"
              onClick={() => setParams({})}
              data-testid="clear-country"
            >
              <X className="mr-1 h-4 w-4" /> All countries
            </Button>
          </div>
          {loading ? (
            <Skeleton className="mt-8 aspect-video w-full max-w-md" />
          ) : selected.length ? (
            <div className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-8">
              {selected.map((f, i) => (
                <FilmCard key={f.id} film={f} index={i} />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <p className="text-lg">No films from here yet.</p>
              <Button asChild className="mt-4 h-11 rounded-sm" data-testid="empty-all-films">
                <Link to="/films">See all films</Link>
              </Button>
            </div>
          )}
        </section>
      )}

      <div data-region="list" className="mt-6">
        {REGIONS.map((r, i) => {
          const live = r.countries.filter((c) => atlas.has(c)).length;
          return (
            <section key={r.id} id={r.id} className="scroll-mt-32 grid gap-6 border-b border-border py-12 lg:grid-cols-[280px_1fr] lg:gap-12">
              <Reveal>
                <span className="font-display text-6xl font-extrabold text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-2 text-3xl">{r.name}</h2>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  {r.countries.length} places · {live ? `${live} filmed` : "films to come"}
                </p>
              </Reveal>
              <ul className="flex flex-wrap content-start gap-2">
                {loading
                  ? r.countries.slice(0, 12).map((c) => (
                      <li key={c}>
                        <Skeleton className="h-11 w-28 rounded-sm" />
                      </li>
                    ))
                  : r.countries.map((c) => {
                      const n = atlas.get(c)?.length || 0;
                      const active = c === country;
                      return (
                        <li key={c}>
                          {n ? (
                            <button
                              type="button"
                              onClick={() => {
                                setParams({ country: c });
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              aria-pressed={active}
                              data-testid="pick-country"
                              className={`flex min-h-11 items-center gap-2 rounded-sm border px-3 text-sm font-semibold transition-colors ${
                                active
                                  ? "border-transparent bg-primary text-primary-foreground"
                                  : "border-[var(--border-strong)] text-foreground hover:bg-[var(--accent-tint)] hover:text-[var(--text-on-tint)]"
                              }`}
                            >
                              {c}
                              <span className="font-mono text-[11px] opacity-80">{filmsLabel(n)}</span>
                            </button>
                          ) : (
                            <span className="flex min-h-11 items-center rounded-sm px-3 text-sm text-muted-foreground">{c}</span>
                          )}
                        </li>
                      );
                    })}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
