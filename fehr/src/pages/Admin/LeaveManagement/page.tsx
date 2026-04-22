import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarFoldIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/custom-components/DataTable";
import { columns } from "./components/table/leave-cols";
import { useLeaveRequests } from "./components/table/leave-cols"; // Import the hook

const LeaveManagement = () => {
  const navigate = useNavigate();
  const { leaveDetailsData, loading, error } = useLeaveRequests(); // Fetch data

  return (
    <Card className="shadow-md rounded-md">
      <CardHeader>
        <CardTitle>Employee Leave Requests</CardTitle>
        <CardDescription>Review, approve, or decline employee leave applications.
          Pending requests will automatically expire if no action is taken by 6 PM on the start date.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div className="space-x-2">
            <Button variant="outline">Export CSV</Button>
            <Button variant="outline">Generate Report</Button>
          </div>
          <Button onClick={() => navigate("/admin/leave-calendar")}>
            <CalendarFoldIcon size={14} className="mr-1" />
            View Calendar
          </Button>
        </div>

        {/* Handle loading and errors */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <DataTable columns={columns} data={leaveDetailsData} />
        )}
      </CardContent>
    </Card>
  );
};

export default LeaveManagement;
