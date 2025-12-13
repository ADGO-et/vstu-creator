import React, { useEffect, useState } from "react";
import { IconType } from "react-icons/lib";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "@/services/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import ethiotelecom from '@/assets/logos/Ethiotelecom.png';
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarLink {
  title: string;
  to: string;
  Icon?: IconType;
  nestLevel?: number;
}

export default function AddSidebar({
  links = [],
  children,
  collapsed,
  onCollapsedChange,
}: {
  links: SidebarLink[] | null;
  children?: React.ReactNode;
  collapsed?: boolean; // controlled (optional)
  onCollapsedChange?(val: boolean): void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: doLogout, isPending: isLoggingOut } = useLogout();
  const isControlled = collapsed !== undefined;
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const actualCollapsed = isControlled ? (collapsed as boolean) : internalCollapsed;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleRequestLogout = () => {
    if (isLoggingOut) return;
    setConfirmOpen(true);
  };

  const confirmLogout = () => {
    if (isLoggingOut) return;
    doLogout(undefined, {
      onSuccess: () => {
        setConfirmOpen(false);
        navigate("/", { replace: true });
      },
    });
  };

  const toggleCollapsed = () => {
    if (isControlled) onCollapsedChange?.(!actualCollapsed);
    else setInternalCollapsed(c => !c);
  };

  const sidebarWidthRem = actualCollapsed ? 5 : 16; // w-20 (5rem) / w-64 (16rem)

  useEffect(() => {
    // expose width so layouts can offset navbar & content
    document.documentElement.style.setProperty(
      "--sidebar-width",
      `${sidebarWidthRem}rem`
    );
  }, [sidebarWidthRem]);

  const sidebarWidth = actualCollapsed ? "w-20" : "w-64";

  return (
    <>
      {/* Mobile: still renders children + logout */}
      <div className="sm:hidden h-full container flex flex-col">
        <div className="flex-1 overflow-y-auto">{children}</div>
        <div className="border-t pt-3 pb-6">
          <Button
            variant="destructive"
            className="w-full text-center"
            onClick={handleRequestLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>

      {/* Desktop: fixed full-height sidebar only */}
      <div className="hidden sm:block">
        <aside
          className={`fixed top-0 left-0 h-screen ${sidebarWidth} pt-6 border-r-2 border-foreground/20 flex flex-col bg-white transition-all duration-200`}
        >
          {/* Ethiotelecom logo only when expanded */}
          {!actualCollapsed && <img src={ethiotelecom} alt="tele logo" className="p-6 lg:-translate-y-8" />}
          {/* collapse / header */}
          <div className="px-3 pb-4 flex items-center justify-end">
            <button
              onClick={toggleCollapsed}
              className="text-xs rounded border px-2 py-1 hover:bg-muted flex items-center justify-center"
              aria-label={actualCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {actualCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
          {/* links */}
          <div className="space-y-3 px-3 overflow-y-auto flex-1">
            {links?.map((link) => (
              <NavLink
                key={link.to}
                style={
                  !actualCollapsed
                    ? { marginLeft: `${(link.nestLevel || 0) * 1.25}rem` }
                    : undefined
                }
                to={link.to}
                onClick={(e) => {
                  if (location.pathname === link.to || e.detail > 1) {
                    e.preventDefault();
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-2 ${
                    actualCollapsed ? "justify-center" : "px-5"
                  } rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#ddffcf] text-primary"
                      : "hover:bg-muted"
                  }`
                }
                aria-label={link.title}
              >
                {link.Icon && <link.Icon size={22} />}
                {!actualCollapsed && (
                  <span className="whitespace-nowrap">{link.title}</span>
                )}
              </NavLink>
            ))}
          </div>
          {/* logout */}
          <div className={`p-3 ${actualCollapsed ? "flex justify-center" : ""}`}>
            <button
              onClick={handleRequestLogout}
              disabled={isLoggingOut}
              className={`${
              actualCollapsed ? "w-10 h-10 p-0" : "w-full py-2 px-5"
              } flex items-center justify-center gap-2 rounded-lg text-center bg-red-500 text-white hover:bg-red-600 disabled:opacity-60 text-sm font-medium`}
              aria-label="Logout"
              title="Logout"
            >
              <span className="w-full text-center">
              {actualCollapsed ? "⎋" : isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </aside>
      </div>

      {/* Logout confirmation dialog (shared) */}
      <Dialog
        open={confirmOpen}
        onOpenChange={(o) => !isLoggingOut && setConfirmOpen(o)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm logout</DialogTitle>
            <DialogDescription>
              You will be signed out of your session. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
