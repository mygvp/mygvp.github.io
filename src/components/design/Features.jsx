// import React, { useEffect, useState } from "react";
// import { cn } from "../../utils/cn";
// import axios from "axios";
// import urls from "../../constants/links";
// import { getPayload, cleanResponseData } from "../mygvp";

// const FeaturesSectionDemo = ({ rollNo, batchYear }) => {
//   const [features, setFeatures] = useState([]);

//   useEffect(() => {
//     if (rollNo && batchYear) {
//       fetchFeatures(rollNo, batchYear);
//     }
//   }, [rollNo, batchYear]);

//   const fetchFeatures = async (rollNo, batchYear) => {
//     const semesters = urls[batchYear] ? Object.keys(urls[batchYear]) : [];
//     const featuresData = await Promise.all(
//       semesters.map(async (sem) => {
//         const payloadData = await getPayload(rollNo, sem, urls);
//         const payload = {
//           url: payloadData[0],
//           payload: payloadData[1],
//         };
//         const response = await axios.post(
//           `https://mygvp-server.vercel.app/api/fetch-results`,
//           payload
//         );
//         const cleanedData = cleanResponseData(response.data);
//         return {
//           title: `Semester ${sem}`,
//           description: cleanedData,
//         };
//       })
//     );
//     setFeatures(featuresData);
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
//       {features.map((feature, index) => (
//         <Feature key={feature.title} {...feature} index={index} />
//       ))}
//     </div>
//   );
// };

// const Feature = ({ title, description, index }) => {
//   return (
//     <div
//       className={cn(
//         "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
//         (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
//         index < 4 && "lg:border-b dark:border-neutral-800"
//       )}
//     >
//       {index < 4 && (
//         <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
//       )}
//       {index >= 4 && (
//         <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
//       )}
//       <div className="text-lg font-bold mb-2 relative z-10 px-10">
//         <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
//         <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
//           {title}
//         </span>
//       </div>
//       <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
//         {description}
//       </p>
//     </div>
//   );
// };

// export default FeaturesSectionDemo;
