import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
// import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { empEducationAtom } from "../../../atom";
import { useForm } from "react-hook-form";
import { empFormEducationSchema } from "../../../schema/employee-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import FormInput from "@/custom-components/Form/FormInput";
import { useEffect } from "react";

const levels = [
  "Elementary",
  "Secondary",
  "TVL Courses",
  "Tertiary",
  "Graduate",
  "Post Graduate",
];

const EducationalBackground = () => {
  const navigate = useNavigate();
  const [education, setEducation] = useAtom(empEducationAtom);
  const form = useForm({
    resolver: zodResolver(empFormEducationSchema),
    defaultValues: education || {
      educationalBackground: levels.map(() => ({
        // Level: level,
        SchoolAttended: "",
        YearGraduated: "",
        AwardsReceived: "",
      })),
    },
  });

  const { errors } = form.formState;

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log(errors);
    }
  }, [errors]);

  const onSubmit = (values: any) => {
    // Format the data according to the API structure
    const formattedData = {
      educationalBackground: values.educationalBackground.map(
        (entry: any, index: number) => ({
          level: levels[index],
          schoolAttended: entry.SchoolAttended,
          yearsGraduated: entry.YearGraduated,
          awardsReceived: entry.AwardsReceived
        })
      )
    };

    console.log("Formatted Educational Background:", formattedData);
    setEducation(values);
    navigate("/admin/create-employee/eligibilities");
  };

  return (
    <div className="flex items-center justify-center min-h-full">
      <Card className="p-4 w-4/5">
        <CardHeader>
          <CardTitle>Educational Background</CardTitle>
          <CardDescription>Some description ...</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Level</TableHead>
                    <TableHead className="w-1/3">
                      Course/Schools Attended
                    </TableHead>
                    <TableHead className="w-1/6">Year Graduated</TableHead>
                    <TableHead className="w-1/4">
                      Awards/Citations Received
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {levels.map((level, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{level}</TableCell>
                      <TableCell>
                        <FormInput
                          name={`educationalBackground[${index}].SchoolAttended`}
                          control={form.control}
                        />
                      </TableCell>
                      <TableCell>
                        <FormInput
                          name={`educationalBackground[${index}].YearGraduated`}
                          control={form.control}
                        />
                      </TableCell>
                      <TableCell>
                        <FormInput
                          name={`educationalBackground[${index}].AwardsReceived`}
                          control={form.control}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant={"outline"}
                  onClick={() =>
                    navigate("/admin/create-employee/personal-information")
                  }
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

export default EducationalBackground;
