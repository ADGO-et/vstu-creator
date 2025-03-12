import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function NotFound({ home }: { home: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center items-center p-6 min-h-screen w-[100vw]">
      <Card className="text-center max-w-[600px]">
        <CardHeader>
          <CardTitle className="text-8xl text-primary">404</CardTitle>
          <CardDescription>{t("common.notFound.desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to={home}>
            <Button>{t("common.notFound.backHome")}</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
