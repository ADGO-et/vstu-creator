import { useLogout } from "@/services/user";
// import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../status/ErrorMessage";
import { Button } from "../ui/button";

export default function Logout() {
  // const { t } = useTranslation();
  const logoutQ = useLogout();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 py-6">
      <h1 className="text-4xl"> Log Out</h1>
      <p>Are you sure you want to logout?</p>
      <div className="flex flex-col gap-3">
        <ErrorMessage error={logoutQ.error} />
        <div>
          <Button
            isLoading={logoutQ.isPending}
            variant="destructive"
            onClick={() => {
              logoutQ.mutate(undefined, {
                onSuccess: () => navigate("/"),
              });
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
