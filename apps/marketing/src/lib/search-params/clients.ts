import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const clientsSearchParsers = {
  search: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
};

export const clientsSearchCache = createSearchParamsCache(clientsSearchParsers);
