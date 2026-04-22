import { getCookie } from "./DelCookie";
const getToken = (role: string = "cashier"): string | null => {
  const tokenName = role === "accountant" ? "accountantToken" : "token";
  return getCookie(tokenName) || null;
};

export default getToken;
