import { MdModeEditOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function EditLink({ to }: { to: string }) {
  return (
    <Link to={to}>
      <Button size={"sm"} variant={"ghost"}>
        <MdModeEditOutline />
      </Button>
    </Link>
  );
}
