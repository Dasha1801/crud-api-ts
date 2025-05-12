import { BASE_URL } from "../shared/constants";

export const isBaseUrl = (url: string) => {
  const pattern = new RegExp(`^${BASE_URL}/?$`);
  return pattern.test(url);
};

export const matchUrl = (url: string) => url.match(/^\/api\/users\/([a-zA-Z0-9-]+)\/?$/);