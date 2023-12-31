import { data } from "../store/data.js";
import { index } from "../store/mod_index.js";

export async function checkIndex() {
  if (index.version === INDEX_VERSION) return;

  cML.log("Index is outdated!");

  await fetchIndex();

  const newVersion = index.version;
  if (newVersion === INDEX_VERSION) return;

  cML.error(
    `Updated index is still outdated! Expected ${INDEX_VERSION}, got ${newVersion}... Is cML outdated?`,
  );
}

export async function fetchIndex() {
  const indexLocation = data().indexUrl ?? INDEX_URL;

  const res = await fetch(indexLocation);
  if (!res.ok) return cML.error("Failed to fetch index");

  writeIndex(await res.json());
}

export function writeIndex(json: any) {
  index.version = json["version"];
  index.hash = json["hash"];
  index.mods = json["mods"];
}
