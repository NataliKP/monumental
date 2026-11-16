import { useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Destinations from "@/pages/Destinations";
import Films from "@/pages/Films";
import Watch from "@/pages/Watch";
import About from "@/pages/About";
import { Button } from "@/components/ui/button";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

function NotFound() {
  return (
    <main data-page-kind="text" className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-start justify-center px-6 py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Off the map</p>
      <h1 className="mt-3 text-4xl">This trail doesn't lead anywhere.</h1>
      <Button asChild className="mt-8 h-11 rounded-sm" data-testid="back-home">
        <Link to="/">Back to Wanderfilm</Link>
      </Button>
    </main>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/films" element={<Films />} />
          <Route path="/watch" element={<Watch />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
