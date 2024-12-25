export function getCookie(cookieName = "access_token") {
 try {
  const cookies = document?.cookie.split("; ");
  const foundCookie = cookies.find((row) => row.startsWith(`${cookieName}=`));
  console.log("Cookies document log",cookies,foundCookie);
  return foundCookie ? foundCookie.split("=")[1] : null;

 } catch (error) {
  console.error("Error getting cookie",error);
 }
  
}

export function setCookie(name: string, value: string, days: number = 7): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const expiresString = `expires=${expires.toUTCString()}`;
  document.cookie = `${name}=${value};${expiresString};path=/;secure;SameSite=Strict`;
}

