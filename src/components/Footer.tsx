import { useConfig, useSiteUrl } from "@/lib/hooks";

export default function Footer() {
  const config = useConfig();
  const siteUrl = useSiteUrl();
  const logo = config.logoUrl || siteUrl("assets/logo.jpg");
  return (
    <footer data-region="footer" className="border-t border-border">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" width={28} height={28} className="h-7 w-7 rounded-[3px] object-cover" />
          <span className="font-display text-sm font-extrabold uppercase tracking-[0.18em]">{config.siteTitle}</span>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Destinations · Adventure stories · Travel films, © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
