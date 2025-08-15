import logo from "@/assets/logos/image.png";
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
import { TeacherLinks } from "./constants/teacher-links";
import ethiotelecom from '@/assets/logos/Ethiotelecom.png';

export default function TeacherNav({ showLogo = false }: { showLogo?: boolean }) {
  return (
    <div className="container">
      {/* desktop */}
      <nav className="hidden md:flex items-center">
        {
          showLogo && (
            <Link to="/teacher/referal" className="mr-4">
            <img src={ethiotelecom} alt="teletemari logo" className="max-h-[4.5rem]" />
          </Link>
          )
        }
        <div className="flex-1 flex justify-end gap-3 items-center">
          <Avatar role="Teacher" />
          <Link to="/teacher/referal" className="mr-4">
            <img src={logo} alt="teletemari logo" className="max-h-[4.5rem]" />
          </Link>
          {/* logo removed here when expanded per requirement */}
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
                {TeacherLinks.map((link) => (
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
          <Avatar role="Teacher" />
        </div>
      </nav>
    </div>
  );
}
