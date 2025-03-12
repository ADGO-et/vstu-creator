import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
// import { ImWarning } from "react-icons/im";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { TbAlertOctagonFilled } from "react-icons/tb";

interface ErrorMessageProps {
  error: AxiosError | null;
  retry?: () => void;
  className?: string;
  title?: string,
}

export default function ErrorMessage({
  error,
  retry,
  title: externalTitle,
  className = "",
}: ErrorMessageProps) {
  const { t } = useTranslation();

  if (!error) return null;

  const extractMessage = (): string => {
    if (!error) return "";

    const status = error.response?.status;
    const isServerError = status && status >= 500 && status < 600;
    if (isServerError) return t("common.error.serverError");

    const data = error.response?.data;

    if (typeof data === "string") {
      try {
        const parsedData = JSON.parse(data);
        return parsedData.message || t("common.error.unknownError");
      } catch {
        return data;
      }
    }

    if (typeof data === "object" && data !== null) {
      if ("message" in data) {
        return (data as { message: string }).message || t("common.error.unknownError");
      }
      return t("common.error.unknownError");
    }

    return error.message;
  };

  const title = externalTitle || t("common.error.error");
  console.log(title);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`relative bg-red-50 border border-red-400 text-red-700 shadow-lg rounded-2xl p-5 backdrop-blur-lg backdrop-filter ${className}`}
      role="alert"
    >
      <div className="flex items-center gap-4">
        {/* <div className="bg-red-500 text-white p-2 rounded-full shadow-md">
          <ImWarning className="text-xl" />
        </div> */}
        <TbAlertOctagonFilled className="text-red-600" size={35}/>
        <div className="flex-1">
          <p className="font-bold text-lg text-red-600">Error</p>
          <p className="text-sm text-red-500 mt-1">{extractMessage()}</p>
          {retry && (
            <Button
              onClick={retry}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105"
              size="sm"
            >
              {t("common.error.retry")}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
