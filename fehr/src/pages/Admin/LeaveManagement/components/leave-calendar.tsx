import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer, Event as BaseEvent } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const localizer = momentLocalizer(moment);

interface Event extends BaseEvent {
  id: string;
  employeeId: string;
  leaveType: string;
  reason: string;
  status: string;
}

const LeaveCalendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await fetch("http://localhost:5018/api/leaverequests/get-leave-requests");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (!Array.isArray(data)) {
          throw new Error("Invalid response format: Expected an array");
        }

        // Map leave data into events
        const mappedEvents: Event[] = [];

        data.forEach((leave: any) => {
          if (Array.isArray(leave.dates) && leave.dates.length > 0) {
            // ✅ Case 1: Dates exist, map them individually
            leave.dates.forEach((dateEntry: any) => {
              mappedEvents.push({
                id: dateEntry.id || `${leave.employee_Id}-${dateEntry.date}`,
                title: `Employee ${leave.employee_Id} (${leave.type})`,
                start: new Date(dateEntry.date),
                end: new Date(dateEntry.date),
                allDay: true,
                employeeId: leave.employee_Id || "Unknown",
                leaveType: leave.type || "Unknown",
                reason: leave.reason || "No reason provided",
                status: leave.status || "Pending",
              });
            });
          }
        });

        console.log("Mapped Events:", mappedEvents);
        setEvents(mappedEvents);
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };

    fetchLeaves();
  }, []);

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const eventStyleGetter = (event: Event) => {
    let backgroundColor = "#2F855A"; // Default green for Approved leaves
    let borderColor = "#22543D";

    if (event.status === "Pending") {
      backgroundColor = "#2D3748"; // Dark blue for Pending leaves
      borderColor = "#1A202C";
    } else if (event.status === "Rejected") {
      backgroundColor = "#C53030"; // Red for Rejected leaves
      borderColor = "#9B2C2C";
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        color: "#fff",
        borderRadius: "4px",
        padding: "5px",
      },
    };
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Details</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedEvent ? (
                <>
                  <p className="font-semibold">{selectedEvent.title}</p>
                  <p>{selectedEvent.leaveType} - {selectedEvent.status}</p>
                  <p>Reason: {selectedEvent.reason}</p>
                  <p>Date: {selectedEvent.start ? format(new Date(selectedEvent.start), "PPPP") : "N/A"}</p>
                </>
              ) : (
                "No event selected"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="h-screen p-4 bg-white shadow-md rounded-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Employee Leave Calendar</CardTitle>
            <Button variant="outline" onClick={() => navigate(-1)}>⬅ Back</Button>
          </div>
          <CardDescription>View employee leave requests on the calendar.</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectEvent={handleSelectEvent}
            style={{ height: 650 }}
            popup
            eventPropGetter={eventStyleGetter} // 🎨 Apply custom styling
          />
        </CardContent>
      </Card>
    </>
  );
};

export default LeaveCalendar;