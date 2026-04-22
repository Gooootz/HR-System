"use client";

import { Badge } from "@/components/ui/badge";
import { useStatusBadge } from "@/hooks/use-status";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DecodeJwt } from "@/utils/decode";

export type LeaveDetails = {
  id: string;
  employeeId: number;
  fullname: string;
  department: string;
  type: string;
  startDate: string;
  endDate: string;
  requestDate: string;
  reason: string;
  totalDays: string;
  status: string;
  position: string;
};

interface DecodedJWT {
  sub: string;
  email: string;
  sudo: string; // "true" or "false"
  firstName: string;
  role: string; // Single role ID
  [key: string]: any;
}

interface Role {
  id: string;
  roleName: string;
}

interface UserRoles {
  roles: string[];
  isAdmin: boolean;
  isSupervisor?: boolean; // Optional field added
}

const API_URL_DTR = "http://localhost:5018/";

const checkUserRole = async (): Promise<UserRoles | null> => {
  try {
    // 1. Decode the JWT
    const decoded: DecodedJWT | null = DecodeJwt();
    console.log('Decoded JWT:', decoded);

    if (!decoded) {
      console.error('No JWT found');
      return null;
    }

    // 2. Get role ID from JWT
    const roleId = decoded.role;
    if (!roleId) {
      console.error('No role ID found in JWT');
      return null;
    }

    // 3. Check sudo status from JWT (no API call needed)
    const isSudo = decoded.sudo === 'true';
    console.log('isSupervisor:', isSudo); // Log sudo status as isSupervisor

    // 4. Fetch role definitions from API
    const rolesEndpoint = 'https://odelroleapi.azurewebsites.net/api/role';
    const response = await axios.get<Role[]>(rolesEndpoint);
    const allRoles = response.data;

    // 5. Find the role name
    const foundRole = allRoles.find(role => role.id === roleId);
    if (!foundRole) {
      console.warn(`Role not found for ID: ${roleId}`);
      return null;
    }

    const roleName = foundRole.roleName;
    console.log('User role:', roleName);

    // 6. Determine access rights
    //note: roles are case-sensitive
    const isDeveloper = roleName === 'Developer';
    const isAlwaysAllowed = ['president', 'VicePresident', 'Dean', 'programchair', 'hr'].includes(roleName);

    // Access rules:
    // - Developers always have access
    // - President/VP/Dean always have access
    // - Any user with sudo=true has access
    const hasAccess = isDeveloper || isAlwaysAllowed || isSudo;

    return {
      roles: [roleName],
      isAdmin: hasAccess,
      isSupervisor: isSudo // Add supervisor status to return object
    };
  } catch (error) {
    console.error('Error checking user role:', error);
    return null;
  }
};

export const useLeaveRequests = () => {
  const [leaveDetailsData, setLeaveDetailsData] = useState<LeaveDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<UserRoles | null>(null);
  const [roleChecked, setRoleChecked] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const roles = await checkUserRole();
        setUserRoles(roles);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRoles(null);
      } finally {
        setRoleChecked(true);
      }
    };

    fetchUserRole();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);

      if (!userRoles?.isAdmin) {
        setLeaveDetailsData([]);
        return;
      }

      const response = await axios.get<LeaveDetails[]>(`${API_URL_DTR}api/leaverequests/get-leave-requests`);
      console.log("API Response:", response.data);

      const modifiedData = response.data.map((item: LeaveDetails) => ({
        ...item,
        fullname: "Mark Daniel Gutierrez",
        department: "CASEIT",
      }));

      let filteredEmployees = response.data;
      const primaryRole = userRoles.roles[0]?.toLowerCase(); // Use the first role for filtering

      if (primaryRole === "president") {
        filteredEmployees = response.data.filter(employee =>
          ["Vice President", "HR Manager", "Department Head"].includes(employee.position || "")
        );
      } else if (primaryRole === "vicepresident") {
        filteredEmployees = response.data.filter(employee =>
          ["Program Chair", "Guidance Counselor"].includes(employee.position || "")
        );
      } else if (primaryRole === "programchair") {
        filteredEmployees = response.data.filter(employee =>
          ["teacher"].includes(employee.position || "")
        );
      } else if (primaryRole === "hr") {
        filteredEmployees = response.data.filter(employee =>
          [
            "Registrar",
            "Librarian",
            "IT Staff",
            "Property Custodians",
            "Security",
            "finances",
            "mis",
            "accountant",
            "Principal Admin",
            "finances",
            "vpofinances",
            "registrar",
            "treasurer",
            "auditor",
          ].includes(employee.position || "")
        );
      }
      else if (primaryRole === "teacher") {
        filteredEmployees = response.data.filter(employee =>
          ["teacher"].includes(employee.position || "")
        );
      }
      else if (primaryRole === "accountant") {
        filteredEmployees = response.data.filter(employee =>
          ["accountant"].includes(employee.position || "")
        );
      }
      else if (primaryRole === "mis") {
        filteredEmployees = response.data.filter(employee =>
          ["accountant"].includes(employee.position || "")
        );
      }
      else if (primaryRole === "Principal Admin") {
        filteredEmployees = response.data.filter(employee =>
          ["Principal Admin"].includes(employee.position || "")
        );
      }
      else if (primaryRole === "vpofinance") {
        filteredEmployees = response.data.filter(employee =>
          ["finances"].includes(employee.position || "")
        );
      }
      else if (primaryRole === "finances") {
        filteredEmployees = response.data.filter(employee =>
          ["finances"].includes(employee.position || "")
        );
      }
      else if (primaryRole === "registrar") {
        filteredEmployees = response.data.filter(employee =>
          ["registrar"].includes(employee.position || "")
        );
      }
      else if (primaryRole === "treasurer") {
        filteredEmployees = response.data.filter(employee =>
          ["treasurer"].includes(employee.position || "")
        );
      }
      else if (primaryRole === "auditor") {
        filteredEmployees = response.data.filter(employee =>
          ["auditor"].includes(employee.position || "")
        );
      }
      else if (primaryRole === "developer") {
        filteredEmployees = response.data;
      } else {
        filteredEmployees = [];
      }

      setLeaveDetailsData(filteredEmployees);
    } catch (err) {
      console.error("Error fetching leave requests:", err);
      setError("Failed to fetch leave requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roleChecked) {
      fetchLeaveRequests();
    }
  }, [roleChecked, userRoles]);

  return { leaveDetailsData, loading, error };
};

