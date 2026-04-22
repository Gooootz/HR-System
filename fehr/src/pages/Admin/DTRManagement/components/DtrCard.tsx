import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Modal from "../components/Modal";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import { DecodeJwt } from "@/utils/decode";

const API_URL_ATTENDANCE = "https://odeldevhrapi.azurewebsites.net/";
const API_URL_DTR = "http://localhost:5018/";

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

interface EmployeeFormData {
  employeeId: string;
  name?: string;
  date: string;
  timeinam?: string;
  timeoutam?: string;
  timeinpm?: string;
  timeoutpm?: string;
  type: string;
  reason?: string;
  id: string;
  status?: string;
  remarks?: string;
  position?: string;
}

interface EmployeeDetails {
  employeeName: string;
  department: string;
}

export const fetchEmployeeDetails = async (employeeId: string): Promise<EmployeeDetails> => {
  try {
    const response = await axios.get<EmployeeDetails>(`${API_URL_ATTENDANCE}api/employeedata/${employeeId}`);
    return {
      employeeName: response.data?.employeeName ?? "Unknown",
      department: response.data?.department ?? "Unknown",
    };
  } catch (error) {
    console.error(`Error fetching employee details for ID ${employeeId}:`, error);
    return { employeeName: "Unknown", department: "Unknown" };
  }
};

const formatTimeTo12Hour = (time: string | undefined): string => {
  if (!time) return "N/A";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const isWithinApprovalHours = (): boolean => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 7 && hour < 18;
};

const formatDateYYYYMMDD = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

interface DtrCardProps {
  employeeRecords: EmployeeFormData[];
  refreshData: () => void;
}

