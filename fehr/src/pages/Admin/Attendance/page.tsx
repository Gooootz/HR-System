// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectItem,
//   SelectTrigger,
//   SelectContent,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { SummaryTabs } from "./components/summary-tabs";
// import { DataTable } from "@/custom-components/DataTable";
// import {
//   attendanceColumns,
//   employeeAttendace,
// } from "./components/table/attendance-cols";
// import { Separator } from "@/components/ui/separator";

// const AttendanceMonitoring = () => {
//   return (
//     <Card className="w-full">
//       <CardHeader className="text-sm">
//         <CardTitle>Employee Attendance</CardTitle>
//         <CardDescription>Some description</CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <SummaryTabs />
//         <Separator />
//         <div className="flex justify-between gap-4 mt-4">
//           <div className="flex w-1/2 gap-2">
//             <Input
//               placeholder="Search Employee..."
//               className="col-span-2 h-9 text-xs"
//             />
//             <Select>
//               <SelectTrigger>
//                 <span>Select Department</span>
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="hr">HR</SelectItem>
//                 <SelectItem value="it">IT</SelectItem>
//                 <SelectItem value="finance">Finance</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-x-2">
//             <Button variant="outline">Export CSV</Button>
//             <Button variant="outline">Generate Report</Button>
//           </div>
//         </div>
//         <DataTable columns={attendanceColumns} data={employeeAttendace} />
//       </CardContent>
//     </Card>
//   );
// };

// export default AttendanceMonitoring;


import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SummaryTabs } from "./components/summary-tabs";
import { DataTable } from "@/custom-components/DataTable";
import {
  attendanceColumns,
  Employee,
} from "./components/table/attendance-cols";
import { fetchAttendance } from "./components/AttendanceService";
import { Separator } from "@/components/ui/separator";

const AttendanceMonitoring = () => {
  const [attendanceData, setAttendanceData] = useState<Employee[]>([]);

  useEffect(() => {
    const getAttendance = async () => {
      const data = await fetchAttendance();
      setAttendanceData(data.map(record => ({
        ...record,
        employeeName: record.employeeName || "",
        timeIn: record.time_in_am || record.time_in_pm || "N/A",
      })));
    };

    getAttendance();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="text-sm">
        <CardTitle>Employee Attendance</CardTitle>
        <CardDescription>Some description</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SummaryTabs />
        <Separator />
        <div className="flex justify-between gap-4 mt-4">
          <div className="flex w-1/2 gap-2">
            <Input
              placeholder="Search Employee..."
              className="col-span-2 h-9 text-xs"
            />
            <Select>
              <SelectTrigger>
                <span>Select Department</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-x-2">
            <Button variant="outline">Export CSV</Button>
            <Button variant="outline">Generate Report</Button>
          </div>
        </div>
        <DataTable columns={attendanceColumns} data={attendanceData} />
      </CardContent>
    </Card>
  );
};

export default AttendanceMonitoring;
