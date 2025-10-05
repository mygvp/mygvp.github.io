"use client";

import {Wrapper , Container, ToggleSearchBar} from "@/components";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronRight, ExternalLink } from "lucide-react";

const filtersInitial = {
  course: "allcourse",
  examType: "all",
  regulation: "allreg",
  semester: "allsem",
};
const HomePage = () => {
  const [results, setResults] = useState<any[]>([]);
  const [filters, setFilters] = useState(filtersInitial);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        const baseUrl = "https://gvpce.ac.in/collegeresult_filter.php";
        const params = new URLSearchParams({
          course: filters.course,
          examType: filters.examType,
          regulation: filters.regulation,
          semester: filters.semester,
        });

        const apiUrl = `https://mygvp-server.vercel.app/api/fetch-results?url=${baseUrl}?${params.toString()}`;
        const res = await fetch(apiUrl);
        const text = await res.text();

        const regex = /<a href='([^']+)'[^>]*>(.*?)<\/a>/g;
        const parsed: any[] = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
          parsed.push({
            url: match[1].startsWith("http")
              ? match[1]
              : `https://gvpce.ac.in/${match[1]}`,
            title: match[2].replace(/&amp;/g, "&").trim(),
          });
        }

        setResults(parsed);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [filters]);
  
  const handleChange = (key: string, value: string) =>
    setFilters({ ...filters, [key]: value });
  
  return (
    <section className="w-full relative flex flex-col items-center justify-center px-4 md:px-0 py-8">
      <Wrapper>
        <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10 h-[150vh]" />

        <Container>
          <div className="flex flex-col items-center justify-center py-20 h-full">
            <button className="group relative grid overflow-hidden rounded-full px-4 py-1 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200">
              <span>
                <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
              </span>
              <span className="backdrop absolute inset-[1px] rounded-full bg-neutral-950 transition-colors duration-200 group-hover:bg-neutral-900" />
              <span className="h-full w-full blur-md absolute bottom-0 inset-x-0 bg-gradient-to-tr from-primary/40"></span>
              <span className="z-10 py-0.5 text-sm text-neutral-100 flex items-center justify-center gap-1.5">
                <Image
                  src="/images/sparkles-dark.svg"
                  alt="✨"
                  width={24}
                  height={24}
                  className="w-4 h-4"
                />
                Introducing MyGVP
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
            {/* <div className="flex flex-col items-center mt-8 max-w-3xl w-11/12 md:w-full">
              <div className="hidden md:flex relative items-center justify-center mt-8 md:mt-12 w-full">
                <Link
                  href="#"
                  className="flex items-center justify-center w-max rounded-full border-t border-foreground/30 bg-white/20 backdrop-blur-lg px-2 py-1 md:py-2 gap-2 md:gap-8 shadow-3xl shadow-background/40 cursor-pointer select-none"
                >
                  
                </Link>
              </div>
            </div> */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <Select onValueChange={(v) => handleChange("course", v)}>
                <SelectTrigger className="w-[130px] dark:bg-gray-900 dark:border-gray-700">
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allcourse">All</SelectItem>
                  <SelectItem value="B.Tech">B.Tech</SelectItem>
                  <SelectItem value="M.Tech">M.Tech</SelectItem>
                  <SelectItem value="MCA">MCA</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(v) => handleChange("examType", v)}>
                <SelectTrigger className="w-[130px] dark:bg-gray-900 dark:border-gray-700">
                  <SelectValue placeholder="Exam Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="supply">Supply</SelectItem>
                  <SelectItem value="revaluation">Revaluation</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(v) => handleChange("regulation", v)}>
                <SelectTrigger className="w-[130px] dark:bg-gray-900 dark:border-gray-700">
                  <SelectValue placeholder="Regulation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allreg">All</SelectItem>
                  <SelectItem value="R-2022">R-2022</SelectItem>
                  <SelectItem value="R-2020">R-2020</SelectItem>
                  <SelectItem value="R-2019">R-2019</SelectItem>
                  <SelectItem value="R-2015">R-2015</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(v) => handleChange("semester", v)}>
                <SelectTrigger className="w-[130px] dark:bg-gray-900 dark:border-gray-700">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allsem">All</SelectItem>
                  {Array.from({ length: 8 }, (_, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>
                      Sem {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 🧾 Results List */}
            <div className="mt-12 w-full max-w-4xl">
              {loading ? (
                <p className="text-center text-gray-400">Fetching results...</p>
              ) : results.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  {results.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-500 hover:shadow-lg dark:hover:border-blue-400 transition-all duration-200 flex items-start justify-between gap-2"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {r.title}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Click to open on gvpce.ac.in
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 mt-1" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 mt-6">
                  No results available.
                </p>
              )}
            </div>
          </div>
        </Container>
      </Wrapper>
    </section>
  );
};
export default HomePage;