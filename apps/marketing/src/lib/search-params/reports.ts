import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const reportsSearchParsers = {
  search: parseAsString.withDefault(""),
  status: parseAsString.withDefault("tous"),
  page: parseAsInteger.withDefault(1),
};

export const reportsSearchCache = createSearchParamsCache(reportsSearchParsers);
