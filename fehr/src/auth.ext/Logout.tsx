import React, { useEffect } from "react";
import { clearCookie, getCookie } from "./DelCookie";

const Logout: React.FC = () => {
  useEffect(() => {
    const checkAndClearToken = () => {
      const token = getCookie("token");
      if (token) {
        clearCookie("token");
        setTimeout(checkAndClearToken, 850); // Check again after 500ms
      } else {
        window.location.href =
          "https://odeldevidentityserver.azurewebsites.net/logout";
      }
    };

    checkAndClearToken();
  }, []);

  return null;
};

export default Logout;