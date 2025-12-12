import fs from "fs-extra";
const FILE = "./store.json";

export function loadStore(defaults = {}) {
  try {
    if (!fs.existsSync(FILE)) {
      fs.writeJsonSync(FILE, defaults, { spaces: 2 });
      return defaults;
    }
    const data = fs.readJsonSync(FILE);
    const merged = { ...defaults, ...data };
    fs.writeJsonSync(FILE, merged, { spaces: 2 });
    return merged;
  } catch (e) {
    console.error("loadStore error", e);
    fs.writeJsonSync(FILE, defaults, { spaces: 2 });
    return defaults;
  }
}

export function saveStore(obj) {
  fs.writeJsonSync(FILE, obj, { spaces: 2 });
}
