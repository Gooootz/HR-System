import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import moment from "moment";

interface DtrEntry {
  id: string;
  date: string;
  time_in_am: string;
  time_out_am: string;
  time_in_pm: string;
  time_out_pm: string;
  overtime: string;
}

interface DtrRecord {
  id: string;
  employee_Id: string;
  entries: DtrEntry[];
}

interface Event {
  Id: string;
  date: string;
  type: string;
  title: string;
  color: string;
  whole_day: boolean;
  is_morning: boolean;
}

const API_URL = "http://localhost:5018/";
// const API_URL = "https://odeldevdtrapi.azurewebsites.net/";

const DTR = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [timeRecords, setTimeRecords] = useState<DtrEntry[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [error, setError] = useState("");
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const formattedRecords: DtrEntry[] = Array.from(
      { length: daysInMonth },
      (_, index) => ({
        id: `${year}-${month + 1}-${index + 1}`,
        date: `${year}-${(month + 1).toString().padStart(2, "0")}-${(index + 1)
          .toString()
          .padStart(2, "0")}`,
        time_in_am: "",
        time_out_am: "",
        time_in_pm: "",
        time_out_pm: "",
        overtime: "",
      })
    );

    setTimeRecords(formattedRecords);
  }, [selectedMonth]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get<Event[]>(`${API_URL}api/schoolcalendar`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const fetchDTRRecords = async () => {
    if (!employeeId) {
      setError("Employee ID is required.");
      return;
    }

    try {
      const response = await axios.get<DtrRecord[]>(
        `${API_URL}api/dtr/get-employee-records`,
        {
          params: { employeeId },
        }
      );

      const fetchedRecords = response.data.flatMap((record) => record.entries);

      setTimeRecords((prevRecords) =>
        prevRecords.map((day) => {
          const match = fetchedRecords.find((entry) => entry.date === day.date);
          return match || day;
        })
      );

      setError("");
    } catch (error) {
      console.error("Error fetching DTR records", error);
      setError("No records found.");
      setTimeRecords([]);
    }
  };

  const parseTime = (date: string, time?: string, isPM: boolean = false): Date | null => {
    if (!time || time.trim() === "") return null;

    const timeParts = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i);
    if (timeParts) {
      let hours = parseInt(timeParts[1], 10);
      const minutes = parseInt(timeParts[2], 10);
      let period = timeParts[3]?.toUpperCase();

      if (!period && isPM) {
        period = "PM";
      }

      if (!period) {
        if (hours >= 1 && hours <= 11) {
          period = "AM";
        } else if (hours === 12) {
          period = "PM";
        }
      }

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
        return new Date(`${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);
      }
    }

    // Handle 24-hour format
    const time24Parts = time.match(/^(\d{2}):(\d{2})$/);
    if (time24Parts) {
      const hours = parseInt(time24Parts[1], 10);
      const minutes = parseInt(time24Parts[2], 10);

      if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
        return new Date(`${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);
      }
    }

    return null;
  };

  const calculateTotalHoursAndMinutes = (
    record: DtrEntry
  ): { totalHours: number | string; totalMinutes: number | string } => {
    const amIn = parseTime(record.date, record.time_in_am);
    const amOut = parseTime(record.date, record.time_out_am);
    const pmIn = parseTime(record.date, record.time_in_pm, true);
    const pmOut = parseTime(record.date, record.time_out_pm, true);

    const calculateTimeDiff = (start: Date | null, end: Date | null): number => {
      if (!start || !end) return 0;
      if (start.getDate() !== end.getDate()) return 0;

      const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      return Math.max(diffMinutes, 0);
    };

    if (!amIn && !amOut && !pmIn && !pmOut) {
      return { totalHours: "", totalMinutes: "" };
    }

    if (!amIn && !pmIn) {
      return { totalHours: "Incomplete", totalMinutes: "Incomplete" };
    }

    if (amIn && amOut && pmIn && pmOut) {
      const totalMinutes = calculateTimeDiff(amIn, amOut) + calculateTimeDiff(pmIn, pmOut);
      return { totalHours: Math.floor(totalMinutes / 60), totalMinutes: totalMinutes % 60 };
    }

    if (amIn && amOut && !pmIn && !pmOut) {
      const totalMinutes = calculateTimeDiff(amIn, amOut);
      return { totalHours: Math.floor(totalMinutes / 60), totalMinutes: totalMinutes % 60 };
    }

    if (!amIn && amOut && pmIn && pmOut) {
      return { totalHours: "Incomplete", totalMinutes: "Incomplete" };
    }

    if (!amIn && !amOut && pmIn && pmOut) {
      const totalMinutes = calculateTimeDiff(pmIn, pmOut);
      return { totalHours: Math.floor(totalMinutes / 60), totalMinutes: totalMinutes % 60 };
    }

    const times = [amIn, amOut, pmIn, pmOut].filter(Boolean) as Date[];
    if (times.length >= 2) {
      const firstIn = times[0];
      const lastOut = times[times.length - 1];

      if (firstIn.getDate() !== lastOut.getDate()) {
        return { totalHours: "Incomplete", totalMinutes: "Incomplete" };
      }

      const totalMinutes = calculateTimeDiff(firstIn, lastOut);
      return { totalHours: Math.floor(totalMinutes / 60), totalMinutes: totalMinutes % 60 };
    }

    return { totalHours: "Incomplete", totalMinutes: "Incomplete" };
  };

  const totalHoursWorked = timeRecords.reduce((total, record) => {
    const { totalHours, totalMinutes } = calculateTotalHoursAndMinutes(record);
    if (typeof totalHours === "number" && typeof totalMinutes === "number") {
      return total + totalHours + totalMinutes / 60;
    }
    return total;
  }, 0);

  const getCellStyle = (date: string, isMorning: boolean) => {
    const event = events.find(
      (event) => moment(event.date).format('YYYY-MM-DD') === date
    );

    if (!event) return {};

    const backgroundColor = event.color;
    const opacity = event.whole_day ? 0.25 : 0.25;

    if (event.whole_day) {
      return { backgroundColor, opacity };
    } else if (event.is_morning && isMorning) {
      return { backgroundColor, opacity };
    } else if (!event.is_morning && !isMorning) {
      return { backgroundColor, opacity };
    }

    return {};
  };

  const formatTo12Hour = (time: string): string => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return time;

    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${formattedHours}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  return (
    <div>
      <Card className="w-full mx-auto p-4">
        <CardContent className="p-3">
          <div className="space-y-4 mb-4">
            <div className="flex justify-end items-center gap-2">
              <Input
                className="h-9 w-60"
                placeholder="Search Employee Name or ID No."
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
              <Button onClick={fetchDTRRecords}>Generate DTR</Button>
            </div>

            <Separator />
            <div className="flex justify-between">
              <div className="flex items-center">
                <Input
                  type="month"
                  value={selectedMonth.toISOString().slice(0, 7)}
                  onChange={(e) =>
                    setSelectedMonth(new Date(e.target.value + "-01"))
                  }
                  className="w-52"
                />
              </div>
              <div className="flex justify-end items-center gap-2">
                <Button variant={"outline"}>Print</Button>
                <Button variant={"outline"}>Download</Button>
                <Button variant={"outline"}>Export CSV</Button>
              </div>
            </div>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {/* DTR Table */}
          <div className="overflow-auto">
            <Table className="border border-gray-300">
              <TableHeader>
                <TableRow className="border border-gray-300 bg-gray-100">
                  <TableHead
                    className="text-center border border-gray-300"
                    rowSpan={2}
                  >
                    No.
                  </TableHead>
                  <TableHead
                    className="text-center border border-gray-300"
                    rowSpan={2}
                  >
                    Date
                  </TableHead>
                  <TableHead
                    className="text-center border border-gray-300"
                    colSpan={2}
                  >
                    Morning
                  </TableHead>
                  <TableHead
                    className="text-center border border-gray-300"
                    colSpan={2}
                  >
                    Afternoon
                  </TableHead>
                  <TableHead
                    className="text-center border border-gray-300"
                    rowSpan={2}
                  >
                    Hours
                  </TableHead>
                  <TableHead
                    className="text-center border border-gray-300"
                    rowSpan={2}
                  >
                    Minutes
                  </TableHead>
                  <TableHead
                    className="text-center border border-gray-300"
                    rowSpan={2}
                  >
                    OT
                  </TableHead>
                </TableRow>
                <TableRow className="bg-gray-100 ">
                  <TableHead className="text-center border border-gray-300">
                    AM In
                  </TableHead>
                  <TableHead className="text-center border border-gray-300">
                    AM Out
                  </TableHead>
                  <TableHead className="text-center border border-gray-300">
                    PM In
                  </TableHead>
                  <TableHead className="text-center border border-gray-300">
                    PM Out
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {timeRecords.map((record, index) => {
                  const { totalHours, totalMinutes } = calculateTotalHoursAndMinutes(record);
                  return (
                    <TableRow key={index}>
                      <TableCell className="text-center w-16 border border-r-gray-300 font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-center w-28 border border-r-gray-300">
                        {record.date}
                      </TableCell>
                      <TableCell className="border border-r-gray-300" style={getCellStyle(record.date, true)}>
                        {formatTo12Hour(record.time_in_am)}
                      </TableCell>
                      <TableCell className="border border-r-gray-300" style={getCellStyle(record.date, true)}>
                        {formatTo12Hour(record.time_out_am)}
                      </TableCell>
                      <TableCell className="border border-r-gray-300" style={getCellStyle(record.date, false)}>
                        {formatTo12Hour(record.time_in_pm)}
                      </TableCell>
                      <TableCell className="border border-r-gray-300" style={getCellStyle(record.date, false)}>
                        {formatTo12Hour(record.time_out_pm)}
                      </TableCell>
                      <TableCell className="border border-r-gray-300">{totalHours}</TableCell>
                      <TableCell className="border border-r-gray-300">{totalMinutes}</TableCell>
                      <TableCell className="border border-r-gray-300">{record.overtime}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="border border-gray-300 text-right font-semibold"
                  >
                    Total Days: {timeRecords.length}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="border border-gray-300 text-right font-semibold"
                  >
                    Present Days:{" "}
                    {
                      timeRecords.filter(
                        (record) => record.time_in_am || record.time_out_pm
                      ).length
                    }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="border border-gray-300 text-right font-semibold"
                  >
                    Absent Days:{" "}
                    {
                      timeRecords.filter(
                        (record) => !record.time_in_am && !record.time_out_pm
                      ).length
                    }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="border border-gray-300 text-right font-semibold"
                  >
                    Total hrs Worked: {totalHoursWorked.toFixed(2)} hrs
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DTR;