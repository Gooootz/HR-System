import axios from "axios";

// const API_URL_ATTENDANCE = "http://localhost:5206";
// const API_URL_DTR = "http://localhost:5018";

const API_URL_ATTENDANCE = "https://odeldevhrapi.azurewebsites.net";
const API_URL_DTR = "https://odeldevdtrapi.azurewebsites.net";

// Define structure for DTR Entries
interface DTR_Entries {
  id: string;
  date: string;
  time_in_am: string | null;
  time_out_am: string | null;
  time_in_pm: string | null;
  time_out_pm: string | null;
  totalHours: number;
  totalMinutes: number;
  overtime: number;
}

// Define structure for DTR records
interface DTR {
  id: string;
  employee_Id: string;
  entries: DTR_Entries[];
}

// Employee data structure
export type EmployeeData = {
  id: string;
  employee_Id: string;
  dtr_Id: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  employmentStatus: string;
};

// Expected attendance structure for frontend table
export type Employee = {
  id: string;
  date: string;
  employee_Id: string;
  employeeName: string;
  department: string;
  time_in_am: string;
  time_out_am: string;
  time_in_pm: string;
  time_out_pm: string;
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

// Fetch employee details by ID
export const fetchEmployeeDetails = async (employee_Id: string): Promise<{ employeeName: string; department: string }> => {
  try {
    const response = await axios.get<EmployeeData>(`${API_URL_ATTENDANCE}/api/employee-data/${employee_Id}`);
    return {
      employeeName: response.data?.employeeName ?? "Unknown",
      department: response.data?.department ?? "Unknown",
    };
  } catch (error) {
    console.error(`Error fetching employee details for ID ${employee_Id}:`, error);
    return { employeeName: "Unknown", department: "Unknown" };
  }
};

// Utility function to parse time string into Date object
const parseTime = (timeStr: string | null): Date | null => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Function to determine employee attendance status
const determineStatus = (
  time_in_am: string | null,
  time_out_am: string | null,
  time_in_pm: string | null,
  time_out_pm: string | null,
  totalHours: number
): Employee["status"] => {
  if (!time_in_am && !time_out_am && !time_in_pm && !time_out_pm) return "Absent";
  if (!time_in_am && !time_out_am) return "Present PM";
  if (!time_in_pm && !time_out_pm) return "Present AM";
  if (!time_in_am) return "no time in am";
  if (!time_out_am) return "no time out am";
  if (!time_in_pm) return "no time in pm";
  if (!time_out_pm) return "no time out pm";

  if (totalHours === 8) return "Present Whole Day";
  if (totalHours < 8) return "Late";
  return "Pending";
};

// Function to calculate total hours worked
const calculateTotalHours = (
  time_in_am: string | null,
  time_out_am: string | null,
  time_in_pm: string | null,
  time_out_pm: string | null
): number => {
  const inAM = parseTime(time_in_am);
  const outAM = parseTime(time_out_am);
  const inPM = parseTime(time_in_pm);
  const outPM = parseTime(time_out_pm);

  let totalMinutes = 0;
  if (inAM && outAM) totalMinutes += (outAM.getTime() - inAM.getTime()) / 60000;
  if (inPM && outPM) totalMinutes += (outPM.getTime() - inPM.getTime()) / 60000;

  return Math.round(totalMinutes / 60 * 100) / 100; // Convert minutes to hours and round to 2 decimal places
};

// Fetch attendance records and enrich them with employee details
export const fetchAttendance = async (): Promise<Employee[]> => {
  try {
    const response = await axios.get<DTR[]>(`${API_URL_DTR}/api/dtr/get-all-records`);
    console.log("📌 Raw Attendance Data:", response.data); // Check if time fields exist

    const enrichedAttendance = await Promise.all(
      response.data.map(async (record) => {
        const { employeeName, department } = await fetchEmployeeDetails(record.employee_Id);

        return record.entries.map((entry) => {
          console.log("📌 Entry Data:", entry); // Ensure time fields exist here

          const totalHours = calculateTotalHours(
            entry.time_in_am,
            entry.time_out_am,
            entry.time_in_pm,
            entry.time_out_pm
          );

          return {
            id: entry.id,
            date: entry.date,
            employee_Id: record.employee_Id,
            employeeName,
            department,
            time_in_am: entry.time_in_am ?? "N/A",
            time_out_am: entry.time_out_am ?? "N/A",
            time_in_pm: entry.time_in_pm ?? "N/A",
            time_out_pm: entry.time_out_pm ?? "N/A",
            totalHours,
            status: determineStatus(
              entry.time_in_am,
              entry.time_out_am,
              entry.time_in_pm,
              entry.time_out_pm,
              totalHours
            ),
          };
        });
      })
    );

    const flattenedData = enrichedAttendance.flat();
    console.log("📌 Processed Attendance Data:", flattenedData); // Final processed data

    return flattenedData;
  } catch (error) {
    console.error("❌ Error fetching attendance records:", error);
    return [];
  }
};

