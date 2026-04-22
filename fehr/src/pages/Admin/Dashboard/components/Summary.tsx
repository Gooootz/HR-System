import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AttendanceSummary from "./attendance-summary";
import { RunningTime } from "./running-time";
import { Label } from "../../../../components/ui/label";

const Summary = () => {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="space-y-4">
          <Card className="h-[8rem] flex flex-col justify-between">
            <CardHeader>Total Active Employees</CardHeader>
            <CardContent className="flex items-center gap-2">
              <div className="flex justify-between items-center w-full">
                <Label className="text-3xl text-[#d7d764]">200</Label>
                {/* <User className="text-[#B6BE00]" size={30} /> */}
              </div>
            </CardContent>
          </Card>
          <Card className="h-[8rem] flex flex-col justify-between">
            <CardHeader>New Hired Employees</CardHeader>
            <CardContent className="flex items-center gap-2">
              <div className="flex justify-between items-center w-full ">
                <Label className="text-3xl text-[#d7d764]">10</Label>
                {/* <UserPlus className="text-[#B6BE00]" size={30} /> */}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="h-[8rem] flex flex-col justify-between">
            <CardHeader>Employees On Leave</CardHeader>
            <CardContent className="flex items-center gap-2">
              <div className="flex justify-between items-center w-full">
                <Label className="text-3xl text-[#d7d764]">5</Label>
                {/* <UserMinus className="text-[#B6BE00]" size={30} /> */}
              </div>
            </CardContent>
          </Card>
          <Card className="h-[8rem] flex flex-col justify-between">
            <CardHeader>Pending Leave Approvals</CardHeader>
            <CardContent className="flex items-center gap-2">
              <div className="flex justify-between items-center w-full">
                <Label className="text-3xl text-[#d7d764]">10</Label>
                {/* <Clock className="text-[#B6BE00]" size={30} /> */}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-[17rem] flex flex-col justify-between">
            <CardHeader>Daily Attendance Summary</CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AttendanceSummary present={21} absent={2} late={4} />
              </div>
              <div className="flex py-5">
                <RunningTime />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Summary;
