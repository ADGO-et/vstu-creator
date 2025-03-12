import { useTranslation } from "react-i18next";
import { TbIndentIncrease } from "react-icons/tb";

export default function EmptyList({ message }: { message?: string }) {
  const { t } = useTranslation();
  message = message || t("common.error.emptyList");
  return (
    <div className="text-foreground/60 p-3 flex items-center gap-3">
      <TbIndentIncrease className="text-2xl" />
      <span>{message}</span>
    </div>
  );
}