const DtrCard = ({ employeeRecords, refreshData }: DtrCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState("Unknown");
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentTime] = useState(new Date());

  const employee = employeeRecords[0];

  useEffect(() => {
    const fetchEmployeeName = async () => {
      const details = await fetchEmployeeDetails(employee.employeeId);
      setEmployeeName(details.employeeName);
    };

    fetchEmployeeName();
  }, [employee.employeeId]);

  const handleApprove = async (recordId: string) => {
    try {
      const payload = { status: "Approved" };
      await axios.patch(`${API_URL_DTR}api/requests/update-request-status/${recordId}`, payload);
      setToastMessage("Record approved successfully");
      refreshData();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error approving record ${recordId}:`, axiosError.response?.data || axiosError.message);
      setToastMessage("Error approving record");
    }
  };

  const handleReject = async (remarks: string) => {
    if (!selectedRecordId) return;

    try {
      const payload = {
        status: "Rejected",
        remarks
      };
      await axios.patch(
        `${API_URL_DTR}api/requests/update-request-status/${selectedRecordId}`,
        payload
      );
      setIsModalOpen(false);
      setToastMessage("Record rejected successfully");
      refreshData();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        `Error rejecting record ${selectedRecordId}:`,
        axiosError.response?.data || axiosError.message
      );
      setToastMessage("Error rejecting record");
    }
  };

  const formatDateToLongString = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const groupedByDate = employeeRecords.reduce((acc, record) => {
    const formattedDate = formatDateToLongString(record.date);
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(record);
    return acc;
  }, {} as Record<string, EmployeeFormData[]>);

  const withinApprovalHours = isWithinApprovalHours();
  const currentDateFormatted = formatDateYYYYMMDD(currentTime);

  return (
    <Card className="w-full mx-auto p-4 cursor-pointer shadow-md">
      <div
        className="flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col">
          {/* <h2 className="text-lg pl-8 font-semibold">{employeeName}</h2>
          <span className="text-sm pl-8 text-gray-500">{employee.employeeId}</span> */}
          <h2 className="text-lg pl-8 font-semibold">Mark Daniel Gutierrez</h2>
          <span className="text-sm pl-8 text-gray-500">18-10136</span>
        </div>
        <Button variant="ghost" size="sm">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
      </div>

      {isExpanded && (
        <CardContent className="mt-2">
          {Object.entries(groupedByDate).map(([date, records]) => {
            const recordDate = new Date(date);
            const isPastDate = recordDate < new Date(currentDateFormatted);
            const isTodayOutsideHours = date === currentDateFormatted && !withinApprovalHours;
            const disableApproval = isPastDate || isTodayOutsideHours;

            return (
              <div key={date} className="mb-4">
                <h3 className="text-md font-semibold mb-2">{date}</h3>
                <div className="overflow-x-auto">
                  <Table className="border border-gray-300 w-full table-fixed">
                    <TableHeader>
                      <TableRow className="border border-gray-300 bg-gray-100">
                        <TableHead className="w-[50px] text-center border border-gray-300">No.</TableHead>
                        <TableHead className="w-[100px] text-center border border-gray-300">Type</TableHead>
                        <TableHead className="w-[250px] text-center border border-gray-300">Reason</TableHead>
                        <TableHead className="w-[100px] text-center border border-gray-300">Position</TableHead>
                        <TableHead className="w-[100px] text-center border border-gray-300">AM In</TableHead>
                        <TableHead className="w-[100px] text-center border border-gray-300">AM Out</TableHead>
                        <TableHead className="w-[100px] text-center border border-gray-300">PM In</TableHead>
                        <TableHead className="w-[100px] text-center border border-gray-300">PM Out</TableHead>
                        <TableHead className="w-[120px] text-center border border-gray-300">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((record, index) => {
                        const isApprovedOrRejected = record.status === "Approved" || record.status === "Rejected";
                        return (
                          <TableRow key={record.id}>
                            <TableCell className="w-[50px] text-center border border-gray-300">{index + 1}</TableCell>
                            <TableCell className="w-[100px] text-center border border-gray-300">{record.type}</TableCell>
                            <TableCell className="w-[200px] text-center border border-gray-300 truncate" title={record.reason || "N/A"}>
                              {record.reason || "N/A"}
                            </TableCell>
                            <TableCell className="w-[150px] text-center border border-gray-300 truncate" title={record.position || "N/A"}>
                              {record.position || "N/A"}
                            </TableCell>
                            <TableCell className="w-[100px] text-center border border-gray-300">{formatTimeTo12Hour(record.timeinam)}</TableCell>
                            <TableCell className="w-[100px] text-center border border-gray-300">{formatTimeTo12Hour(record.timeoutam)}</TableCell>
                            <TableCell className="w-[100px] text-center border border-gray-300">{formatTimeTo12Hour(record.timeinpm)}</TableCell>
                            <TableCell className="w-[100px] text-center border border-gray-300">{formatTimeTo12Hour(record.timeoutpm)}</TableCell>
                            <TableCell className="w-[200px] text-center border border-gray-300">
                              {isPastDate && record.status === "Pending" ? (
                                <span>Request Past Date. Rejected</span>
                              ) : isTodayOutsideHours && record.status === "Pending" ? (
                                <span>Outside approval hours (7 AM - 6 PM)</span>
                              ) : record.status && record.status !== "Pending" ? (
                                <span>{record.status}</span>
                              ) : (
                                <div className="flex justify-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={disableApproval || isApprovedOrRejected}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleApprove(record.id);
                                    }}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={isApprovedOrRejected}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedRecordId(record.id);
                                      setIsModalOpen(true);
                                    }}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            );
          })}
        </CardContent>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleReject}
        title="Reject Record"
        label="Remarks"
      />
      {toastMessage && (
        <Toast>
          <ToastTitle>{toastMessage}</ToastTitle>
          <ToastDescription>
            <Button onClick={() => setToastMessage(null)}>Close</Button>
          </ToastDescription>
        </Toast>
      )}
    </Card>
  );
};

const DtrCardList = () => {
  const [employees, setEmployees] = useState<EmployeeFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const fetchRequests = async () => {
    try {
      setLoading(true);

      // // Get decoded JWT
      // const decoded = DecodeJwt();
      // if (!decoded) {
      //   setEmployees([]);
      //   return;
      // }

      // // Check if user has permission to proceed
      // const isSudo = decoded.sudo === 'true';
      // const isAllowedRole = ['Developer', 'president', 'VicePresident', 'Dean', 'ProgramChair']
      //   .some(role => userRoles?.roles.includes(role));

      // Only proceed if user is sudo or Developer
      if (!userRoles?.isAdmin) {
        setEmployees([]);
        return;
      }

      const response = await axios.get<EmployeeFormData[]>(`${API_URL_DTR}api/requests/get-request-records`);

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

      setEmployees(filteredEmployees);
      setError("");
    } catch (error) {
      setError("Error fetching data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roleChecked && userRoles) {
      fetchRequests();
    }
  }, [userRoles, roleChecked]);

  if (!roleChecked) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const decoded = DecodeJwt();

  if (!decoded) {
    return <div className="flex justify-center items-center h-screen">Please Log In</div>;
  }

  // Check access after confirming we have both decoded JWT and userRoles
  const hasAccess = (() => {
    // Sudo users always have access
    if (decoded.sudo === 'true') return true;

    // If we don't have userRoles yet, we can't determine access
    if (!userRoles) return false;

    // Check allowed roles (case-insensitive)
    const allowedRoles = ["developer", "president", "vicepresident", "dean", "vpofinance", "programchair"];
    return userRoles.roles.some(role =>
      allowedRoles.includes(role.toLowerCase())
    );
  })();

  if (!userRoles) {
    // This handles the case where checkUserRole failed after successful JWT decode
    return <div className="flex justify-center items-center h-screen">Your account doesn't have sufficient privileges.</div>;
  }

  if (!hasAccess) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600">
            {decoded.sudo === 'false'
              ? "Your account doesn't have sufficient privileges."
              : "You don't have permission to view attendance requests."}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading data...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  const groupedEmployees = employees.reduce((acc, employee) => {
    // Handle cases where employeeId might be missing or empty
    const empId = employee.employeeId || 'unknown';

    // if (!empId) {
    //   console.warn("Missing employeeId in:", employee);
    //   return acc;
    // }

    // Normalize the ID by converting to string and trimming
    const normalizedEmpId = String(empId).trim() || 'unknown';

    // Initialize the array if it doesn't exist
    if (!acc[normalizedEmpId]) {
      acc[normalizedEmpId] = [];
    }

    acc[normalizedEmpId].push(employee);
    return acc;
  }, {} as Record<string, EmployeeFormData[]>);

  return (
    <ToastProvider>
      <div className="flex flex-col items-center gap-6 p-4">
        {Object.entries(groupedEmployees).map(([employeeId, employeeRecords]) => (
          <DtrCard
            key={employeeId}
            employeeRecords={employeeRecords}
            refreshData={fetchRequests}
          />
        ))}
      </div>
      <ToastViewport />
    </ToastProvider>
  );
};

export default DtrCardList;