import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import ViewImage from "../components/view-img";
import StaticEducationTable from "../components/educationalbg-table";
import ApplicantEvaluationDialog from "../components/evaluation-dialog";

const ApplicantInfo = () => {
  const staticDocuments = [
    {
      Id: "1",
      DocumentType: "bc",
      BinaryData: "iVBORw0KGgoAAAANSUhEUgAA...",
    },
    {
      Id: "2",
      DocumentType: "gm",
      BinaryData: "iVBORw0KGgoAAAANSUhEUgAA...",
    },
  ];

  return (
    <>
      <div className="flex pb-2 justify-end">
        <ApplicantEvaluationDialog />
      </div>
      <div className="grid grid-cols-5 items-start justify-center gap-4">
        <div className="col-span-3 space-y-4">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Applicant Information</CardTitle>
              <CardDescription>Basic applicant information</CardDescription>
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
                    <Label htmlFor="datehired">Applied On</Label>
                    <Input id="datehired" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="status">Application Status</Label>
                    <Input id="status" placeholder="Select status" />
                  </div>
                </div>
              </div>
            </CardContent>
            <Separator />
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Some description...</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                {/* Date of Birth & Place of Birth */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="pob">Place of Birth</Label>
                    <Input id="pob" placeholder="Enter place of birth" />
                  </div>
                </div>

                {/* Sex & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sex">Sex</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
            <Separator />
            <CardHeader>
              <CardTitle>Educational Background</CardTitle>
              <CardDescription>Some description</CardDescription>
            </CardHeader>
            <CardContent>
              <StaticEducationTable />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2 space-y-4">
          <Card className="p-4 ">
            <CardHeader>
              <CardTitle>Address & Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Home Address</Label>
                  <Input id="address" placeholder="Enter home address" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone No.</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telephone">Telephone No.</Label>
                    <Input
                      id="telephone"
                      type="tel"
                      placeholder="Enter telephone number"
                    />
                  </div>
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
              <CardTitle>Requirements</CardTitle>
              <CardDescription>Uploaded files/documents</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 pt-4 justify-start w-full">
              <ViewImage
                label="Application Letter"
                type="bc"
                data={staticDocuments}
              />
              <ViewImage label="View PSA" type="bc" data={staticDocuments} />
              <ViewImage
                label="View Good Moral "
                type="bc"
                data={staticDocuments}
              />
              <ViewImage
                label="View Diploma "
                type="bc"
                data={staticDocuments}
              />
              <ViewImage label="View TOR " type="bc" data={staticDocuments} />
              <ViewImage
                label="View Certificates "
                type="bc"
                data={staticDocuments}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ApplicantInfo;
