import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useVideo, useVideos, formatDuration } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Player from "@/components/Player";
import FilmCard from "@/components/FilmCard";
import { Film, countriesOf, plays } from "@/lib/travel";

export default function Watch() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const { video, loading, error } = useVideo(id);
  const { videos } = useVideos();
  const more = (videos as unknown as Film[]).filter((f) => f.id !== id).slice(0, 3);
  const v: any = video;
  const places = v ? countriesOf(v) : [];
  const synopsis = v?.description || v?.summary;

  return (
    <main data-page-kind="watch" className="pb-24">
      <section data-region="player" className="bg-black">
        <div className="relative mx-auto aspect-video w-full max-w-[min(1560px,calc(82vh*16/9))]">
          <Player video={video} />
          {(loading || (v && !v.sources?.length) || error || !id) && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--c-secondary)] text-center text-[var(--c-secondary-text)]">
              {loading ? (
                <Skeleton className="absolute inset-0 rounded-none" />
              ) : error || !id ? (
                <div className="px-6">
                  <p className="text-lg">{error || "No film chosen."}</p>
                  <Button asChild className="mt-4 h-11 rounded-sm" data-testid="watch-back-films">
                    <Link to="/films">Browse the films</Link>
                  </Button>
                </div>
              ) : (
                <p className="px-6 text-sm uppercase tracking-[0.25em]">This film is still preparing…</p>
              )}
            </div>
          )}
        </div>
      </section>

      <section data-region="details" className="mx-auto max-w-[1100px] px-5 pt-10 sm:px-8">
        <Link to="/films" data-testid="back-to-films" className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Travel Films
        </Link>
        {loading ? (
          <div className="mt-4 space-y-3">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ) : v ? (
          <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_260px]">
            <div>
              <h1 className="text-3xl leading-tight sm:text-5xl">{v.title}</h1>
              {synopsis && <p className="mt-5 max-w-[68ch] leading-relaxed text-muted-foreground">{synopsis}</p>}
            </div>
            <dl className="grid h-fit grid-cols-3 gap-4 border-t border-border pt-4 text-xs uppercase tracking-[0.2em] lg:grid-cols-1">
              <div>
                <dt className="text-muted-foreground">Length</dt>
                <dd className="mt-1 font-mono text-sm normal-case tracking-normal">{formatDuration(v.duration_ms) || "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Place</dt>
                <dd className="mt-1 text-sm normal-case tracking-normal">{places.join(", ") || "Place to come"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Seen</dt>
                <dd className="mt-1 text-sm normal-case tracking-normal">{plays(v.views)}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </section>

      {more.length > 0 && (
        <section data-region="up-next" aria-labelledby="more-h" className="mx-auto mt-20 max-w-[1400px] border-t border-border px-5 pt-12 sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">Keep travelling</p>
          <h2 id="more-h" className="mt-2 text-3xl">More journeys</h2>
          <div className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-10">
            {more.map((f, i) => (
              <FilmCard key={f.id} film={f} index={i} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
