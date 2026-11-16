import { useState, useEffect, useCallback } from "react";

const CONFIG = () => window.SITE_CONFIG;
const sdk = () => window.project;

export function useConfig() {
  return CONFIG();
}

export function useSession() {
  const [session, setSession] = useState<{
    id: string;
    role: string;
    expiresAt: number;
  } | null>(null);

  useEffect(() => {
    const s = sdk()?.session?.();
    setSession(s ?? null);
  }, []);

  return session;
}

interface Video {
  id: string;
  title: string;
  description: string;
  summary?: string;
  poster: string | null;
  duration_ms: number | null;
  original_resolution?: string;
  views: number;
  sources: any[];
  subtitles?: any[];
  chapters?: any[];
  locked: boolean;
  required?: string[];
  analytics?: Record<string, unknown>;
  /** How the owner wants the player to behave (project settings). */
  player?: { autoplay?: boolean };
  vr?: { projection?: string };
  series?: string[];
}

interface UseVideosResult {
  videos: Video[];
  loading: boolean;
  error: string | null;
}

export function useVideos(opts?: { sort?: string }): UseVideosResult {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await sdk().videos.list(opts);
        if (!cancelled) {
          setVideos(res);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? "Failed to load videos");
          setLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [opts?.sort]);

  return { videos, loading, error };
}

export function useVideo(id: string | null) {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setVideo(null);
      setError(null);
      setLoading(false);
      return;
    }
    setVideo(null);
    setError(null);
    setLoading(true);
    let cancelled = false;
    async function load() {
      try {
        const res = await sdk().videos.get(id);
        if (!cancelled) {
          setVideo(res);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? "Video not found");
          setLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  return { video, loading, error };
}

export function formatDuration(ms: number | null | undefined): string {
  if (!ms) return "";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}:${String(m % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export function useSiteUrl() {
  const config = useConfig();
  const preview = new URLSearchParams(window.location.search).get("preview");

  return useCallback(
    (path: string) => {
      const base = (config.baseUrl || `/sites/${config.slug}/`).replace(/\/+$/, "");
      const url = base + "/" + path.replace(/^\/+/, "");
      if (!preview) return url;
      return url + (path.includes("?") ? "&" : "?") + "preview=" + encodeURIComponent(preview);
    },
    [config.baseUrl, config.slug, preview]
  );
}
