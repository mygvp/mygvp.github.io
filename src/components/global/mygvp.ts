import axios from "axios";
import * as cheerio from "cheerio";

interface Payload {
  [key: string]: string | number;
}

const fetchResultData = async (
  url: string,
  payload: Payload
): Promise<string> => {
  try {
    const response = await axios.post<string>(
      url,
      new URLSearchParams(payload as any).toString()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching result data:", error);
    throw new Error(`Error fetching result data: ${(error as Error).message}`);
  }
};

const extractBatchYear = (registrationNumber: string): string => {
  if (/^20/.test(registrationNumber) && registrationNumber.length === 10)
    return "2020";
  if (/^21/.test(registrationNumber) && registrationNumber.length === 10)
    return "2021";
  if (/^322/.test(registrationNumber) && registrationNumber.length === 12)
    return "2022";
  if (/^323/.test(registrationNumber) && registrationNumber.length === 12)
    return "2023";
  return "2021";
};

const parseResult = (data: string): string | null => {
  const $ = cheerio.load(data);
  const resultTable = $("table").html();
  return resultTable || null;
};

const getResults = async (
  registrationNumber: string,
  url: string
): Promise<string | null> => {
  const parsedUrl = new URL(url);
  const semname = parsedUrl.searchParams.get("semname") || "";
  const regulation = parsedUrl.searchParams.get("regulation") || "";
  const semesterNo = parsedUrl.searchParams.get("semester") || "";

  const constructEndpoint = (url: string): string => {
    return url.replace("btechsearch.asp", "find_info.asp");
  };

  let endpoint: string;
  let payload: Payload;

  if (url.includes("btechsearch.asp")) {
    endpoint = constructEndpoint(url);
    payload = {
      u_input: registrationNumber,
      u_field: "state",
    };
  } else {
    endpoint = "http://gvpce.ac.in:10000/GVP%20Results/RegularResults";
    payload = {
      input1: registrationNumber,
      hidedata: semname,
      hidedata2: regulation,
      hidedata3: semesterNo,
    };
  }

  try {
    const resultData = await fetchResultData(endpoint, payload);
    const result = parseResult(resultData);
    return result;
  } catch (error) {
    console.error("Error fetching or displaying results:", error);
    return null;
  }
};

const getPayload = async (
  registrationNumber: string,
  batchYear: string,
  semester: string,
  urls: { [key: string]: { [key: string]: string } }
): Promise<[string, string] | null> => {
  const url = urls[batchYear]?.[semester];
  if (url) {
    const parsedUrl = new URL(url);
    const semname = parsedUrl.searchParams.get("semname") || "";
    const regulation = parsedUrl.searchParams.get("regulation") || "";
    const semesterNo = parsedUrl.searchParams.get("semester") || "";

    const constructEndpoint = (url: string): string => {
      return url.replace("btechsearch.asp", "find_info.asp");
    };

    let endpoint: string;
    let payload: Payload;

    if (url.includes("btechsearch.asp")) {
      endpoint = constructEndpoint(url);
      payload = {
        u_input: registrationNumber,
        u_field: "state",
      };
    } else {
      endpoint = "http://gvpce.ac.in:10000/GVP%20Results/RegularResults";
      payload = {
        input1: registrationNumber,
        hidedata: semname,
        hidedata2: regulation,
        hidedata3: semesterNo,
      };
    }

    const payloadString = new URLSearchParams(payload as any).toString();

    try {
      const result: [string, string] = [endpoint, payloadString];
      return result;
    } catch (error) {
      console.error("Error fetching or displaying results:", error);
      return null;
    }
  }
  return null;
};

export { extractBatchYear, getResults, getPayload };
