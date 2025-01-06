"use server";

import { cookies } from "next/headers";

export async function getServerSideCookie(cookieName: {
  cookieName: string;
}): Promise<{ cookie: string | undefined }> {
  const cookieStore = cookies();
  const cookie = cookieStore.get(cookieName.cookieName);
  console.log("cookie from util", cookie);
  return { cookie: cookie?.value };
}

export async function getClientSideCookie(
  cookieName: string
): Promise<string | undefined> {
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split("; ");
    const foundCookie = cookies.find((row) => row.startsWith(`${cookieName}=`));
    return foundCookie ? foundCookie.split("=")[1] : undefined;
  }
  return undefined;
}

export async function setServerSideCookie(name: string, value: string): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set(name, value);
}