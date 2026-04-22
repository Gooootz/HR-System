import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ApplicantEmployeeDocuments = () => {
  const [files, setFiles] = useState<{ [key: string]: File[] }>({});
  const navigate = useNavigate();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prevFiles) => ({
        ...prevFiles,
        [field]: prevFiles[field]
          ? [...prevFiles[field], ...newFiles]
          : newFiles,
      }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <Card className="w-[140vh] p-4">
        <CardHeader className="text-lg font-bold">
          Application Documents
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            {[
              "Application Letter",
              "Resume",
              "Authenticated Diploma",
              "Transcript of Records",
              "Professional License",
              "Board Exam Results",
              "Birth Certificate (PSA)",
              "Marriage Certificate (if applicable)",
              "Certificates of Trainings or Seminars",
              "Employment Record / Certificate of Employment (if previously employed)",
              "Certificate of Good Moral Character (if fresh graduate)",
            ].map((label) => (
              <div key={label} className="mb-4">
                <Label>{label}</Label>
                <Input
                  type="file"
                  onChange={(e) => handleFileChange(e, label)}
                  multiple={label === "Certificates of Trainings or Seminars"}
                />
                {/* Display selected files */}
                {files[label] && files[label].length > 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    {files[label].map((file) => (
                      <div key={file.name}>{file.name}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>

        <div className="flex justify-end mt-4 gap-2 p-4">
          <Button variant={"outline"} onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button onClick={() => navigate("/application/job-vacancies")}>
            Submit
          </Button>
        </div>
      </Card>
    </div>
  );
};
