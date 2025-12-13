import { useState } from "react";
import { UserRole, SignupState } from "@/types/signup";

export function useSignup() {
  const [state, setState] = useState<SignupState>({
    role: "teacher",
    isLoading: false,
    error: null,
    success: false,
  });

  const setRole = (role: UserRole) => {
    setState((prev) => ({ ...prev, role, error: null, success: false }));
  };

  const resetState = () => {
    setState((prev) => ({ ...prev, error: null, success: false }));
  };

  return {
    ...state,
    setRole,
    resetState,
  };
}
