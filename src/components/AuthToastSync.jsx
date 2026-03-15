import { useAuth } from "@clerk/react";
import { useEffect, useRef } from "react";

import { consumePendingAuthAction } from "../utils/authToastState";
import { useToast } from "./ToastProvider";

function AuthToastSync() {
  const { isSignedIn } = useAuth();
  const { success } = useToast();
  const previousSignedInRef = useRef(isSignedIn);

  useEffect(() => {
    if (!previousSignedInRef.current && isSignedIn) {
      const action = consumePendingAuthAction();

      if (action === "sign-up") {
        success("Sign up successful", "Your account is ready and you can start uploading.");
      } else if (action === "sign-in") {
        success("Sign in successful", "You are now logged in and ready to continue.");
      }
    }

    previousSignedInRef.current = isSignedIn;
  }, [isSignedIn, success]);

  return null;
}

export default AuthToastSync;
