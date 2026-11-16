import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useConfig, useSiteUrl } from "@/lib/hooks";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const NAV = [
  { to: "/", label: "Home", id: "home" },
  { to: "/destinations", label: "Destinations", id: "destinations" },
  { to: "/films", label: "Travel Films", id: "films" },
  { to: "/about", label: "About", id: "about" },
];

export default function Header() {
  const config = useConfig();
  const siteUrl = useSiteUrl();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const overlay = pathname === "/" || pathname === "/about";
  const logo = config.logoUrl || siteUrl("assets/logo.jpg");

  const shell = overlay
    ? "absolute inset-x-0 top-0 z-30 text-[var(--on-image)]"
    : "sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md";
  const bar = overlay ? "bg-[var(--scrim-bottom)] backdrop-blur-sm" : "";

  return (
    <header className={shell} data-region="header">
      <div className={bar}>
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
          <Link to="/" className="flex min-h-11 items-center gap-3" data-testid="home-logo">
            <img src={logo} alt="" width={32} height={32} className="h-8 w-8 rounded-[3px] object-cover" />
            <span className="font-display text-lg font-extrabold uppercase tracking-[0.12em]">{config.siteTitle}</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV.map((n) => (
              <NavLink
                key={n.id}
                to={n.to}
                end={n.to === "/"}
                data-testid={`nav-${n.id}`}
                className={({ isActive }) =>
                  `relative flex min-h-11 items-center px-4 text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors after:absolute after:inset-x-4 after:bottom-2 after:h-[2px] after:origin-left after:bg-primary after:transition-transform ${
                    isActive ? "after:scale-x-100" : "opacity-80 after:scale-x-0 hover:opacity-100 hover:after:scale-x-100"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-sm md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
                aria-label="Open menu"
                data-testid="open-menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[82vw] max-w-sm border-border bg-background text-foreground">
              <SheetTitle className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Navigate</SheetTitle>
              <nav className="mt-8 flex flex-col" aria-label="Mobile">
                {NAV.map((n, i) => (
                  <NavLink
                    key={n.id}
                    to={n.to}
                    end={n.to === "/"}
                    onClick={() => setOpen(false)}
                    data-testid={`mnav-${n.id}`}
                    className={({ isActive }) =>
                      `flex min-h-14 items-baseline gap-4 border-b border-border py-3 font-display text-2xl font-bold uppercase ${
                        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`
                    }
                  >
                    <span className="text-xs tracking-[0.2em] text-muted-foreground">0{i + 1}</span>
                    {n.label}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
