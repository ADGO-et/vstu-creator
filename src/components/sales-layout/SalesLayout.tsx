import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AddSidebar from "../navigation/AddSidebar";
import { SalesLinks } from "./constants/sales-links";
import SalesNav from "./SalesNav";

export default function SalesLayout() {
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useLayoutEffect(() => {
    const calc = () => {
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div
      className="h-screen w-full"
      style={{ ["--nav-height" as any]: `${navHeight}px` }}
    >
      {/* Fixed sidebar (full height) */}
      <AddSidebar
        links={SalesLinks}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Fixed navbar (offset by sidebar width) */}
      <div
        ref={navRef}
        className="fixed top-0 right-0 z-40 bg-white border-b left-[var(--sidebar-width)]"
      >
        <SalesNav showLogo={sidebarCollapsed} />
      </div>

      {/* Scrollable main area below navbar */}
      <div
        className="absolute right-0 left-[var(--sidebar-width)]"
        style={{
          top: "var(--nav-height)",
          height: "calc(100vh - var(--nav-height))",
        }}
      >
        <div ref={scrollRef} className="h-full overflow-y-auto px-0">
          <main className="pt-6 container mt-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
