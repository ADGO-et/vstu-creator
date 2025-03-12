import { useGetParentProfile, useGetStudentProfile } from "@/services/user";
import { RiErrorWarningLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import Loading from "../status/Loading";

export default function Avatar({
  role,
}: {
  role: "parent" | "student" | "admin" | "creator";
}) {
  const parentQ = useGetParentProfile({ enabled: role === "parent" });
  const studentQ = useGetStudentProfile({ enabled: role === "student" });

  let letter: string | undefined;
  if (role === "parent") letter = parentQ.data?.firstName?.[0];
  else if (role === "student") letter = studentQ.data?.firstName?.[0];
  else if (role === "creator") letter = 'CC'
  else if (role === "admin") letter = "AD";

  let to: string;
  if (role === "student") to = "/student/profile";
  else if (role === "parent") to = "/parent/profile";
  else if (role === 'creator') to = "/cc/profile";
  else to = "/admin/profile";

  return (
    <Link
      to={to}
      className="bg-primary w-9 h-9 flex justify-center items-center text-background rounded-full"
    >
      <Loading isLoading={parentQ.isLoading || studentQ.isLoading} />
      {letter && <span>{letter.toUpperCase()}</span>}
      {(parentQ.error || studentQ.error) && (
        <RiErrorWarningLine className="text-destructive text-2xl" />
      )}
    </Link>
  );
}
