import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GetJobPostingByIdHook,
  PutJobPostingHook,
} from "../hooks/job-posting.hook";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Spinner from "@/custom-components/Spinner";
import { DatePicker } from "@/components/ui/date-picker";

const ViewJobPosting = () => {
  const { id } = useParams();
  console.log("Job Posting ID:", id);
  const navigate = useNavigate();
  const {
    data: jobPosting,
    isLoading,
    isError,
  } = GetJobPostingByIdHook(id || "");
  const { mutate: updateJobPosting } = PutJobPostingHook(id || "");

  const [formData, setFormData] = useState({
    id: "",
    datePosted: new Date().toISOString().split("T")[0],
    deadline: new Date().toISOString().split("T")[0],
    noOfVacancies: 1,
    positionTitle: "",
    jobDescription: "",
    location: "",
    department: "",
    qualifications: "",
    jobCategory: "",
    employmentType: "",
    salary: "",
    status: "",
    noOfApplicants: 0,
  });

  useEffect(() => {
    if (jobPosting) {
      setFormData({
        id: jobPosting.id,
        datePosted: jobPosting.datePosted,
        deadline: jobPosting.deadline,
        noOfVacancies: jobPosting.noOfVacancies,
        positionTitle: jobPosting.positionTitle,
        jobDescription: jobPosting.jobDescription,
        location: jobPosting.location,
        department: jobPosting.department,
        qualifications: jobPosting.qualifications,
        jobCategory: jobPosting.jobCategory,
        employmentType: jobPosting.employmentType,
        salary: jobPosting.salary,
        status: jobPosting.status,
        noOfApplicants: jobPosting.noOfApplicants,
      });
    }
  }, [jobPosting]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
        <span className="ml-2 text-gray-600 font-semibold text-xl">
          Loading Job Posting...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="ml-2 text-gray-600 font-semibold text-xl">
          Error Loading Job Posting...
        </span>
      </div>
    );
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: any) => (date: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date.toISOString().split("T")[0],
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(formData);
    updateJobPosting(formData);
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Edit Job Posting</CardTitle>
        <CardDescription>Modify the details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="datePosted">Date Posted</Label>
              <DatePicker
                value={new Date(formData.datePosted)}
                onChange={handleDateChange("datePosted")}
              />
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <DatePicker
                value={new Date(formData.deadline)}
                onChange={handleDateChange("deadline")}
              />
            </div>
            <div>
              <Label htmlFor="noOfVacancies">No. of Vacancies</Label>
              <Input
                id="noOfVacancies"
                name="noOfVacancies"
                type="number"
                value={formData.noOfVacancies}
                onChange={handleChange}
                min={1}
              />
            </div>
            <div>
              <Label htmlFor="positionTitle">Position Title</Label>
              <Input
                id="positionTitle"
                name="positionTitle"
                type="text"
                value={formData.positionTitle}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                className="w-full h-32"
              />
            </div>
            <div>
              <Label htmlFor="qualifications">Required Qualifications</Label>
              <Textarea
                id="qualifications"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                className="w-full h-32"
              />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                type="text"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="jobCategory">Job Category</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, jobCategory: value }))
                }
                value={formData.jobCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Teaching">Teaching</SelectItem>
                  <SelectItem value="Non-Teaching">Non-Teaching</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, employmentType: value }))
                }
                value={formData.employmentType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-Time">Full-time</SelectItem>
                  <SelectItem value="Part-Time">Part-time</SelectItem>
                  <SelectItem value="Contractual">Contractual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                name="salary"
                type="text"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
                value={formData.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="noOfApplicants">No. of Applicants</Label>
              <Input
                id="noOfApplicants"
                name="noOfApplicants"
                type="number"
                value={formData.noOfApplicants}
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button type="submit" className="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ViewJobPosting;
