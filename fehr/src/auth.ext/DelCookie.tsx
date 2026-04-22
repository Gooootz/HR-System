export function clearCookie(name: string) {
  const domainParts = window.location.hostname.split(".");
  const pathParts = window.location.pathname.split("/").filter(Boolean);

  // Attempt to delete cookie at various path levels
  let pathCurrent = " path=/";
  while (pathParts.length > 0) {
    document.cookie = `${name}=; Max-Age=-1;${pathCurrent}; Secure; SameSite=None`;
    pathCurrent += `/${pathParts.pop()}`;
  }
  document.cookie = `${name}=; Max-Age=-1;${pathCurrent}; Secure; SameSite=None`;

  // Attempt to delete cookie at various domain levels
  let domainCurrent =
    domainParts.length > 1 ? ` domain=.${domainParts.pop()}` : "";
  while (domainParts.length > 1) {
    domainCurrent = `.${domainParts.pop()}${domainCurrent}`;
    document.cookie = `${name}=; Max-Age=-1; path=/;${domainCurrent}; Secure; SameSite=None`;
  }
  document.cookie = `${name}=; Max-Age=-1; path=/; domain=${window.location.hostname}; Secure; SameSite=None`;
}

// Utility function to get a cookie value
export function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}