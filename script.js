const dataByCode = {
  cp1: { name: "中環碼頭" },
  hka: { name: "赤鱲角" },
  cch: { name: "長洲" },
  ccb: { name: "長洲泳灘" },
  gi: { name: "青洲" },
  hss: { name: "香港航海學校" },
  se: { name: "啟德" },
  kp: { name: "京士柏" },
  lam: { name: "南丫島" },
  lfs: { name: "流浮山" },
  ngp: { name: "昂坪" },
  np: { name: "北角" },
  pen: { name: "坪洲" },
  skg: { name: "西貢" },
  sc: { name: "沙洲" },
  sha: { name: "沙田" },
  sek: { name: "石崗" },
  bhd: { name: "赤柱" },
  sf: { name: "天星碼頭" },
  tkl: { name: "打鼓嶺" },
  plc: { name: "大美督" },
  tpk: { name: "大埔滘" },
  tme: { name: "塔門" },
  tc: { name: "大老山" },
  jkb: { name: "將軍澳" },
  shl: { name: "青衣" },
  tun: { name: "屯門" },
  wgl: { name: "橫瀾島" },
  wlp: { name: "濕地公園" },
  hks: { name: "黃竹坑" },
};

const LAST_CODES = "last_codes";

function isArrayOfStrings(v) {
  return Array.isArray(v) && v.every((item) => typeof item === "string");
}

const codes = {
  get: () => {
    try {
      const result = JSON.parse(localStorage.getItem(LAST_CODES));
      if (!isArrayOfStrings(result)) {
        throw "Cannot parse previous settings";
      }
      return result;
    } catch {
      return ["hss", "bhd", "tme", "plc"];
    }
  },
  set: (x) => {
    localStorage.setItem(LAST_CODES, JSON.stringify(x));
  },
};

const app = document.querySelector("#app");

function index() {
  const render = (items) => {
    app.innerHTML = "";
    items.forEach(({ code, name }) => {
      const item = document.querySelector("#chart").content.cloneNode(true);
      const graph = item.querySelector(".graph");
      graph.style.backgroundImage = `url(https://www.hko.gov.hk/wxinfo/ts/${code}spd.png)`;
      graph.onclick = () => {
        if (graph.dataset.type === "spd") {
          graph.dataset.type = "dir";
          graph.style.backgroundImage = `url(https://www.hko.gov.hk/wxinfo/ts/${code}spd.png)`;
        } else {
          graph.dataset.type = "spd";
          graph.style.backgroundImage = `url(https://www.hko.gov.hk/wxinfo/ts/${code}dir.png)`;
        }
      };
      const label = item.querySelector(".label");
      label.textContent = name;
      app.appendChild(item);
    });
  };

  const items = codes.get().map((code) => ({ code, ...dataByCode[code] }));
  render(items);
}

function settings() {
  const render = (items) => {
    app.innerHTML = "";
    items.forEach(({ code, name, checked }) => {
      const item = document.querySelector("#checkbox").content.cloneNode(true);
      const input = item.querySelector(".input");
      input.id = code;
      input.checked = checked;
      input.onchange = (v) => {
        if (input.checked) {
          codes.set([...codes.get(), code]);
        } else {
          codes.set(codes.get().filter((x) => x != code));
        }
        settings();
      };
      const label = item.querySelector(".label");
      label.textContent = name;
      label.htmlFor = code;
      app.appendChild(item);
    });
  };

  const current = codes.get();
  const unchecked = Object.keys(dataByCode).filter(
    (code) => !current.includes(code)
  );
  const items = [...current, ...unchecked].map((code) => ({
    code,
    ...dataByCode[code],
    checked: current.includes(code),
  }));
  render(items);
}
