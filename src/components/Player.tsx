import { useEffect, useRef } from "react";

const LICENSE_KEY = "38bdb286-46fc-4a7d-ba6b-6295bbd8d368";

export default function Player({ video }: { video: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !video?.sources?.length) return;
    const source = video.sources[video.sources.length - 1];
    const autoplay =
      video.player?.autoplay === true && !matchMedia("(prefers-reduced-motion: reduce)").matches;

    el.textContent = "";

    const ce: CustomElementRegistry | undefined = (window as any).customElements;
    if (!ce || !ce.get("qencode-player")) {
      // Fallback: the player script did not load — still play the film.
      const v = document.createElement("video");
      v.src = source.src;
      v.controls = true;
      v.playsInline = true;
      if (video.poster) v.poster = video.poster;
      if (autoplay) v.autoplay = true;
      v.className = "h-full w-full bg-black";
      el.appendChild(v);
      let alive = true;
      if (ce) {
        // If the script arrives late, swap the fallback for the real player.
        ce.whenDefined("qencode-player").then(() => {
          if (alive) mount();
        });
      }
      return () => {
        alive = false;
        el.textContent = "";
      };
    }

    function mount() {
      if (!el) return;
      const config: any = {
        design: "1",
        licenseKey: LICENSE_KEY,
        videoSources: [{ src: source.src, type: source.type }],
        poster: video.poster || undefined,
      };
      if (autoplay) config.autoplay = true;
      if (video.vr?.projection) {
        const raw = String(video.vr.projection);
        const stereo = /_TB$/i.test(raw) ? "TB" : /_LR$/i.test(raw) ? "LR" : "mono";
        const projection = /EAC/i.test(raw) ? "eac" : /CUBE/i.test(raw) ? "cubemap" : "equirectangular";
        const fov = /^180/i.test(raw) ? "180" : "360";
        config.spatialVideo = { fov, projection, stereoLayout: stereo };
      }
      if (video.subtitles?.length) {
        config.textTracks = video.subtitles
          .filter((s: any) => s.format === "vtt")
          .map((s: any) => ({ src: s.url, label: s.label, language: s.language }));
      }
      const player = document.createElement("qencode-player");
      const spec = document.createElement("script");
      spec.type = "application/json";
      spec.textContent = JSON.stringify(config);
      player.appendChild(spec);
      el.textContent = "";
      el.appendChild(player);
      const PA = (window as any).PlaybackAnalytics;
      if (video.analytics && PA) {
        PA.init({ ...video.analytics, videoSelector: "#player_container video" });
      }
    }

    mount();
    return () => {
      el.textContent = "";
    };
  }, [video]);

  return <div id="player_container" ref={containerRef} className="absolute inset-0" />;
}
