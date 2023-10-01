export const parseCookies = (cookiesStr: string): Record<string, string | undefined> => {
  return cookiesStr
    .split('; ')
    .map((cookieStr) => cookieStr.split('='))
    .reduce<Record<string, string>>(
      (acc, [key, value]) => ({
        ...acc,
        [key.trim()]: value,
      }),
      {}
    );
};
