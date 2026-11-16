import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useConfig, useVideos } from "@/lib/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import FilmCard from "@/components/FilmCard";
import { Film, countriesOf, filmsLabel } from "@/lib/travel";

export default function Films() {
  const config = useConfig() as any;
  const [sort, setSort] = useState<"newest" | "popular">("newest");
  const { videos, loading, error } = useVideos(sort === "popular" ? { sort: "popular" } : undefined);
  const [q, setQ] = useState("");
  const films = videos as unknown as Film[];

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return films;
    return films.filter((f) =>
      [f.title, f.summary, f.description, ...(f.tags || []), ...countriesOf(f)].filter(Boolean).join(" ").toLowerCase().includes(t)
    );
  }, [films, q]);

  return (
    <main data-page-kind="collection" className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8">
      <header data-region="intro" className="flex flex-col gap-8 border-b border-border py-14 lg:flex-row lg:items-end lg:justify-between lg:py-20">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            The full reel{!loading && ` · ${filmsLabel(films.length)}`}
          </p>
          <h1 className="mt-3 text-5xl uppercase leading-[0.95] sm:text-7xl">Travel Films</h1>
        </div>
        <div data-region="filters" className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {config.showSearch !== false && (
            <form role="search" onSubmit={(e) => e.preventDefault()} className="relative sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search a place or film"
                aria-label="Search films"
                data-testid="search-films"
                className="h-11 rounded-sm pl-10"
              />
            </form>
          )}
          <div className="flex rounded-sm border border-border p-1" role="group" aria-label="Order">
            {(["newest", "popular"] as const).map((s) => (
              <Button
                key={s}
                type="button"
                variant="ghost"
                aria-pressed={sort === s}
                onClick={() => setSort(s)}
                data-testid={`sort-${s}`}
                className={`h-9 flex-1 rounded-[2px] px-4 text-xs font-semibold uppercase tracking-[0.16em] ${
                  sort === s ? "bg-primary text-primary-foreground hover:bg-[var(--accent-hover)] hover:text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {s === "newest" ? "Newest" : "Most watched"}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {error && <p className="mt-10 text-[var(--danger)]">{error}</p>}

      <section data-region="grid" className="pt-12">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((k) => (
              <Skeleton key={k} className="aspect-video w-full rounded-[4px]" />
            ))}
          </div>
        ) : shown.length ? (
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-10">
            {shown.map((f, i) => (
              <FilmCard key={f.id} film={f} index={i} />
            ))}
          </div>
        ) : (
          <div data-region="empty" className="border border-dashed border-border px-6 py-16 text-center">
            <p className="text-lg">{q ? `No films match “${q}” yet.` : "No films here yet."}</p>
            {q && (
              <Button className="mt-6 h-11 rounded-sm" onClick={() => setQ("")} data-testid="clear-search">
                Show all films
              </Button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
