"use client";

import React, { useState } from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  Award,
  Calendar,
  ChevronRight,
  RotateCcw,
  Search,
  ChevronLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const assessmentStats = [
  {
    label: "Total Assessments",
    value: "4",
    icon: FileText,
    color: "bg-indigo-600",
  },
  { label: "Passed", value: "3", icon: CheckCircle, color: "bg-emerald-500" },
  { label: "Failed", value: "1", icon: XCircle, color: "bg-rose-500" },
  { label: "Average Score", value: "80%", icon: Award, color: "bg-purple-600" },
];

const assessmentHistory = [
  {
    id: "1",
    course: "ISO 9001 Fundamentals",
    date: "2026-02-10",
    score: 85,
    attempts: 1,
    status: "Passed",
  },
  {
    id: "2",
    course: "ISO 27001 Security",
    date: "2026-02-10",
    score: 65,
    attempts: 2,
    status: "Failed",
  },
  {
    id: "3",
    course: "Internal Auditing",
    date: "2026-02-10",
    score: 92,
    attempts: 1,
    status: "Passed",
  },
  {
    id: "4",
    course: "Risk Management",
    date: "2026-02-10",
    score: 78,
    attempts: 1,
    status: "Passed",
  },
  {
    id: "5",
    course: "Health & Safety",
    date: "2026-02-05",
    score: 88,
    attempts: 1,
    status: "Passed",
  },
  {
    id: "6",
    course: "Environmental ISO",
    date: "2026-02-01",
    score: 45,
    attempts: 1,
    status: "Failed",
  },
  {
    id: "7",
    course: "Cyber Resilience",
    date: "2026-01-25",
    score: 95,
    attempts: 1,
    status: "Passed",
  },
  {
    id: "8",
    course: "Social Responsibility",
    date: "2026-01-20",
    score: 82,
    attempts: 1,
    status: "Passed",
  },
  {
    id: "9",
    course: "Audit Lead Training",
    date: "2026-01-15",
    score: 30,
    attempts: 1,
    status: "Failed",
  },
  {
    id: "10",
    course: "Business Continuity",
    date: "2026-01-10",
    score: 76,
    attempts: 2,
    status: "Passed",
  },
  {
    id: "11",
    course: "Information Assets",
    date: "2026-01-05",
    score: 89,
    attempts: 1,
    status: "Passed",
  },
  {
    id: "12",
    course: "Quality Control",
    date: "2025-12-28",
    score: 91,
    attempts: 1,
    status: "Passed",
  },
];

const SortIcon = ({
  column,
  sortConfig,
}: {
  column: string;
  sortConfig: { key: string; direction: "asc" | "desc" | null };
}) => {
  if (sortConfig.key !== column)
    return <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />;
  if (sortConfig.direction === "asc")
    return <ArrowUp className="ml-2 h-3 w-3 text-purple-500" />;
  if (sortConfig.direction === "desc")
    return <ArrowDown className="ml-2 h-3 w-3 text-purple-500" />;
  return <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />;
};

