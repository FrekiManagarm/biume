import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const patientsSearchParsers = {
  search: parseAsString.withDefault(""),
  type: parseAsString.withDefault("tous"),
  page: parseAsInteger.withDefault(1),
};

export const patientsSearchCache = createSearchParamsCache(
  patientsSearchParsers,
);
