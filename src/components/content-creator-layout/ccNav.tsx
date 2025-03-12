// import logo from "@/assets/logos/teletemari.jpg";
import logo from "@/assets/logos/vstu.png";
import { Link } from "react-router-dom";
import Avatar from "../navigation/Avatar";
// import Notifications from "../navigation/Notifications";
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
  // const isLoading = false;
  // const error = null;
  // const notifications = null;
  return (
    <div className="container">
      {/* desktop */}
      <nav className="hidden md:flex gap-9 items-center py-3">
        <div className="flex-1">
          <Link to="/cc/">
            <img src={logo} alt="teletemari logo" className="max-h-[4.25rem]" />
          </Link>
        </div>
        <div className="flex-1 flex justify-end gap-3 items-center">
          {/* <Notifications isLoading={isLoading} error={error}>
            {notifications}
          </Notifications> */}
          <Avatar role="creator" />
        </div>
      </nav>

      {/* mobile  */}
      <nav className="flex md:hidden gap-9 items-center py-3">
        <div className="flex-1">
          <Sheet>
            <SheetTrigger asChild>
              <Button>Menu</Button>
            </SheetTrigger>
            <SheetContent side={"left"}>
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
                    <SheetClose key={link.to} asChild className="w-full">
                      <Button variant={"outline"}>{link.title}</Button>
                    </SheetClose>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 flex justify-end gap-3 items-center">
          <Avatar role="creator" />
        </div>
      </nav>
    </div>
  );
}
