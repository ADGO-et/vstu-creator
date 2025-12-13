// import { useGetParentProfile, useGetStudentProfile } from "@/services/user";
// import { RiErrorWarningLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import Loading from "../status/Loading";

export default function Avatar({
  role,
}: {
  role: "Teacher" | "Sales" | "creator";
}) {
  // const parentQ = useGetParentProfile({ enabled: role === "parent" });
  // const studentQ = useGetStudentProfile({ enabled: role === "student" });

  let letter: string | undefined;
  if (role === "Teacher") letter = 'T'
  else if (role === "Sales") letter = 'S'
  else if (role === "creator") letter = 'CC'

  let to: string;
  if (role === "Teacher") to = "/teacher/profile";
  else if (role === "Sales") to = "/sales/profile";
  else if (role === 'creator') to = "";
  else to = "/admin/profile";

  return (
    <Link
      to={to}
      className="bg-primary w-9 h-9 flex justify-center items-center text-background rounded-full"
    >
      <Loading isLoading={false} />
      {letter && <span>{letter.toUpperCase()}</span>}
      {/* {(parentQ.error || studentQ.error) && (
        <RiErrorWarningLine className="text-destructive text-2xl" />
      )} */}
    </Link>
  );
}
