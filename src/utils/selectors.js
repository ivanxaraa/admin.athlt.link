import COUNTRIES from "../json/countries.json";
import STATES from "../json/states.json";
import COUNTIES from "../json/counties.json";

const memoize = (fn) => {
  const cache = {};
  return (...args) => {
    const stringifiedArgs = JSON.stringify(args);
    return cache[stringifiedArgs] || (cache[stringifiedArgs] = fn(...args));
  };
};

const getCountries = memoize(() => [
  ...COUNTRIES.filter((c) => c !== "USA").map((c) => ({
    value: c,
    label: c,
  })),
  { value: "USA", label: "USA" },
]);

const getStates = memoize(() => STATES.map((s) => ({ value: s, label: s })));

const getCounties = memoize(() =>
  COUNTIES.map((c) => ({ value: c.County, label: c.County }))
);

const selectors = {
  countries: getCountries(),
  states: getStates(),
  counties: getCounties(),
};

export default selectors;
