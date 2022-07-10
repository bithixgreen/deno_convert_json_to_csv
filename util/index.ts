import { FILE_NAME } from "../config/index.ts";
import { IHeader, IObj } from "../model/index.ts";

// TODO: Function to convert the JSON(Array of objects) to CSV.
const arrayToCsv = (headers: IHeader[], data: IObj[]) => {
  const csvRows: string[] = [];
  const headerValues = headers.map((header) => header.label);

  csvRows.push(headerValues.join(","));

  for (const row of data) {
    const rowValues = headers.map((header) => {
      const escaped = ("" + row[header.key]).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });

    csvRows.push(rowValues.join(","));
  }

  const result = csvRows.join("\n");
  return result;
};

// TODO: Function to download the generated CSV as a .csv file.
const download = (data: string, fileName: string) => {
  const blob = new Blob([data], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const element = document.createElement("a");
  element.setAttribute("hidden", "");
  element.setAttribute("href", url);
  element.setAttribute("download", fileName + ".csv");
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const generateCSV = (
  headers: IHeader[],
  data: IObj[],
  filename = FILE_NAME,
  cb: () => void
) => {
  const csvData = arrayToCsv(headers, data);
  download(csvData, filename);
  cb();
};
