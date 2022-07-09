import { React, react } from "./deps.ts";
import { useState, useEffect, useMemo } from "https://jspm.dev/react@17.0.0";
import { ld } from "https://x.nest.land/deno-lodash@1.0.0/mod.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";

import { generateCSV } from "./util/index.ts";
import file from "./static/data/2022-07-01_Acton-Health-Insurance-Trust-HPHC_index.json" assert { type: "json" };
import {
  IDoc,
  IObj,
  IHeader,
  IReportTemp,
  IPlan,
  INetwork,
} from "./model/index.ts";
import { CSV_HEADER, FILE_NAME } from "./config/index.ts";

function App() {
  const [demofile, setDemoFile] = useState<IDoc>();
  const [csvHeader, setCSVHeader] = useState<IHeader[]>(CSV_HEADER);
  const [prepareData, setPrepareData] = useState<IObj[]>([]);
  const [enteredURL, setEnteredURL] = useState<string>("");
  const [notAllowed, setNotAllowed] = useState<boolean>(false);

  useEffect(() => {
    if (demofile && ld.size(demofile)) {
      const data: IObj[] = [];

      const {
        reporting_entity_name,
        reporting_entity_type,
        reporting_structure,
      } = demofile as IDoc;

      ld.forEach(reporting_structure, (rItem: IReportTemp, index: number) => {
        const row: IObj = {};
        const { allowed_amount_file, in_network_files, reporting_plans } =
          rItem;

        row.plan_number = index;
        row.reporting_entity_name = reporting_entity_name;
        row.reporting_entity_type = reporting_entity_type;

        ld.forEach(ld.head(reporting_plans), (value: string, key: string) => {
          row[key] = value;
        });

        ld.forEach(in_network_files, (nItem: INetwork, index: number) => {
          ld.forEach(nItem, (value: string, key: string) => {
            const dynamicKey =
              key === "description"
                ? `net_description_${index + 1}`
                : `net_location_${index + 1}`;
            row[dynamicKey] = value;
          });
        });

        row.allowed_location = allowed_amount_file.location;

        data.push(row);
      });

      setPrepareData(data);
    }
  }, [demofile]);

  const fetchData = async () => {
    try {
      const { data } = await axiod.get(enteredURL);
      if (data) {
        setDemoFile(data);
      }
    } catch (error) {
      throw new Error(error.message || "Something went wrong!");
    }
  };

  const convertToCSV = () => {
    const isValid = FILE_NAME && csvHeader && prepareData.length > 0;
    if (isValid) {
      setNotAllowed(true);
      const callback = () => setNotAllowed(false);
      generateCSV(csvHeader, prepareData, FILE_NAME, callback);
    }
  };

  const isDisabled = useMemo(() => {
    return (enteredURL as string).trim().length === 0 || notAllowed;
  }, [enteredURL]);

  return (
    <>
      <link rel={"stylesheet"} href={"./static/css/App.css"} />
      <div className="App">
        <div className="wrap">
          <input
            type="text"
            className="input-size"
            placeholder="Enter URL"
            value={enteredURL}
            onChange={(event: { target: { value: string } }) => {
              return setEnteredURL(event.target.value);
            }}
          />
          {!demofile && (
            <button
              className={`btn-gen ${isDisabled ? "is-disabled" : ""}`}
              onClick={fetchData}
            >
              Fetch
            </button>
          )}
          {prepareData.length > 0 && (
            <button
              className={`btn-gen ${isDisabled ? "is-disabled" : ""}`}
              onClick={convertToCSV}
            >
              Convert
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
