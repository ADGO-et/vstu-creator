import logo from "@/assets/logos/vstu.png";
import tele from "@/assets/logos/tele.png"; // ✅ Second logo
import { Link } from "react-router-dom";
import Avatar from "../navigation/Avatar";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { CClinks } from "./constants/cc-link";

export default function CCNav() {
  return (
    <div className="container">
      {/* Desktop */}
      <nav className="hidden md:flex items-center justify-between py-3">
        {/* Left logo */}
        <Link to="/cc/">
          <img src={tele} alt="vstu logo" className="max-h-[4.25rem]" />
        </Link>

        {/* Right: Avatar and then Second Logo */}
        <div className="flex items-center gap-8">
          <Avatar role="creator" />
          <Link to="/cc/">
            <img
              src={logo}
              alt="teletemari logo"
              className="max-h-[4.25rem] ml-10"
            />
          </Link>
        </div>
      </nav>

      {/* Mobile */}
      <nav className="flex md:hidden items-center justify-between py-3">
        <div>
          <Sheet>
            <SheetTrigger asChild>
              <Button>Menu</Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="text-start pb-6 hidden">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription className="hidden">
                  Navigation links
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-3">
                <Link to="/">
                  <img
                    src={logo}
                    alt="teletemari logo"
                    className="max-h-[2.25rem]"
                  />
                </Link>
                {CClinks.map((link) => (
                  <Link key={link.to} to={link.to}>
                    <SheetClose asChild className="w-full">
                      <Button variant="outline">{link.title}</Button>
                    </SheetClose>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-3">
          <Avatar role="creator" />
        </div>
      </nav>
    </div>
  );
}
