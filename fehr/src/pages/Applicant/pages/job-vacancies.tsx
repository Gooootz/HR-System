import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import EmploymentSelect from "../components/select/employment-select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import EmployeeSelect from "../components/select/employee-select";
import { GetAllOpenJobPostingHook } from "@/pages/Admin/JobPosting/hooks/job-posting.hook";
import { JobPosting } from "@/pages/Admin/JobPosting/types/job-posting.type";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { format } from "date-fns";
import { useEffect } from "react";
import LoadingOverlay from "@/custom-components/Loading/LoadingOverlay";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-green-200 text-green-800 hover:bg-gray-200 hover:text-gray-700";
    case "Closed":
      return "bg-red-200 text-red-800 hover:bg-gray-200 hover:text-gray-700";
    default:
      return "bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-700";
  }
};

const getJobCategoryColor = (jobCategory: string) => {
  switch (jobCategory) {
    case "Teaching":
      return "bg-yellow-200 text-yellow-800 hover:bg-gray-200 hover:text-gray-700";
    case "Non-Teaching":
      return "bg-orange-200 text-orange-800 hover:bg-gray-200 hover:text-gray-700";
    default:
      return "bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-700";
  }
};

const JobVacancies = () => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const handleCardClick = (jobId: string) => {
    setSelectedJobId(selectedJobId === jobId ? null : jobId);
  };

  const navigate = useNavigate();
  const { data: jobPostings, isLoading, isError } = GetAllOpenJobPostingHook();
  const [filteredJobPostings, setFilteredJobPostings] = useState<JobPosting[]>(
    []
  );
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [selectedJobCategory, setSelectedJobCategory] = useState<
    string | undefined
  >(undefined);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (jobPostings) {
      setFilteredJobPostings(jobPostings);
    }
  }, [jobPostings]);

  useEffect(() => {
    if (jobPostings) {
      const filtered = jobPostings.filter((jobPosting: JobPosting) => {
        const datePosted = new Date(jobPosting.datePosted);
        const deadline = new Date(jobPosting.deadline);
        const isWithinRange =
          (!dateRange.from || datePosted >= dateRange.from) &&
          (!dateRange.to || deadline <= dateRange.to);

        const matchesJobCategory =
          !selectedJobCategory ||
          jobPosting.jobCategory === selectedJobCategory;
        const matchesEmploymentType =
          !selectedEmploymentType ||
          jobPosting.employmentType === selectedEmploymentType;

        return isWithinRange && matchesJobCategory && matchesEmploymentType;
      });
      setFilteredJobPostings(filtered);
    }
  }, [dateRange, selectedJobCategory, selectedEmploymentType, jobPostings]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingOverlay/>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="ml-2 text-gray-600 font-semibold text-xl">
          Error Loading Job Postings...
        </span>
      </div>
    );
  }

  return (
    <Card className="w-[150vh] h-full overflow-y-auto">
      <CardHeader className="text-lg font-bold">
        <CardTitle>Job Vacancies</CardTitle>
        <CardDescription>
          List of all available job listings and positions
        </CardDescription>
      </CardHeader>

      <div className="p-4">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <DateRangePicker
              onDateRangeChange={(range) =>
                setDateRange({ from: range?.from, to: range?.to })
              }
            />
            <EmployeeSelect
              onChange={(value) => setSelectedJobCategory(value)}
            />
            <EmploymentSelect
              onChange={(value) => setSelectedEmploymentType(value)}
            />
          </div>
          <Button onClick={() => navigate("/application/submitted")}>
            Apply Now!
          </Button>
        </div>
      </div>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredJobPostings.map((jobPosting: JobPosting) => (
            <Card
              key={jobPosting.id}
              className={`p-6 border border-gray-200 shadow-lg transition-transform transform hover:scale-105 w-100 ${
                selectedJobId === jobPosting.id ? "bg-blue-100" : ""
              }`}
              onClick={() => handleCardClick(jobPosting.id)}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="mb-2">
                    <Badge
                      className={`px-2 py-1 rounded-full ${getJobCategoryColor(
                        jobPosting.jobCategory
                      )}`}
                    >
                      {jobPosting.jobCategory}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                  {format(new Date(jobPosting.datePosted), "MMMM d, yyyy")} -{" "}
                  {format(new Date(jobPosting.deadline), "MMMM d, yyyy")}
                  </div>
                  <div className="text-lg font-semibold mt-2">
                    ({jobPosting.noOfVacancies}) {jobPosting.employmentType}{" "}
                    {jobPosting.positionTitle}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {jobPosting.qualifications}
                  </div>
                  <div className="mt-2 text-sm font-medium text-gray-700">
                    {jobPosting.location} - {jobPosting.department}
                  </div>
                  <div className="mt-2 text-sm font-medium text-gray-700">
                    {jobPosting.salary}
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <Badge
                    className={`px-3 py-1 rounded-full ${getStatusColor(
                      jobPosting.status
                    )}`}
                  >
                    {jobPosting.status}
                  </Badge>
                  <div className="mt-1 text-sm text-gray-500">
                    Current applicants: {jobPosting.noOfApplicants}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobVacancies;
