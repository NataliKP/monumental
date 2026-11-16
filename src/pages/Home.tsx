import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, Play } from "lucide-react";
import { useSiteUrl, useVideos, formatDuration } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Reveal from "@/components/Reveal";
import { Film, REGIONS, atlasOf, filmsLabel, indexLabel, isUpright, placeLabel, plays } from "@/lib/travel";

const word =
  "inline-block bg-[var(--scrim-bottom)] px-3 py-1 font-display text-[clamp(2.25rem,11vw,4rem)] font-extrabold sm:text-[clamp(2.5rem,6.2vw,7.5rem)] uppercase leading-[0.9] tracking-[-0.02em] text-[var(--on-image)] sm:px-5";

function Hero() {
  const siteUrl = useSiteUrl();
  return (
    <section data-region="hero" className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
      <img
        src={siteUrl("assets/hero.jpg")}
        alt="A misty mountain valley at dusk"
        width={2100}
        height={900}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" aria-hidden="true" />

      <h1 className="sr-only">Wanderfilm</h1>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[22%] flex flex-col items-start gap-2 px-5 sm:top-1/2 sm:-translate-y-1/2 sm:flex-row sm:items-center sm:justify-between sm:px-8"
      >
        <span className={word}>Wander</span>
        <span className={word}>Film</span>
      </div>

      <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-4 px-5 text-center">
        <p className="bg-[var(--scrim-bottom)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--on-image)]">
          Destinations · Adventure stories · Travel films
        </p>
        <Button asChild size="lg" className="h-12 rounded-sm px-7 text-sm font-semibold uppercase tracking-[0.18em]" data-testid="start-journey">
          <a href="#featured">
            Start the journey <ArrowDown className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  );
}

function Featured({ film, loading }: { film?: Film; loading: boolean }) {
  return (
    <section id="featured" data-region="featured" className="mx-auto max-w-[1400px] scroll-mt-20 px-5 py-20 sm:px-8 lg:py-28">
      {loading ? (
        <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <Skeleton className="aspect-video w-full rounded-[4px]" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      ) : !film ? (
        <div className="border border-dashed border-border px-6 py-16 text-center">
          <p className="text-lg">The first films are still on the road.</p>
          <Button asChild variant="outline" className="mt-6 h-11 rounded-sm" data-testid="empty-about">
            <Link to="/about">About Wanderfilm</Link>
          </Button>
        </div>
      ) : (
        <Reveal>
          <Link
            to={`/watch?id=${encodeURIComponent(film.id)}`}
            data-testid="watch-featured"
            className="group grid items-end gap-8 lg:grid-cols-[1.7fr_1fr] lg:gap-12"
          >
            <div className="relative aspect-video overflow-hidden rounded-[4px] bg-[var(--c-secondary)]">
              {film.poster ? (
                <img src={film.poster} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.03]" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.25em] text-[var(--c-secondary-text)]">Still preparing…</div>
              )}
              <span className="absolute bottom-5 left-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-lg)] transition-transform group-hover:scale-110">
                <Play className="ml-1 h-6 w-6 fill-current" />
              </span>
            </div>
            <div className="lg:pb-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">Featured film · {indexLabel(0)}</p>
              <h2 className="mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl">{film.title}</h2>
              {(film.description || film.summary) && (
                <p className="mt-5 max-w-prose text-base leading-relaxed text-muted-foreground">{film.description || film.summary}</p>
              )}
              <dl className="mt-8 grid grid-cols-3 border-t border-border pt-4 text-xs uppercase tracking-[0.2em]">
                <div>
                  <dt className="text-muted-foreground">Length</dt>
                  <dd className="mt-1 font-mono text-sm normal-case tracking-normal">{formatDuration(film.duration_ms) || "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Place</dt>
                  <dd className="mt-1 text-sm normal-case tracking-normal">{placeLabel(film)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Seen</dt>
                  <dd className="mt-1 text-sm normal-case tracking-normal">{plays(film.views)}</dd>
                </div>
              </dl>
            </div>
          </Link>
        </Reveal>
      )}
    </section>
  );
}

const sprockets =
  "h-3 w-full bg-[repeating-linear-gradient(90deg,var(--bg)_0_14px,transparent_14px_30px)]";

function Stories({ films }: { films: Film[] }) {
  if (!films.length) return null;
  return (
    <section data-region="rail" aria-labelledby="stories-h" className="bg-[var(--c-secondary)] text-[var(--c-secondary-text)]">
      <div className={sprockets} aria-hidden="true" />
      <div className="mx-auto max-w-[1400px] px-5 pb-6 pt-14 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] opacity-75">Reel 02</p>
            <h2 id="stories-h" className="mt-2 text-3xl sm:text-4xl">Adventure stories</h2>
          </div>
          <Link to="/films" data-testid="all-films" className="flex min-h-11 items-center gap-1 text-sm font-semibold uppercase tracking-[0.18em] hover:underline">
            Every film <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-14 pt-4 sm:gap-6 sm:px-8 [scrollbar-width:thin]">
        {films.map((f, i) => (
          <Link
            key={f.id}
            to={`/watch?id=${encodeURIComponent(f.id)}`}
            data-testid="open-story"
            className="group relative h-[300px] flex-none snap-start overflow-hidden rounded-[4px] bg-background sm:h-[420px]"
            style={{ aspectRatio: isUpright(f) ? "9 / 16" : "16 / 9" }}
          >
            {f.poster ? (
              <img src={f.poster} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.25em] text-muted-foreground">Still preparing…</div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-[var(--scrim-bottom)] p-4 text-[var(--on-image)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--on-image-muted)]">
                {indexLabel(i + 1)} — {formatDuration(f.duration_ms)}
              </p>
              <p className="mt-1 line-clamp-2 font-display text-base font-bold leading-snug">{f.title}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className={sprockets} aria-hidden="true" />
    </section>
  );
}

function Regions({ films }: { films: Film[] }) {
  const atlas = atlasOf(films);
  return (
    <section data-region="custom:regions" aria-labelledby="regions-h" className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">The atlas</p>
          <h2 id="regions-h" className="mt-2 text-3xl sm:text-5xl">Where to next</h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">Every country on Earth, six ways in.</p>
      </Reveal>
      <div className="grid gap-px overflow-hidden rounded-[4px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {REGIONS.map((r, i) => {
          const count = films.filter((f) => r.countries.some((c) => atlas.get(c)?.includes(f))).length;
          return (
            <Link
              key={r.id}
              to={`/destinations#${r.id}`}
              data-testid={`region-${r.id}`}
              className="group relative flex min-h-[200px] flex-col justify-between bg-background p-7 transition-colors hover:bg-[var(--surface-hover)] lg:min-h-[240px]"
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-5xl font-extrabold text-muted-foreground transition-colors group-hover:text-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <ArrowUpRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--interactive)]" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl">{r.name}</h3>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  {r.countries.length} places · {count ? filmsLabel(count) : "films to come"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function Home() {
  const { videos, loading } = useVideos();
  const films = videos as unknown as Film[];
  const featured = films.find((f) => !isUpright(f)) || films[0];
  const rest = films.filter((f) => f !== featured);
  return (
    <main data-page-kind="home">
      <Hero />
      <Featured film={featured} loading={loading} />
      <Stories films={rest} />
      <Regions films={films} />
    </main>
  );
}
