import { CgSpinnerTwo } from "react-icons/cg";

export default function Loading({ isLoading = true }: { isLoading?: boolean }) {
  if (!isLoading) return null;

  return <CgSpinnerTwo className="animate-spin" />;
}
