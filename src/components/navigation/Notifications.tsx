import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AxiosError } from "axios";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineBell } from "react-icons/ai";
import Loading from "../status/Loading";
import ErrorMessage from "../status/ErrorMessage";
import React from "react";

interface NotificationProps {
  isLoading: boolean;
  error: AxiosError | null;
  children: ReactNode;
}

const Notifications = ({ isLoading, error, children }: NotificationProps) => {
  const { t } = useTranslation();
  const hasNotifications = React.Children.count(children) > 0;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <AiOutlineBell className="text-3xl text-primary" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="absolute md:top-full right-0 mt-2 md:w-96 z-50 rounded-3xl">
        <div className="bg-[#f9fff7] border border-primary h-96 w-full flex flex-col text-center rounded-3xl">
          <div className="flex flex-nowrap justify-between p-2 md:space-x-3 md:p-4 min-w-fit">
            <h4 className="mr-8">{t("common.notif.title")}</h4>
            <button className="text-primary text-sm whitespace-nowrap">
              {t("common.notif.markAll")}
            </button>
          </div>

          <hr className="border-primary w-full" />
          {isLoading && (
            <div className="flex-grow flex items-center justify-center">
              {" "}
              <Loading />
            </div>
          )}
          {error && (
            <div className="flex-grow flex items-center justify-center">
              <ErrorMessage error={error} />
            </div>
          )}
          {!isLoading && !error && (
            <div
              className={`flex-grow flex ${
                hasNotifications
                  ? "items-start justify-start pl-4"
                  : "items-center justify-center"
              }`}
            >
              {hasNotifications ? children : <p>{t("common.notif.noNotif")}</p>}
            </div>
          )}
          <hr className="border-primary w-full" />
          <button className="text-primary flex justify-center p-4 text-sm">
            {t("common.notif.viewAll")}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
