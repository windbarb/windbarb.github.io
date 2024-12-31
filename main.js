const allCodes = [
  "cp1",
  "hka",
  "cch",
  "ccb",
  "gi",
  "hss",
  "se",
  "lam",
  "lfs",
  "ngp",
  "np",
  "pen",
  "skg",
  "sc",
  "sha",
  "sek",
  "bhd",
  "sf",
  "tkl",
  "plc",
  "tpk",
  "tme",
  "tc",
  "jkb",
  "shl",
  "tun",
  "wgl",
  "wlp",
  "hks",
];

const defaultCodes = ["hss", "bhd", "tme", "plc"];

const appId = "app";
const lsKey = "last_codes";

/**
 * @template T
 */
class Container {
  /**
   * @param {T} value
   */
  constructor(value) {
    this.value = value;
  }

  /**
   * @template S
   * @param {function(T): S} fn
   */
  do(fn) {
    fn(this.value);
    return this;
  }

  /**
   * @template S
   * @param {function(T): S} fn
   */
  map(fn) {
    return new Container(fn(this.value));
  }

  done() {
    return this.value;
  }
}

/**
 * @template T
 * @param {function(): T} fn
 */
function make(fn) {
  return new Container().map(fn);
}

/**
 * @return {string[]}
 */
function loadCodes() {
  return JSON.parse(
    localStorage.getItem(lsKey) ?? JSON.stringify(defaultCodes)
  );
}

/**
 * @param {string[]} codes
 */
function saveCodes(codes) {
  localStorage.setItem(lsKey, JSON.stringify(codes));
}

/**
 * @param {HTMLElement} app
 */
function addSeparater(app) {
  app.appendChild(
    make(() => document.createElement("div"))
      .do((el) => el.classList.add("separater"))
      .done()
  );
}

/**
 * @param {HTMLElement} app
 * @param {string} code
 */
function addChart(app, code) {
  app.appendChild(
    make(() => document.createElement("div"))
      .do((el) => el.classList.add("chart"))
      .do((el) => {
        el.dataset.code = code;
      })
      .do((el) =>
        el.appendChild(
          make(() => document.createElement("div"))
            .do((el) => el.classList.add("subchart"))
            .do((el) => el.classList.add("spd"))
            .do((el) =>
              el.appendChild(
                make(() => document.createElement("img"))
                  .do((el) => {
                    el.src = `https://www.hko.gov.hk/wxinfo/ts/${code}spd.png`;
                  })
                  .done()
              )
            )
            .done()
        )
      )
      .do((el) =>
        el.appendChild(
          make(() => document.createElement("div"))
            .do((el) => el.classList.add("subchart"))
            .do((el) => el.classList.add("dir"))
            .do((el) =>
              el.appendChild(
                make(() => document.createElement("img"))
                  .do((el) => {
                    el.src = `https://www.hko.gov.hk/wxinfo/ts/${code}dir.png`;
                  })
                  .done()
              )
            )
            .done()
        )
      )
      .done()
  );
}

/**
 * @param {HTMLElement} app
 */
function getCharts(app) {
  const charts = app.querySelectorAll(".chart");
  const codes = Array.from(charts.values())
    .map((el) => el.dataset.code)
    .filter(Boolean);
  saveCodes(codes);
}

function main() {
  const app = document.getElementById(appId);
  if (app == null) {
    return;
  }
  const codes = loadCodes();
  codes.forEach((code, idx) => {
    if (idx > 0) {
      addSeparater(app);
    }
    addChart(app, code);
  });
  getCharts(app);
}

main();
