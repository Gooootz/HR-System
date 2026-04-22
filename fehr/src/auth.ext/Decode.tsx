import { jwtDecode } from "jwt-decode";
import getToken from "./GetToken";

interface DecodedToken {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  exp: number;
  iss: string;
  aud: string;
  sudo: string;
}

export const DecodeJwt = (): DecodedToken | null => {
  try {
    const decoded: DecodedToken = jwtDecode(getToken() ?? "");
    return decoded;
  } catch (error) {
    //console.error("Invalid token", error);
    return null;
  }
};

export const DecodeJwtV2 = (): DecodedToken | null => {
  try {
    const decoded: DecodedToken = jwtDecode(
      localStorage.getItem("token") ?? ""
    );
    return decoded;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
