import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export default function Back({ steps = 1 }: { steps?: number }) {
  const navigate = useNavigate();
  const dotDots = new Array(steps)
    .fill(0)
    .map(() => "..")
    .join("/");

  const back = () => navigate(dotDots, { relative: "path" });

  return (
    <div>
      <Button className="flex gap-3 pl-0" variant={"ghost"} onClick={back}>
        <IoIosArrowBack className="text-lg" />
        <span>Back</span>
      </Button>
    </div>
  );
}
