import React from "react";
import { IconType } from "react-icons/lib";
import { NavLink, useLocation } from "react-router-dom";

interface SidebarLink {
  title: string;
  to: string;
  Icon?: IconType;
  nestLevel?: number;
}

//Todo: extract a <SidebarLink/> component if needed elsewhere
//Todo: make children scrollable
export default function AddSidebar({
  links = [], //Empty if loading or error
  children,
}: {
  links: SidebarLink[] | null;
  children: React.ReactNode;
}) {
  const location = useLocation();
  return (
    <>
      {/* No sidebar for mobile */}
      <div className="sm:hidden h-full container">{children}</div>

      {/* Adds sidebar for desktop  */}
      <div className="hidden sm:flex container h-full max-w-screen overflow-x-auto">
        <div className="pt-12 border-r-2 border-foreground/20 mr-12 space-y-3 px-3">
          {links?.map((link) => (
            <NavLink
              key={link.to}
              style={{ marginLeft: `${(link.nestLevel || 0) * 2.5}rem` }}
              to={link.to}
              onClick={(e) => {
                if (
                  location.pathname === link.to ||
                  e.detail > 1
                ) {
                  e.preventDefault();
                }
              }}
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 px-5 rounded-lg
              ${isActive ? "bg-[#ddffcf] text-primary" : ""} `
              }
            >
              {link.Icon && <link.Icon size={25}/>}
              <span className="whitespace-nowrap">{link.title}</span>
            </NavLink>
          ))}
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}
