import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  empFormEligSchema,
  EmpEligType,
} from "../../../schema/employee-schema";
import { Form } from "@/components/ui/form";
import { useAtom } from "jotai";
import { empEligibilityAtom } from "../../../atom";
import FormInput from "@/custom-components/Form/FormInput";
import FormSelect from "@/custom-components/Form/FormSelect";

const employmentTypeOptions = [
  { value: "full-time", label: "Full-Time" },
  { value: "part-time", label: "Part-Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const Eligibilities = () => {
  const navigate = useNavigate();
  const [eligibilities, setEligibilities] = useAtom(empEligibilityAtom);

  const form = useForm<EmpEligType>({
    resolver: zodResolver(empFormEligSchema),
    defaultValues: eligibilities || {
      Memberships: [{ organizationName: "" }],
      Eligibilities: [
        { examAssessment: "", certificateNo: "", nttcNo: "", expiryDate: "" },
      ],
      EmploymentHistory: [
        { position: "", employer: "", startDate: "", endDate: "", type: "" },
      ],
    },
  });

  const { errors } = form.formState;

  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);

  const onSubmit = (values: EmpEligType) => {
    // Format the data according to the API structure
    const formattedData = {
      membership: values.Memberships.map(mem => ({
        organizationName: mem.organizationName
      })),
      eligibilities: values.Eligibilities.map(elig => ({
        examinationName: elig.examAssessment,
        certificateNo: elig.certificateNo,
        nttcNo: elig.nttcNo,
        expiryDate: elig.expiryDate
      })),
      employmetHistory: values.EmploymentHistory.map(hist => ({
        position: hist.position,
        startDate: hist.startDate,
        endDate: hist.endDate,
        employmentType: hist.type
      }))
    };

    console.log("Formatted Eligibilities Data:", formattedData);
    setEligibilities(values);
    navigate("/admin/create-employee/employee-documents");
  };

  useEffect(() => {
    console.log("Eligibilities Component Mounted");
    console.log("Initial Form Values:", form.getValues());
  }, []);

  const memberships = form.getValues("Memberships") || [];
  const eligibilitiesList = form.getValues("Eligibilities") || [];
  const employmentHistory = form.getValues("EmploymentHistory") || [];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-4/5 p-4">
        <CardHeader className="text-lg font-bold">
          Membership in Professional Organizations
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              {memberships.map((_, i) => (
                <div key={i} className="py-2">
                  <FormInput
                    name={`Memberships.${i}.organizationName`}
                    control={form.control}
                    placeholder="Enter organization name"
                  />
                </div>
              ))}
              <div className="flex justify-start mt-4">
                <Button
                  onClick={() =>
                    form.setValue("Memberships", [
                      ...memberships,
                      { organizationName: "" },
                    ])
                  }
                  variant="outline"
                >
                  + Add Membership
                </Button>
              </div>
            </CardContent>
            <Separator />
            <CardHeader className="text-lg font-bold">Eligibilities</CardHeader>
            <CardContent>
              <Card className="p-0 rounded-sm shadow-none">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">
                        Examination/ Assessment
                      </TableHead>
                      <TableHead className="w-1/4">Certificate No.</TableHead>
                      <TableHead className="w-1/4">NTTC No.</TableHead>
                      <TableHead className="w-1/4">Expiry Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eligibilitiesList.map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <FormInput
                            name={`Eligibilities.${i}.examAssessment`}
                            control={form.control}
                            placeholder="Enter exam/assessment"
                          />
                        </TableCell>
                        <TableCell>
                          <FormInput
                            name={`Eligibilities.${i}.certificateNo`}
                            control={form.control}
                            placeholder="Enter certificate no."
                          />
                        </TableCell>
                        <TableCell>
                          <FormInput
                            name={`Eligibilities.${i}.nttcNo`}
                            control={form.control}
                            placeholder="Enter NTTC no."
                          />
                        </TableCell>
                        <TableCell>
                          <FormInput
                            name={`Eligibilities.${i}.expiryDate`}
                            control={form.control}
                            type="date"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
              <div className="flex justify-start mt-4">
                <Button
                  onClick={() =>
                    form.setValue("Eligibilities", [
                      ...eligibilitiesList,
                      {
                        examAssessment: "",
                        certificateNo: "",
                        nttcNo: "",
                        expiryDate: "",
                      },
                    ])
                  }
                  variant="outline"
                >
                  + Add Eligibility
                </Button>
              </div>
            </CardContent>
            <Separator />
            <CardHeader className="text-lg font-bold">
              Employment History
            </CardHeader>
            <CardContent>
              <Card className="p-0 rounded-sm shadow-none">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/5">Position</TableHead>
                      <TableHead className="w-1/4">Employer</TableHead>
                      <TableHead className="w-1/4">Inclusive Dates</TableHead>
                      <TableHead className="w-1/6">Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employmentHistory.map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <FormInput
                            name={`EmploymentHistory.${i}.position`}
                            control={form.control}
                            placeholder="Enter position"
                          />
                        </TableCell>
                        <TableCell>
                          <FormInput
                            name={`EmploymentHistory.${i}.employer`}
                            control={form.control}
                            placeholder="Enter employer"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <FormInput
                              name={`EmploymentHistory.${i}.startDate`}
                              control={form.control}
                              type="date"
                              className="input w-1/2"
                            />
                            <FormInput
                              name={`EmploymentHistory.${i}.endDate`}
                              control={form.control}
                              type="date"
                              className="input w-1/2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <FormSelect
                            name={`EmploymentHistory.${i}.type`}
                            control={form.control}
                            placeholder="Type"
                            options={employmentTypeOptions}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
              <div className="flex justify-start mt-4">
                <Button
                  onClick={() =>
                    form.setValue("EmploymentHistory", [
                      ...employmentHistory,
                      {
                        position: "",
                        employer: "",
                        startDate: "",
                        endDate: "",
                        type: "",
                      },
                    ])
                  }
                  variant="outline"
                >
                  + Add Employment
                </Button>
              </div>
              <CardContent />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant={"outline"} onClick={() => navigate(-1)}>
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

export default Eligibilities;
