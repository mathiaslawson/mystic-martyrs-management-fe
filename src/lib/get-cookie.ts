import { cookies } from "next/headers";

export const getCookie = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;
  return token;
};
