import { Button } from "@/components/ui/button";
// import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function CreatorProfile() {
  // const { t } = useTranslation();
  return (
    <div className="flex justify-between">
      Content Creator Profile
      <Link to="logout">
        <Button variant={"link"}>Log Out</Button>
      </Link>
    </div>
  );
}
