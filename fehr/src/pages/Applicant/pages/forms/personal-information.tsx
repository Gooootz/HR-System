import { Button } from "@/components/ui/button";
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
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const ApplicantPersonalInformation = () => {
  const navigate = useNavigate();
  const [currentAddress, setCurrentAddress] = useState("");
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [permanentAddress, setPermanentAddress] = useState("");

  const handleCheckboxChange = () => {
    setIsSameAddress((prev) => !prev);
    if (!isSameAddress) {
      setPermanentAddress(currentAddress); // Copy current address to permanent address
    } else {
      setPermanentAddress(""); // Clear permanent address if unchecked
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-[120vh] p-4">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Some description...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Last Name, First Name, Middle Name, Name Extension */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Enter last name" required />
            </div>
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Enter first name" required />
            </div>
            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" placeholder="Enter middle name" />
            </div>
            <div>
              <Label htmlFor="nameExtension">Name Extension (optional)</Label>
              <Input
                id="nameExtension"
                placeholder="Enter name extension (e.g., Jr., Sr.)"
              />
            </div>
          </div>

          {/* Date of Birth and Age */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" required />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" readOnly />
            </div>
          </div>
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
              <Label htmlFor="civilStatus">Civil Status</Label>
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

          {/* Current Address and Permanent Address */}
          <div>
            <Label htmlFor="currentAddress">Current Address</Label>
            <Input
              id="currentAddress"
              placeholder="Enter current address"
              value={currentAddress}
              onChange={(e) => setCurrentAddress(e.target.value)}
            />
          </div>

          <div className="mt-4 flex items-center">
            <Input
              type="checkbox"
              id="sameAddressCheckbox"
              checked={isSameAddress}
              onChange={handleCheckboxChange}
              className="mr-2 w-4 h-4"
            />
            <Label htmlFor="sameAddressCheckbox" className="mt-1">
              Current address is the same as permanent address
            </Label>
          </div>

          {!isSameAddress && (
            <div className="mt-4">
              <Label htmlFor="permanentAddress">Permanent Address</Label>
              <Input
                id="permanentAddress"
                placeholder="Enter permanent address"
                value={permanentAddress}
                onChange={(e) => setPermanentAddress(e.target.value)}
              />
            </div>
          )}

          {/* Phone No & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone No.</Label>
              <Input id="phone" type="tel" placeholder="Enter phone number" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Enter email" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-4 gap-2">
            <Button variant={"outline"} onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button
              onClick={() => navigate("/application/applicant-documents")}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