// Status Cell Component
const LeaveStatusCell = ({ row }: { row: { original: LeaveDetails } }) => {
  const record = row.original;
  const badgeClass = useStatusBadge(record.status, "leaveStatus");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remarks, setRemarks] = useState("");

  const handleApprove = async () => {
    try {
      await axios.patch(
        `${API_URL_DTR}api/leaverequests/update-leave-status/${record.id}`,
        { status: "Approved" },
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Leave request approved successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Approval failed:", error);
      alert("Failed to approve leave request.");
    }
  };

  const handleDecline = async () => {
    if (!remarks.trim()) {
      alert("Remarks cannot be empty.");
      return;
    }

    try {
      await axios.patch(
        `${API_URL_DTR}api/leaverequests/update-status/${record.id}`,
        { status: "Rejected", remarks },
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Leave request declined successfully!");
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Decline failed:", error);
      alert("Failed to decline leave request.");
    }
  };

  const isApprovedOrRejected = record.status === "Approved" || record.status === "Rejected";

  // Convert start date to Date object
  const startDate = new Date(record.startDate);
  const today = new Date();

  // Check if the start date is today
  const isStartDateToday =
    startDate.getFullYear() === today.getFullYear() &&
    startDate.getMonth() === today.getMonth() &&
    startDate.getDate() === today.getDate();

  // Check if the start date is in the future
  const isFutureStartDate = startDate > today;

  // Check if the current time is within approval hours (7 AM - 6 PM)
  const isWithinApprovalHours = (() => {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 7 && hour < 18; // 7 AM to 6 PM
  })();

  // If approval time has passed and it's still pending, show "No action taken"
  const isApprovalPeriodOver = record.status === "Pending" && isStartDateToday && !isWithinApprovalHours;

  return (
    <div className="text-center">
      {/* Show the badge if Approved, Rejected, or Pending with today's start date */}
      {(isApprovedOrRejected || (record.status === "Pending" && isStartDateToday)) && (
        <Badge className={badgeClass}>{record.status}</Badge>
      )}

      {/* If Pending but approval period is over, show "No action taken" */}
      {isApprovalPeriodOver && <div className="text-gray-500 mt-2">No action taken</div>}

      {/* Show Approve/Decline buttons if:
          1. Pending AND
          2. (Start date is today AND within approval hours) OR (Start date is in the future) */}
      {record.status === "Pending" && ((isStartDateToday && isWithinApprovalHours) || isFutureStartDate) && (
        <>
          <Button variant="outline" size="sm" className="mr-2" onClick={handleApprove}>
            Approve
          </Button>

          <Button variant="destructive" size="sm" className="ml-2" onClick={() => setIsModalOpen(true)}>
            Decline
          </Button>

          {/* Decline Remarks Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Decline Leave Request</DialogTitle>
              </DialogHeader>

              <Textarea
                placeholder="Enter remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDecline}>
                  Confirm Decline
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

// Columns Definition
export const columns: ColumnDef<LeaveDetails>[] = [
  { accessorKey: "employeeId", header: "Employee ID" },
  { accessorKey: "fullname", header: "Full Name" },
  { accessorKey: "department", header: "Department" },
  { accessorKey: "position", header: "Position" },
  { accessorKey: "requestDate", header: "Request Date" },
  { accessorKey: "startDate", header: "Start Date" },
  { accessorKey: "endDate", header: "End Date" },
  { accessorKey: "type", header: "Leave Type" },
  { accessorKey: "reason", header: "Reason" },
  {
    accessorKey: "status",
    header: "Status",
    cell: LeaveStatusCell, // Use the new component
  },
];