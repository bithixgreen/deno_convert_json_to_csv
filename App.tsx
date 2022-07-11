import { React } from "./deps.ts";
import { useState, useEffect, useMemo } from "https://jspm.dev/react@17.0.0";
import { ld } from "https://f7oz6xcbryzf3ky2vfb3y7u7x3iq4rg2gyxfnq4s7nt54ofe6rpa.arweave.net/L92fXEGOMl2rGqlDvH6fvtEORNo2LlbDkvtn3jik9F4/mod.ts";

import { generateCSV } from "./util/index.ts";
import file from "./static/data/2022-07-01_Acton-Health-Insurance-Trust-HPHC_index.json" assert { type: "json" };
import { IDoc, IObj, IHeader, IReportTemp, INetwork } from "./model/index.ts";
import { CSV_HEADER, FILE_NAME, PROXY } from "./config/index.ts";
import Button from "./components/Button.tsx";

function App() {
  const [demofile, setDemoFile] = useState<IDoc>();
  const [csvHeader, setCSVHeader] = useState<IHeader[]>(CSV_HEADER);
  const [prepareData, setPrepareData] = useState<IObj[]>([]);
  const [enteredURL, setEnteredURL] = useState<string>("");
  const [notAllowed, setNotAllowed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

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

  const onReset = () => {
    setDemoFile();
    setPrepareData([]);
    setEnteredURL("");
    setNotAllowed(false);
    setIsLoading(false);
  };

  const callback = () => {
    onReset();
    setLogs((oldData: string[]) => [...oldData, enteredURL]);
  };

  const fetchData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setNotAllowed(true);

    try {
      const newURL = PROXY + enteredURL;
      const jsonResponse = await fetch(newURL);
      const data = await jsonResponse.json();

      if (data) {
        setDemoFile(data);
      } else {
        setDemoFile(file);
      }
    } catch (error) {
      const msg = error.message || "Please enter a valid URL!";

      alert(msg);
      setEnteredURL("");
      setIsLoading(false);
      setNotAllowed(false);

      throw new Error(msg);
    }
  };

  const convertToCSV = () => {
    const raw = enteredURL.split("/").pop() || "";
    const filename = raw.replace("_index.json", "");
    const isValid = FILE_NAME && csvHeader && prepareData.length > 0;

    if (isValid) {
      setNotAllowed(true);
      generateCSV(csvHeader, prepareData, filename, callback);
    }
  };

  const isDisabled = useMemo(() => {
    return (enteredURL || "").trim().length === 0 || notAllowed;
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
            <Button
              label={isLoading ? "Loading..." : "Fetch"}
              onClick={fetchData}
              isDisabled={isDisabled}
            />
          )}
          {prepareData.length > 0 && (
            <Button
              label={"Download"}
              onClick={convertToCSV}
              isDisabled={isDisabled}
            />
          )}
        </div>
        {logs.length > 0 && (
          <div className="wrap no-border">
            <h3>Logs:</h3>
            <div className="logs">
              {ld.map(logs, (logItem: string, index: number) => (
                <p key={index}>
                  {index + 1}. <a href={logItem}>{logItem}</a>
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
