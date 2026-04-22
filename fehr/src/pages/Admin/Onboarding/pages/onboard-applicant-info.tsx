import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const OnboardApplicantInfo = () => {
  return (
    <div>
      <div className="flex pb-2 justify-end">
        {/* <OnboardingStatusDialog /> */}
      </div>
      <div className="grid grid-cols-5 items-start justify-center gap-4">
        <div className="col-span-3 space-y-4">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Onboarding Information</CardTitle>
              <CardDescription>Employee onboarding details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullname">Fullname</Label>
                    <Input
                      id="fullname"
                      type="text"
                      placeholder="Enter fullname"
                    />
                  </div>
                  <div>
                    <Label htmlFor="jobtitle">Job Title</Label>
                    <Input
                      id="jobtitle"
                      type="text"
                      placeholder="Enter job title"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      type="text"
                      placeholder="Enter department"
                    />
                  </div>
                  <div>
                    <Label htmlFor="onboardingStatus">Onboarding Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader>
              <CardTitle>Onboarding Checklist</CardTitle>
              <CardDescription>
                Ensure all necessary steps are completed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox id="contract" />
                <Label htmlFor="contract">
                  AC Employee Self-Service Portal Registration
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="id" />
                <Label htmlFor="id">Transcript of Records</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="medical" />
                <Label htmlFor="medical">Authenticated Diploma</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="orientation" />
                <Label htmlFor="orientation">Birth Certificate</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="orientation" />
                <Label htmlFor="orientation">Certificateds from Seminars</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="orientation" />
                <Label htmlFor="orientation">Employment Record</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="orientation" />
                <Label htmlFor="orientation">Government IDs</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2 space-y-4">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone No.</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Evaluation Notes</CardTitle>
              <CardDescription>
                Asssessment from applicant tracking process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea className="h-28" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OnboardApplicantInfo;
