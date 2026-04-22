import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Digest_Token = () => {
  const { value } = useParams();
  const decodedValue = decodeURIComponent(value ?? "");

  useEffect(() => {
    // Set the cookie
    document.cookie = `token=${decodedValue}; path=/; SameSite=Lax`;

    // Add a delay before redirection
    setTimeout(() => {
      window.location.href = "/";
    }, 100); // Delay in milliseconds
  }, [decodedValue]);

  return null; // This component doesn't render anything
};

export default Digest_Token;