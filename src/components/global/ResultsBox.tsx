"use client";

import { useState, useEffect, useCallback, ChangeEvent } from "react";
import axios from "axios";
import styles from "../../styles/App.module.css"; // Adjust the import based on your CSS file structure
import { getPayload, extractBatchYear } from "../global/mygvp";
import urls from "../global/links";
import Dropdown from "../ui/Dropdown"; // Assuming Dropdown is in components folder

interface SGPAInfo {
  [key: string]: number;
}

const ResultsBox: React.FC = () => {
  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [batchYear, setBatchYear] = useState<string | null>(
    typeof window !== "undefined"
      ? localStorage.getItem(`batchYear_${registrationNumber}`) || ""
      : ""
  );
  const [resultsHtml, setResultsHtml] = useState<string>("");
  const [batchYearOptions, setBatchYearOptions] = useState<string[]>([]);
  const [hoveredSemester, setHoveredSemester] = useState<string | null>(null);
  const [sgpaInfo, setSgpaInfo] = useState<SGPAInfo>(
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem(`${registrationNumber}_results`) || "{}"
        )
      : {}
  );

  const authorizedRegistrationNumber = process.env
    .NEXT_PUBLIC_AUTHORIZED_REGISTRATION_NUMBER as string;
  const hiddenRegistrationNumber = process.env
    .NEXT_PUBLIC_HIDDEN_REGISTRATION_NUMBER as string;
  const server =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    "https://mygvp-db.onrender.com" as string;

  useEffect(() => {
    if (
      (registrationNumber.length === 10 || registrationNumber.length === 12) &&
      registrationNumber !== hiddenRegistrationNumber
    ) {
      const extractedBatchYear = extractBatchYear(registrationNumber);
      setBatchYear(extractedBatchYear);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `batchYear_${registrationNumber}`,
          extractedBatchYear
        );
      }
      const availableBatchYears = Object.keys(urls).map((year) => year);
      setBatchYearOptions(availableBatchYears);
    } else if (registrationNumber === authorizedRegistrationNumber) {
      setBatchYear("2021");
    } else {
      setBatchYear(null);
    }
  }, [
    registrationNumber,
    authorizedRegistrationNumber,
    hiddenRegistrationNumber,
  ]);

  const handleRegNoChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      let upperCaseValue = value.toUpperCase();
      setRegistrationNumber(upperCaseValue);
      setResultsHtml("");
      setBatchYear("");

      if (upperCaseValue === hiddenRegistrationNumber) {
        return;
      }

      if (
        upperCaseValue.length === 10 ||
        upperCaseValue.length === 12 ||
        upperCaseValue === authorizedRegistrationNumber
      ) {
        if (upperCaseValue === authorizedRegistrationNumber) {
          upperCaseValue = hiddenRegistrationNumber;
        }
        const sgpaData =
          typeof window !== "undefined"
            ? JSON.parse(
                localStorage.getItem(`${upperCaseValue}_results`) || "{}"
              )
            : {};
        setSgpaInfo(sgpaData);
        if (Object.keys(sgpaData).length === 0) {
          try {
            const response = await axios.get(
              `${server}/api/get-gpa/${upperCaseValue}`
            );
            const data = response.data;
            if (data) {
              setSgpaInfo(data.gpas || {});
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  `${upperCaseValue}_results`,
                  JSON.stringify(data.gpas || {})
                );
              }
            }
          } catch (error) {
            console.error("Error retrieving GPA data from MongoDB:");
          }
        }
      }
    },
    [server, authorizedRegistrationNumber, hiddenRegistrationNumber]
  );

  const handleBatchYearChange = useCallback(
    (selectedYear: string) => {
      setBatchYear(selectedYear);
      if (typeof window !== "undefined") {
        localStorage.setItem(`batchYear_${registrationNumber}`, selectedYear);
      }
    },
    [registrationNumber]
  );

  const handleClearRegNo = useCallback(async () => {
    setRegistrationNumber("");
    setBatchYear("");
    setBatchYearOptions([]);
    setSgpaInfo({});
    if (registrationNumber) {
      const user = localStorage.getItem(`${registrationNumber}_name`);
      const storedSgpaData =
        typeof window !== "undefined"
          ? JSON.parse(
              localStorage.getItem(`${registrationNumber}_results`) || "{}"
            )
          : {};
      console.log("Stored GPA data:", storedSgpaData);

      if (Object.keys(storedSgpaData).length > 0) {
        try {
          await axios.post(`${server}/api/save-gpa`, {
            registrationNumber,
            name: user,
            gpas: storedSgpaData,
          });
          console.log("GPA data sent to MongoDB");
        } catch (error: any) {
          console.error("Error saving GPA data to MongoDB:", error.message);
        }
      }
      localStorage.removeItem("registrationNumber");
      localStorage.removeItem(`${registrationNumber}_results`);
    }
  }, [registrationNumber, server]);

  const extractName = (html: string): string | null => {
    const nameRegex = /<th align='left'>Name<\/th><td colspan='3'>(.*?)<\/td>/;
    const nameMatch = html.match(nameRegex);
    if (!nameMatch) {
      const nameRegexAlternative =
        /<b>Name<\/b><\/td><td colspan="4">(.*?)<\/td>/;
      const nameMatchAlternative = html.match(nameRegexAlternative);
      return nameMatchAlternative ? nameMatchAlternative[1] : null;
    }
    return nameMatch ? nameMatch[1] : null;
  };

  const extractSGPA = (html: string): number | null => {
    const sgpaRegex =
      /<th align='left'>SGPA<\/th><td colspan='3' align='center'>\s*([\d.]+)\s*<\/td>/;
    const sgpaMatch = html.match(sgpaRegex);

    if (!sgpaMatch) {
      const sgpaRegexAlternative =
        /<b>SGPA<\/b><\/td><td colspan=4><p style='text-align:center;'>([\d.]+)<\/p><\/td>/;
      const sgpaMatchAlternative = html.match(sgpaRegexAlternative);
      if (sgpaMatchAlternative) {
        return parseFloat(sgpaMatchAlternative[1]);
      }
      return null;
    }

    return parseFloat(sgpaMatch[1]);
  };

  const showPopup = (storedResult: string) => {
    const popupWindow = window.open("", "_blank", "width=1100,height=650");
    if (popupWindow) {
      popupWindow.document.open();
      popupWindow.document.write(`
        <html>
          <head>
            <title>Results</title>
            <link rel="icon" type="image/png" href="/icons/gvp.png">
          </head>
          <body>
            ${storedResult}
          </body>
        </html>
      `);
      popupWindow.document.close();
    } else {
      console.error("Failed to open popup window.");
    }
  };

  const cleanResponseData = (data: string): string => {
    const cleanedData = data.split("\n").slice(1, -2).join("\n");
    const lines = cleanedData.split("\n");
    if (lines.length > 1) {
      lines.splice(-2, 1);
    }
    return lines.join("\n");
  };

  const handleSemesterClick = useCallback(
    async (sem: string, batch: string) => {

      let registrationNum = registrationNumber;
      if (registrationNum === hiddenRegistrationNumber) {
        console.error("Access denied for this registration number.");
        return;
      }
      if (registrationNum === authorizedRegistrationNumber) {
        registrationNum = hiddenRegistrationNumber;
      }
      const batchYear =
        batch || localStorage.getItem(`batchYear_${registrationNum}`)|| '2021';
      const storageKey = `results_${registrationNum}_${batchYear}_${sem}`;
      const sgpaKey = `${registrationNum}_results`;
      const Username = `${registrationNum}_name`;
      const storedResult = localStorage.getItem(storageKey) || "";

      if (storedResult) {
        if (!storedResult.trim()) {
          localStorage.removeItem(storageKey);
        } else {
          setResultsHtml(storedResult);
          showPopup(storedResult);

          const sgpa = extractSGPA(storedResult);
          let sgpaData = JSON.parse(localStorage.getItem(sgpaKey) || "{}");
          sgpaData[`${sem}`] = sgpa;
          localStorage.setItem(sgpaKey, JSON.stringify(sgpaData));
          setSgpaInfo(sgpaData);
          const name = extractName(storedResult);
          if (name) {
            localStorage.setItem(Username, name);
          }
          return;
        }
      }

      const payloadData = await getPayload(
        registrationNum,
        batchYear,
        sem,
        urls
      );
      if (!payloadData) {
        console.error("No payload data available for the request.");
        return;
      }
      const payload = {
        url: payloadData[0],
        payload: payloadData[1],
      };
      try {
        const response = await axios.post(payload.url, payload.payload);
        if (response.status === 200) {
          const cleanedData = cleanResponseData(response.data);
          setResultsHtml(cleanedData);
          showPopup(cleanedData);

          const sgpa = extractSGPA(cleanedData);
          const name = extractName(cleanedData);
          let sgpaData = JSON.parse(localStorage.getItem(sgpaKey) || "{}");
          sgpaData[`${sem}`] = sgpa;
          localStorage.setItem(sgpaKey, JSON.stringify(sgpaData));
          setSgpaInfo(sgpaData);
          localStorage.setItem(storageKey, cleanedData);
          if (name) {
            localStorage.setItem(Username, name);
          }
        } else {
          console.error("Failed to retrieve results:", response.status);
        }
      } catch (error) {
        console.error("An error occurred while fetching the results:", error);
      }
    },
    [registrationNumber, authorizedRegistrationNumber, hiddenRegistrationNumber]
  );

  return (
    <div className={styles.App}>
      <h1>Results</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={registrationNumber}
          onChange={handleRegNoChange}
          placeholder="Enter Registration Number"
          className={styles.inputField}
        />
        <Dropdown
          options={batchYearOptions}
          selectedOption={batchYear}
          onOptionSelect={handleBatchYearChange}
          className={styles.dropdown}
        />
        <button onClick={handleClearRegNo} className={styles.clearButton}>
          Clear
        </button>
      </div>
      {batchYear &&
        registrationNumber !== hiddenRegistrationNumber &&
        urls[batchYear] && (
          <div className="button-grid">
            {Object.keys(urls[batchYear]).map((sem) => (
              <button
                type="button"
                key={sem}
                onClick={() => handleSemesterClick(sem, batchYear)}
                onMouseEnter={() => setHoveredSemester(sem)}
                onMouseLeave={() => setHoveredSemester(null)}
                className={hoveredSemester === sem ? "hovered" : ""}
              >
                {hoveredSemester === sem
                  ? sgpaInfo[`${sem}`]
                    ? `SGPA: ${sgpaInfo[`${sem}`].toFixed(2)}`
                    : sem
                  : sem}
              </button>
            ))}
          </div>
        )}
      <div
        className={styles.resultsHtmlContainer}
        dangerouslySetInnerHTML={{ __html: resultsHtml }}
      />
    </div>
  );
};

export default ResultsBox;
