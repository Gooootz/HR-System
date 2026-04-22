import { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@/components/ui/date-picker";
import { PostJobPostingHook } from "../hooks/job-posting.hook";
import { useToast } from "@/components/ui/use-toast";

const CreateJobPosting = () => {
  const navigate = useNavigate();
  const { mutate: postJobPosting } = PostJobPostingHook();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
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

  const validateForm = () => {
    const requiredFields = [
      formData.positionTitle,
      formData.jobDescription,
      formData.location,
      formData.department,
      formData.qualifications,
      formData.jobCategory,
      formData.employmentType,
      formData.status,
    ];
    return requiredFields.every((field) => field.trim() !== "");
  };

  useEffect(() => {
    !validateForm();
  }, [formData]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    postJobPosting(formData);
  };

  return (
    <>
      <div className="grid grid-cols-2 items-start justify-center gap-4">
        <div className="col-span-2 space-y-4">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Create Job Posting</CardTitle>
              <CardDescription>Fill in the details below</CardDescription>
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
                      placeholder="No. of Positions Available"
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
                      placeholder="Position Title"
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
                      placeholder="Job Description"
                      className="w-full h-32 border border-gray-300 rounded p-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="qualifications">Required Qualifications</Label>
                    <Textarea
                      id="qualifications"
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleChange}
                      placeholder="Required Qualifications"
                      className="w-full h-32 border border-gray-300 rounded p-2"
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
                      placeholder="Location"
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
                      placeholder="Department"
                    />
                  </div>
                  <div>
                    <Label htmlFor="jobCategory">Job Category</Label>
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, jobCategory: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Teaching">Teaching</SelectItem>
                        <SelectItem value="Non-Teaching">
                          Non-Teaching
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          employmentType: value,
                        }))
                      }
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
                      placeholder="Salary"
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
                      placeholder="No. of Applicants"
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => navigate(-1)}>
                    Back
                  </Button>
                  <Button type="submit" className="primary">
                    Confirm
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CreateJobPosting;
