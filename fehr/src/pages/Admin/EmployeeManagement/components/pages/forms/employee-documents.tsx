import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fileUploadSchema,
  EmpFileUpload,
  // EmpPersonalInfoType,
  // EmpEducationType,
  // EmpEligType
} from "../../../schema/employee-schema";
import { Form } from "@/components/ui/form";
import { useAtom } from "jotai";
import FormFile from "@/custom-components/Form/FormFile";
import { useEffect } from "react";
import { empDocumentAtom, employeePersonalInfoAtom, empEducationAtom, empEligibilityAtom } from "../../../atom";
import { toast } from "sonner";

// Define interfaces for our data structures
// interface PersonalInfo {
//   EmployeeCode: string;
//   Fullname: string;
//   JobTitle: string;
//   Department: string;
//   Office: string;
//   DateHired: Date;
//   EmploymentStatus: string;
//   DOB: Date;
//   PlaceOfBirth: string;
//   HomeAddress: string;
//   Sex: string;
//   CivilStatus: string;
//   PhoneNo: string;
//   Email: string;
//   Spouse: string;
//   NoofChildren?: string;
// }

// interface Education {
//   educationalBackground: Array<{
//     Level: string;
//     SchoolAttended: string;
//     YearGraduated: string;
//     AwardsReceived: string;
//   }>;
// }

// interface Eligibilities {
//   Memberships: Array<{
//     organizationName: string;
//   }>;
//   Eligibilities: Array<{
//     examAssessment: string;
//     certificateNo: string;
//     nttcNo: string;
//     expiryDate: string;
//   }>;
//   EmploymentHistory: Array<{
//     position: string;
//     startDate: string;
//     endDate: string;
//     type: string;
//   }>;
// }

export const fileTypes = [
  { name: "EmployeeContract", label: "Employment Contract" },
  { name: "TOR", label: "Transcript of Records" },
  { name: "Diploma", label: "Authenticated Diploma" },
  { name: "BirthCert", label: "Birth Certificate (PSA)" },
  { name: "MarriedCert", label: "Married Certificate (PSA)" },
  { name: "Certificates", label: "Certificates" },
  { name: "EmploymentRecord", label: "Employment Record/COE" },
];

