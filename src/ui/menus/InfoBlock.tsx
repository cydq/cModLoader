import { useState } from "preact/hooks";
import { useSnapshot } from "valtio";

import {
  Sysbox,
  Syscription,
  Sysblock,
  Definition,
  ButtonRow,
  Button,
  Input,
} from "../components/index.js";
import { index, resetIndexStore } from "../../store/mod_index.js";
import { data, resetAllSaveStores, resetDataStore } from "../../store/data.js";
import { checkIndex, writeIndex } from "../../util/mod_index.js";
import { Octahedron } from "../components/Octahedron.js";

export function InfoBlock() {
  const idx = useSnapshot(index);
  const dat = useSnapshot(data());

  const [clicks, setClicks] = useState(0);
  const [customIndexData, setCustomIndexData] = useState("");

  const refreshIndex = async () => {
    resetIndexStore();
    await checkIndex();
  };

  const resetData = () => {
    resetIndexStore();
    resetDataStore();
    location.reload();
  };

  const resetAll = () => {
    resetIndexStore();
    resetAllSaveStores();
    location.reload();
  };

  return (
    <Sysblock title="cModLoader">
      <Octahedron clicks={clicks} onClick={() => setClicks(clicks + 1)} />

      <Sysbox title="Info">
        <Syscription>
          cModLoader {cML.__meta__.version} by{" "}
          <Definition definition="DISCORD::'cydq'">cy</Definition>
          <br />
          <br />
          swupmod and octahedron?! by{" "}
          <Definition definition="DISCORD::'ripplesplash'">
            !!__aurora__!!
          </Definition>
        </Syscription>
      </Sysbox>

      <Sysbox title="Mod Index">
        <Syscription>
          There are {Object.keys(idx.mods).length} mods in the index.
          <br />
          The index was last updated on{" "}
          {new Date(idx.hash ?? 0).toISOString().slice(0, 10)}.
        </Syscription>

        <ButtonRow>
          <Button name="Refresh Index" action={refreshIndex} />
        </ButtonRow>
      </Sysbox>

      <Sysbox title="Reset">
        <Syscription>
          Reset all cModLoder data and refresh the page. Optionally, reset mod
          data as well.
        </Syscription>

        <ButtonRow>
          <Button name="Reset cML Data" action={resetData} />
          <Button name="Reset All Data" action={resetAll} />
        </ButtonRow>
      </Sysbox>

      {clicks >= 10 && (
        <Sysbox title="Developer Settings" warning>
          <Syscription>
            Advanced settings that mod developers may find useful. Only modify
            settings in this menu if you know what you're doing!
          </Syscription>

          <Input
            placeholder="https://cml.snowy.cafe/index.json"
            value={dat.indexUrl ?? ""}
            update={(s) => (data().indexUrl = s)}
          />

          <Input
            placeholder="{ ... json ... }"
            value={customIndexData}
            update={setCustomIndexData}
          />

          <ButtonRow>
            <Button
              name="Reset Default"
              action={() => {
                delete data().indexUrl;
                resetIndexStore();
              }}
            />

            <Button
              name="Save Data"
              action={async () => {
                writeIndex(JSON.parse(customIndexData));
                await refreshIndex();
              }}
            />

            <Button name="Save URL" action={() => refreshIndex()} />
          </ButtonRow>
        </Sysbox>
      )}
    </Sysblock>
  );
}
