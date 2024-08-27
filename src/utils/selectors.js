import COUNTRIES from "../json/countries.json";
import STATES from "../json/states.json";
import COUNTIES from "../json/counties.json";
import SPORTS from "../json/sports.json";
import { generic } from "./generic";

const memoize = (fn) => {
  const cache = {};
  return (...args) => {
    const stringifiedArgs = JSON.stringify(args);
    return cache[stringifiedArgs] || (cache[stringifiedArgs] = fn(...args));
  };
};

const getCountries = memoize(() => [
  ...COUNTRIES.map((c) => ({
    value: c,
    label: c,
  })),
]);

const getStates = memoize(() => STATES.map((s) => ({ value: s, label: s })));

const getCounties = memoize(() =>
  COUNTIES.map((c) => ({ value: c.County, label: c.County }))
);

const getSports = memoize(() =>
  generic.arr.orderByAlphabet(SPORTS.map((s) => ({ value: s, label: s })))
);

const selectors = {
  countries: getCountries(),
  states: getStates(),
  counties: getCounties(),
  sports: getSports(),
};

export default selectors;