const EmployeeDocuments = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useAtom(empDocumentAtom);
  const [personalInfo] = useAtom(employeePersonalInfoAtom);
  const [education] = useAtom(empEducationAtom);
  const [eligibilities] = useAtom(empEligibilityAtom);

  const form = useForm<EmpFileUpload>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: files || fileTypes.reduce((acc, fileType) => {
      acc[fileType.name] = undefined;
      return acc;
    }, {} as EmpFileUpload),
  });

  const { errors } = form.formState;

  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);

  const convertFileToBinary = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const binaryString = reader.result as string;
        resolve(binaryString);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (values: EmpFileUpload) => {
    try {
      if (!personalInfo || !education || !eligibilities) {
        toast.error("Missing required information. Please fill out all forms.");
        return;
      }

      const employeeId = crypto.randomUUID();

      // Prepare the complete data according to the API structure
      const employeeData = {
        data: {
          employeeData: {
            id: crypto.randomUUID(),
            employeeId: employeeId,
            employeeName: personalInfo.Fullname,
            position: personalInfo.JobTitle,
            employeeCode: personalInfo.EmployeeCode,
            department: personalInfo.Department,
            employeeType: "full-time", // Default value
            employmentType: personalInfo.EmploymentStatus,
            status: "Employee",
          },
          employeeProfile: {
            id: crypto.randomUUID(),
            employeeId: employeeId,
            firstName: personalInfo.Fullname.split(' ')[0],
            middleName: personalInfo.Fullname.split(' ').slice(1, -1).join(' '),
            lastName: personalInfo.Fullname.split(' ').pop() || '',
            nameExtension: "",
            dob: new Date(personalInfo.DOB).toISOString(),
            age: calculateAge(new Date(personalInfo.DOB)),
            birthplace: personalInfo.PlaceOfBirth,
            religion: "",
            ethnicity: "",
            currentAddress: personalInfo.HomeAddress,
            permanentAddress: personalInfo.HomeAddress,
            sex: personalInfo.Sex,
            civilStatus: personalInfo.CivilStatus,
            phoneNumber: personalInfo.PhoneNo,
            emailAddress: personalInfo.Email,
            spouse: personalInfo.Spouse || "",
            noofChildren: personalInfo.NoofChildren || "0",
            educationalBackground: education.educationalBackground.map((edu) => ({
              id: crypto.randomUUID(),
              level: edu.Level || '',
              schoolAttended: edu.SchoolAttended,
              yearsGraduated: edu.YearGraduated,
              awardsReceived: edu.AwardsReceived
            })),
            membership: eligibilities.Memberships.map((mem) => ({
              id: crypto.randomUUID(),
              organizationName: mem.organizationName
            })),
            eligibilities: eligibilities.Eligibilities.map((elig) => ({
              id: crypto.randomUUID(),
              examinationName: elig.examAssessment,
              certificateNo: elig.certificateNo,
              nttcNo: elig.nttcNo || "",
              expiryDate: elig.expiryDate
            })),
            employmetHistory: eligibilities.EmploymentHistory.map((hist) => ({
              id: crypto.randomUUID(),
              position: hist.position,
              startDate: hist.startDate,
              endDate: hist.endDate,
              employmentType: hist.type
            }))
          }
        }
      };

      console.log('Sending data to API:', JSON.stringify(employeeData, null, 2));

      // Make the API call
      const response = await fetch('http://localhost:5206/api/create-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error Response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      const result = await response.json();
      console.log('Employee created successfully:', result);

      // Upload files if they exist
      for (const [fileType, fileList] of Object.entries(values)) {
        if (fileList && fileList.length > 0) {
          try {
            const file = fileList[0];
            const binaryData = await convertFileToBinary(file);

            const formData = new FormData();
            formData.append('file', binaryData);
            formData.append('fileType', fileType);
            formData.append('employeeId', employeeId);
            formData.append('fileName', file.name);
            formData.append('fileType', file.type);

            const fileResponse = await fetch('http://localhost:5206/api/upload-employee-file', {
              method: 'POST',
              body: formData,
            });

            if (!fileResponse.ok) {
              console.error(`Failed to upload ${fileType} file`);
              toast.error(`Failed to upload ${fileType} file`);
            } else {
              toast.success(`Successfully uploaded ${fileType} file`);
            }
          } catch (error) {
            console.error(`Error processing ${fileType} file:`, error);
            toast.error(`Error processing ${fileType} file`);
          }
        }
      }

      // Store the file upload values
      setFiles(values);

      // Show success message
      toast.success("Employee created successfully!");

      // Navigate back to employee management
      navigate("/admin/employee-management");
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error("Failed to create employee. Please try again.");
    }
  };

  // Helper function to calculate age
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age.toString();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <Card className="w-4/5 h-[700px] p-4 ">
        <CardHeader className="text-lg font-bold">201 Files Upload</CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs defaultValue="employment" className="w-full">
                <TabsList className="flex space-x-4 mb-8 w-[680px]">
                  <TabsTrigger value="employment">Employment Files</TabsTrigger>
                  <TabsTrigger value="government">
                    Government Details
                  </TabsTrigger>
                  <TabsTrigger value="medical">Medical Records</TabsTrigger>
                  <TabsTrigger value="tests">Pre-Employment Tests</TabsTrigger>
                </TabsList>
                <TabsContent value="employment">
                  <div className="grid grid-cols-2 gap-6">
                    {fileTypes.map(({ name, label }) => (
                      <div key={name} className="mb-4">
                        <FormFile
                          name={name}
                          placeholder={label}
                          form={form}
                          fileRef={form.register(name)}
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end mt-4 gap-2 p-4">
                <Button variant={"outline"} onClick={() => navigate(-1)}>
                  Back
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDocuments;
