import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useStatusBadge } from "@/hooks/use-status";
import { fetchAttendance } from "../AttendanceService";

export type Employee = {
  id: string;
  date: string;
  employee_Id: string;
  employeeName: string;
  department: string;
  time_in_am?: string;
  time_out_am?: string;
  time_in_pm?: string;
  time_out_pm?: string;
  status:
  | "Present"
  | "Absent"
  | "Late"
  | "Pending"
  | "Present Whole Day" // Add this
  | "Present PM"
  | "Present AM"
  | "no time out am"
  | "no time out pm"
  | "no time in am"
  | "no time in pm"
  | "absent am"
  | "absent pm";
  totalHours: number;
};

// Fetch attendance data before rendering
export const useEmployeeAttendance = () => {
  const [attendanceData, setAttendanceData] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAttendance();

        console.log("📌 Data received in useEmployeeAttendance:", data); // Log entire response

        if (!data || data.length === 0) {
          console.warn("⚠️ No data returned from API.");
          return;
        }

        setAttendanceData(
          data.map(record => {
            console.log("📌 Raw Record:", record); // Log each record

            console.log(
              "📌 Time Values -> AM In:", record.time_in_am,
              "| PM In:", record.time_in_pm,
              "| AM Out:", record.time_out_am,
              "| PM Out:", record.time_out_pm
            );

            return {
              id: record.id,
              date: record.date,
              employee_Id: record.employee_Id,
              employeeName: record.employeeName ?? "Unknown",
              department: record.department ?? "Unknown",
              time_in_am: record.time_in_am || "N/A",
              time_out_am: record.time_out_am || "N/A",
              time_in_pm: record.time_in_pm || "N/A",
              time_out_pm: record.time_out_pm || "N/A",
              status: record.status as Employee["status"],
              totalHours: record.totalHours,
            };
          })
        );

      } catch (error) {
        console.error("🚨 Error fetching attendance data:", error);
      }
    };

    fetchData();
  }, []);

  return attendanceData;
};

export const attendanceColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "employee_Id",
    header: "Employee ID",
  },
  {
    accessorKey: "employeeName",
    header: "Employee Name",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "timeIn",
    header: "Time In",
    cell: ({ row }) => (
      <div>
        <div>AM: {row.original.time_in_am} - {row.original.time_out_am}</div>
      </div>
    ),
  },
  {
    accessorKey: "timeOut",
    header: "Time Out",
    cell: ({ row }) => (
      <div>
        <div>PM: {row.original.time_in_pm} - {row.original.time_out_pm}</div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const badgeClass = useStatusBadge(row.original.status, "attendance");
      return <Badge className={badgeClass}>{row.original.status}</Badge>;
    },
  },
  {
    accessorKey: "totalHours",
    header: "Total Hours",
  },
];