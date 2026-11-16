import { Link } from "react-router-dom";
import { useSiteUrl, useVideos } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/Reveal";
import { REGIONS, filmsLabel } from "@/lib/travel";

export default function About() {
  const siteUrl = useSiteUrl();
  const { videos, loading } = useVideos();
  const countries = REGIONS.reduce((n, r) => n + r.countries.length, 0);

  return (
    <main data-page-kind="text">
      <section data-region="hero" className="relative h-[72svh] min-h-[480px] overflow-hidden">
        <img
          src={siteUrl("assets/about-road.jpg")}
          alt="A winding coastal road at first light"
          width={2100}
          height={900}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-10 mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="inline-block max-w-xl bg-[var(--scrim-bottom)] p-6 text-[var(--on-image)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--on-image-muted)]">About</p>
            <h1 className="mt-2 text-4xl uppercase leading-[0.95] sm:text-6xl">The road is the story</h1>
          </div>
        </div>
      </section>

      <section data-region="body" className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:py-28">
        <Reveal>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-border bg-border">
            <div className="bg-background p-6">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">On the map</dt>
              <dd className="mt-2 font-display text-4xl font-extrabold">{countries}</dd>
            </div>
            <div className="bg-background p-6">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">In the reel</dt>
              <dd className="mt-2 font-display text-4xl font-extrabold">{loading ? "—" : videos.length}</dd>
            </div>
          </dl>
        </Reveal>
        <Reveal className="max-w-[62ch] space-y-6 text-lg leading-relaxed">
          <p>
            Wanderfilm is a collection of travel films: short adventure stories and longer journeys, shot wherever the road leads and cut to be watched in one sitting.
          </p>
          <p className="text-muted-foreground">
            The atlas holds every country on Earth. Most are still waiting for their first film; each new journey lights another
            one up.{!loading && videos.length > 0 && ` Right now the reel holds ${filmsLabel(videos.length)}.`}
          </p>
          <Button asChild size="lg" className="h-12 rounded-sm px-7 text-sm font-semibold uppercase tracking-[0.18em]" data-testid="about-destinations">
            <Link to="/destinations">Open the atlas</Link>
          </Button>
        </Reveal>
      </section>
    </main>
  );
}