export default function UserQuizzesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({ key: "date", direction: "desc" });
  const itemsPerPage = 5;

  // Action States
  const [selectedAssessment, setSelectedAssessment] = useState<
    (typeof assessmentHistory)[0] | null
  >(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRetryOpen, setIsRetryOpen] = useState(false);

  const handleViewDetails = (assessment: (typeof assessmentHistory)[0]) => {
    setSelectedAssessment(assessment);
    setIsDetailsOpen(true);
  };

  const handleRetryAssessment = (assessment: (typeof assessmentHistory)[0]) => {
    setSelectedAssessment(assessment);
    setIsRetryOpen(true);
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const filteredHistory = assessmentHistory
    .filter((item) => {
      const matchesSearch = item.course
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortConfig.direction || !sortConfig.key) return 0;

      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="flex flex-col gap-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
          Assessment History
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">
          View your quiz scores and assessment results
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {assessmentStats.map((stat, i) => (
          <Card
            key={i}
            className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all duration-300"
          >
            <CardContent className="p-8">
              <div className="flex justify-between items-start">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
                  {stat.label}
                </p>
                <div
                  className={cn(
                    "h-12 w-12 rounded-2xl text-white flex items-center justify-center shadow-lg",
                    stat.color,
                  )}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-8">
                <p
                  className={cn(
                    "text-4xl font-black tracking-tighter leading-none transition-colors duration-300",
                    stat.label === "Failed" && stat.value !== "0"
                      ? "text-rose-500"
                      : "text-slate-900 dark:text-white",
                  )}
                >
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <Card className="flex-1 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl overflow-hidden p-2">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
            <Input
              placeholder="Search assessments..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-12 h-12 bg-slate-50/50 dark:bg-slate-800/30 border-none focus:ring-0 text-base"
            />
          </div>
        </Card>

        {/* Status Filter */}
        <div className="flex bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-sm border border-slate-100 dark:border-slate-800 self-center">
          {["All", "Passed", "Failed"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={cn(
                "px-6 h-10 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                statusFilter === status
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* History Table Section */}
      <Card className="border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <TableRow className="hover:bg-transparent h-16">
                <TableHead
                  className="font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest text-[10px] pl-8 cursor-pointer group"
                  onClick={() => handleSort("course")}
                >
                  <div className="flex items-center">
                    Course <SortIcon column="course" sortConfig={sortConfig} />
                  </div>
                </TableHead>
                <TableHead
                  className="font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest text-[10px] cursor-pointer group"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date <SortIcon column="date" sortConfig={sortConfig} />
                  </div>
                </TableHead>
                <TableHead
                  className="font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest text-[10px] cursor-pointer group"
                  onClick={() => handleSort("score")}
                >
                  <div className="flex items-center">
                    Score <SortIcon column="score" sortConfig={sortConfig} />
                  </div>
                </TableHead>
                <TableHead className="font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest text-[10px] text-center">
                  Attempts
                </TableHead>
                <TableHead className="font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest text-[10px]">
                  Status
                </TableHead>
                <TableHead className="font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest text-[10px] text-right pr-8">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedHistory.length > 0 ? (
                paginatedHistory.map((item) => (
                  <TableRow
                    key={item.id}
                    className="h-20 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <TableCell className="font-bold text-slate-900 dark:text-white pl-8">
                      {item.course}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <Calendar className="h-4 w-4" />
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4 min-w-[120px]">
                        <Progress
                          value={item.score}
                          className={cn(
                            "h-2 w-20 bg-slate-100 dark:bg-slate-800",
                            item.status === "Passed"
                              ? "[&>div]:bg-emerald-500"
                              : "[&>div]:bg-rose-500",
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm font-black tabular-nums",
                            item.status === "Passed"
                              ? "text-slate-900 dark:text-white"
                              : "text-rose-500",
                          )}
                        >
                          {item.score}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-500">
                      {item.attempts}
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          item.status === "Passed"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-rose-500/10 text-rose-500",
                        )}
                      >
                        {item.status === "Passed" ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {item.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleViewDetails(item)}
                          className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/20"
                        >
                          View Details
                        </Button>
                        {item.status === "Failed" && (
                          <Button
                            onClick={() => handleRetryAssessment(item)}
                            variant="outline"
                            className="h-9 px-4 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl text-xs transition-all"
                          >
                            <RotateCcw className="h-3.5 w-3.5 mr-1" />
                            Retry
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Search className="h-10 w-10 opacity-20" />
                      <p className="font-bold text-sm">No assessments found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination UI */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing{" "}
            <span className="text-slate-900 dark:text-white">
              {Math.min(
                filteredHistory.length,
                (currentPage - 1) * itemsPerPage + 1,
              )}
            </span>{" "}
            to{" "}
            <span className="text-slate-900 dark:text-white">
              {Math.min(currentPage * itemsPerPage, filteredHistory.length)}
            </span>{" "}
            of{" "}
            <span className="text-slate-900 dark:text-white">
              {filteredHistory.length}
            </span>{" "}
            Assessments
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 border-slate-200 dark:border-slate-800 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-xl text-xs font-black transition-all duration-300",
                  currentPage === page
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 scale-110"
                    : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600",
                )}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 border-slate-200 dark:border-slate-800 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Primary Action Button */}
      <div className="flex justify-center mt-4">
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white h-16 px-12 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all duration-300 gap-3 group">
          <FileText className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          Take New Assessment
        </Button>
      </div>
      {/* View Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none bg-white dark:bg-slate-900 shadow-2xl rounded-3xl">
          <DialogHeader className="px-8 pt-8">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                  Assessment Report
                </DialogTitle>
                <DialogDescription className="text-slate-500 font-medium mt-2">
                  {selectedAssessment?.course}
                </DialogDescription>
              </div>
              <Badge
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  selectedAssessment?.status === "Passed"
                    ? "bg-emerald-500 text-white"
                    : "bg-rose-500 text-white",
                )}
              >
                {selectedAssessment?.status}
              </Badge>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-8">
            {/* Score Visualization */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4">
              <div className="relative h-32 w-32 flex items-center justify-center">
                <svg className="h-full w-full -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-200 dark:text-slate-800"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={
                      364.4 - (364.4 * (selectedAssessment?.score || 0)) / 100
                    }
                    strokeLinecap="round"
                    className={
                      selectedAssessment?.status === "Passed"
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {selectedAssessment?.score}%
                  </span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    Final Score
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 w-full gap-4 mt-2">
                <div className="text-center p-3 rounded-xl bg-white dark:bg-slate-900/50 shadow-sm border border-slate-100 dark:border-slate-800">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Pass Mark
                  </p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    70%
                  </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white dark:bg-slate-900/50 shadow-sm border border-slate-100 dark:border-slate-800">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Time Spent
                  </p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    12:45m
                  </p>
                </div>
              </div>
            </div>

            {/* Accuracy Breakdown */}
            <div className="space-y-4">
              <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">
                Performance Breakdown
              </p>
              {[
                { label: "Core Requirements", value: 95 },
                { label: "Implementation Logic", value: 72 },
                { label: "Risk Assessment", value: 88 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>{item.label}</span>
                    <span className="text-indigo-600">{item.value}%</span>
                  </div>
                  <Progress
                    value={item.value}
                    className="h-1.5 bg-slate-100 dark:bg-slate-800/50 [&>div]:bg-indigo-600"
                  />
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="px-8 pb-8 bg-white dark:bg-slate-900 border-none">
            <Button
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20"
              onClick={() => setIsDetailsOpen(false)}
            >
              Download PDF Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Retry Modal */}
      <Dialog open={isRetryOpen} onOpenChange={setIsRetryOpen}>
        <DialogContent className="sm:max-w-[420px] p-8 bg-white dark:bg-slate-900 border-none shadow-2xl rounded-3xl">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="h-20 w-20 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 ring-8 ring-indigo-50/50 dark:ring-indigo-900/10">
              <RotateCcw className="h-10 w-10 animate-in spin-in-180 duration-500" />
            </div>
            <div className="space-y-3">
              <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                Retry Assessment?
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium leading-relaxed">
                You are about to retake the assessment for{" "}
                <span className="text-indigo-600 font-bold">
                  &quot;{selectedAssessment?.course}&quot;
                </span>
                . This will be counted as Attempt #
                {(selectedAssessment?.attempts || 0) + 1}.
              </DialogDescription>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl font-bold border-slate-200 dark:border-slate-800"
                onClick={() => setIsRetryOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20"
                onClick={() => setIsRetryOpen(false)}
              >
                Start Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
