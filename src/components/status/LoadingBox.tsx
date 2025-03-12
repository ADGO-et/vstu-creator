import { CgSpinnerTwo } from "react-icons/cg";

export default function LoadingBox({
  className,
  isLoading = true,
  text,
}: {
  className?: string;
  isLoading?: boolean;
  text?: string;
}) {
  if (!isLoading) return null;

  return (
    <div
      className={`border p-3 rounded flex justify-center items-center bg-muted ${className}`}
    >
      <CgSpinnerTwo className="animate-spin mr-2" />
      {text}
    </div>
  );
}
