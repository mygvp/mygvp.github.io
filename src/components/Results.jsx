import React, { useState, useEffect } from "react";
import Section from "./Section";
import Heading from "./Heading";
import FeaturesSectionDemo from "../components/design/Features";
import SearchBar from "./SearchBar";

const Results = () => {
  const [searchParams, setSearchParams] = useState({
    rollNo: localStorage.getItem("rollNo") || "",
    batchYear: localStorage.getItem("batchYear") || "",
  });

  const handleSearch = (rollNo, batchYear) => {
    setSearchParams({ rollNo, batchYear });
  };

  useEffect(() => {
    if (searchParams.rollNo && searchParams.batchYear) {
      localStorage.setItem("rollNo", searchParams.rollNo);
      localStorage.setItem("batchYear", searchParams.batchYear);
    }
  }, [searchParams]);

  return (
    <Section id="Results">
      {/* <div className="container relative z-2">
        <Heading className="md:max-w-md lg:max-w-2xl" title="Results" />
        <SearchBar onSearch={handleSearch} />
      </div> */}
      <FeaturesSectionDemo
        rollNo={searchParams.rollNo}
        batchYear={searchParams.batchYear}
      />
    </Section>
  );
};

export default Results;
