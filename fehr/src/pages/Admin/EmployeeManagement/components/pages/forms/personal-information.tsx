import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { empFormPersonalInfoSchema } from "../../../schema/employee-schema";
import { employeePersonalInfoAtom } from "../../../atom";
import FormInput from "@/custom-components/Form/FormInput";
import FormDate from "@/custom-components/Form/FormDate";
import FormSelect from "@/custom-components/Form/FormSelect";
import { useEffect } from "react";

const PersonalInformation = () => {
  const navigate = useNavigate();
  const [personalInfo, setPersonalInfo] = useAtom(employeePersonalInfoAtom);
  const form = useForm({
    resolver: zodResolver(empFormPersonalInfoSchema),
    defaultValues: {
      ...personalInfo,
    },
  });

  const onSubmit = (values: any) => {
    console.log(values, "Personal Information");
    // Format the data according to the API structure
    const formattedData = {
      employeeData: {
        employeeId: values.EmployeeCode,
        employeeName: values.Fullname,
        position: values.JobTitle,
        employeeCode: values.EmployeeCode,
        department: values.Department,
        employeeType: "full-time", // Default value
        employmentType: values.EmploymentStatus,
        status: values.EmploymentStatus,
        onboardingDate: values.DateHired,
      },
      employeeProfile: {
        employeeId: values.EmployeeCode,
        firstName: values.Fullname.split(' ')[0],
        middleName: values.Fullname.split(' ').slice(1, -1).join(' '),
        lastName: values.Fullname.split(' ').pop() || '',
        dob: values.DOB,
        birthplace: values.PlaceOfBirth,
        currentAddress: values.HomeAddress,
        permanentAddress: values.HomeAddress,
        sex: values.Sex,
        civilStatus: values.CivilStatus,
        phoneNumber: values.PhoneNo,
        emailAddress: values.Email,
        spouse: values.Spouse,
        noofChildren: values.NoofChildren,
      }
    };

    console.log("Formatted Data:", formattedData);
    setPersonalInfo(values);
    navigate("/admin/create-employee/educational-background");
  };

  useEffect(() => {
    if (!form.formState.isValid) {
      console.log("Validation errors:", form.formState.errors);
    }
  }, [form.formState.errors]);

  return (
    <div className="flex items-center justify-center">
      <Card className=" p-4 w-2/3">
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
          <CardDescription>Basic employee information</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    name="Fullname"
                    placeholder="Fullname"
                    control={form.control}
                  />
                  <FormInput
                    name="EmployeeCode"
                    placeholder="Employee Code"
                    control={form.control}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <FormInput
                    name="JobTitle"
                    placeholder="Job Title"
                    control={form.control}
                  />
                  <FormInput
                    name="Department"
                    placeholder="Department"
                    control={form.control}
                  />
                  <FormInput
                    name="Office"
                    placeholder="Office"
                    control={form.control}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormDate
                      name="DateHired"
                      placeholder="Date Hired"
                      control={form.control}
                    />
                  </div>
                  <div>
                    <FormSelect
                      name="EmploymentStatus"
                      className="col-span-4"
                      placeholder="Employment Status"
                      control={form.control}
                      options={[
                        { value: "active", label: "Active" },
                        { value: "onleave", label: "On Leave" },
                        { value: "resigned", label: "Resigned" },
                        { value: "retired", label: "Retired" },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <Separator />
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Some description...</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date of Birth & Place of Birth */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormDate
                    name="DOB"
                    placeholder="Date of Birth"
                    control={form.control}
                  />
                </div>
                <div>
                  {/* Place of Birth */}
                  <FormInput
                    name="PlaceOfBirth"
                    placeholder="Place of Birth"
                    control={form.control}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormSelect
                    name="Sex"
                    placeholder="Sex"
                    control={form.control}
                    options={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                    ]}
                  />
                </div>
                <div>
                  <FormSelect
                    name="CivilStatus"
                    placeholder="Civil Status"
                    control={form.control}
                    options={[
                      { value: "single", label: "Single" },
                      { value: "married", label: "Married" },
                      { value: "widowed", label: "Widowed" },
                    ]}
                  />
                </div>
              </div>
              <div>
                <FormInput
                  name="HomeAddress"
                  placeholder="Home Address"
                  control={form.control}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormInput
                    name="PhoneNo"
                    placeholder="Phone No."
                    control={form.control}
                  />
                </div>
                <div>
                  <FormInput
                    name="TelephoneNo"
                    placeholder="Telephone No."
                    control={form.control}
                  />
                </div>
              </div>
              <div>
                <FormInput
                  name="Email"
                  placeholder="Email"
                  type="email"
                  control={form.control}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormInput
                    name="Spouse"
                    placeholder="Spouse"
                    control={form.control}
                  />
                </div>
                <div>
                  <FormDate
                    name="SpouseDOB"
                    placeholder="Spouse Date of Birth"
                    control={form.control}
                  />
                </div>
              </div>
              <div>
                <FormInput
                  name="NoofChildren"
                  placeholder="No. of Children"
                  type="number"
                  control={form.control}
                />
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button
                  variant={"outline"}
                  onClick={() => navigate("/admin/employee-management")}
                >
                  Back
                </Button>
                <Button type="submit">Next</Button>
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default PersonalInformation;
