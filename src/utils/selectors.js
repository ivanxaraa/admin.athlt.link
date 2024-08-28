// Import statements ordered alphabetically
import COUNTIES from "../json/counties.json";
import COUNTRIES from "../json/countries.json";
import SPORTS from "../json/sports.json";
import STATES from "../json/states.json";
import { generic } from "./generic";

// Memoization function
const memoize = (fn) => {
  const cache = {};
  return (...args) => {
    const stringifiedArgs = JSON.stringify(args);
    if (stringifiedArgs in cache) return cache[stringifiedArgs];
    cache[stringifiedArgs] = fn(...args);
    return cache[stringifiedArgs];
  };
};

// Functions ordered alphabetically
const getCounties = memoize(() =>
  COUNTIES.sort().map((c) => ({ value: c.County, label: c.County }))
);

const getCountries = memoize(() =>
  COUNTRIES.sort().map((c) => ({ value: c, label: c }))
);

const getSports = memoize(() =>
  SPORTS.sort().map((s) => ({ value: s, label: s }))
);

const getStates = memoize(() =>
  STATES.sort().map((s) => ({ value: s, label: s }))
);

// Selectors object
const selectors = {
  counties: getCounties(),
  countries: getCountries(),
  sports: getSports(),
  states: getStates(),
};

export default selectors;
