import { useEffect, useRef } from "react";
// import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import AddSidebar from "../navigation/AddSidebar";
// import Footer from "../navigation/Footer";
// import AdminNav from "./AdminNav";
import CCNav from "./ccNav";
import { CClinks } from "./constants/cc-link";
// import { adminLinks } from "./constants/admin-links";

export default function ContentCreatorLayout() {
  // const { i18n } = useTranslation();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   i18n.changeLanguage("en");
  // }, [i18n]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="h-screen flex flex-col">
      <CCNav />
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="min-h-screen">
          <AddSidebar links={CClinks}>
            <main className="pt-6 min-h-screen">
              <Outlet />
            </main>
          </AddSidebar>
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
}
