import React from "react";
import { useLocation } from "react-router-dom";
import { Avatar } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { Label } from "@/components/ui/label";
import Logout from "@/auth.ext/Logout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DecodeJwt } from "@/utils/decode";
import axios from "axios";

interface NavbarProps {
  onLogout: () => void;
}

const decode = DecodeJwt();

const checkUserRole = async () => {
  try {
    // 1. Decode the JWT
    const decoded = DecodeJwt();
    console.log('Decoded JWT:', decoded);

    // 2. Extract role ID from token
    const roleId = decoded?.role;
    if (!roleId) {
      console.error('No role ID found in JWT');
      return;
    }

    // 3. Fetch roles from API
    const rolesEndpoint = 'https://odelroleapi.azurewebsites.net/api/role';
    const response = await axios.get(rolesEndpoint);
    const roles = response.data;

    // 4. Find matching role
    const userRole = roles.find((role: any) => role.id === roleId);

    if (userRole) {
      console.log('User role:', userRole.roleName);
      return userRole.roleName;
    } else {
      console.log('Role not found for ID:', roleId);
      return null;
    }
  } catch (error) {
    console.error('Error checking user role:', error);
    return null;
  }
};
// Usage example
const userRole = await checkUserRole();
console.log('Final role:', userRole);


const Navbar: React.FC<NavbarProps> = ({ }) => {
  const location = useLocation();

  const getPageTitle = (pathname: any) => {
    switch (pathname) {
      case "/admin/dashboard":
        return "Dashboard";
      case "/admin/employee-management":
        return "Employee Management";
      case "/admin/create-employee/personal-information":
      case "/admin/create-employee/educational-background":
      case "/admin/create-employee/eligibilities":
      case "/admin/create-employee/employee-documents":
        return "Create Employee";
      case "/admin/employee-attendance":
        return "Employee Attendance";
      case "/admin/attendance-monitoring":
        return "Attendance Monitoring";
      case "/admin/leave-management":
      case "/admin/leave-calendar":
        return "Leave Management";
      case "/admin/onboarding":
        return "Employee Onboarding";
      case "/admin/applicant-tracking":
        return "Applicant Tracking";
      case "/admin/applicant-info/":
        return "Applicant Information";
      case "/admin/daily-time-records":
        return "Daily Time Records";
      case "/admin/job-posting":
        return "Job Posting";
      case "/admin/dtr-management":
        return "DTR Management";
      case "/admin/school-calendar":
        return "School Calendar";
      case "/admin/payroll-calendar":
        return "Payroll Calendar";
      case "/admin/payroll":
        return "Payroll";
      case "/admin/matrix":
        return "Matrix";
    }
  };

  return (
    <nav className="sticky top-0 bg-white w-full">
      <div className="flex items-center justify-between h-12 px-3 border-b border-gray-300">
        <div className="flex items-center justify-start space-x-1">
          <div>
            <SidebarTrigger />
          </div>
          <div className="relative ml-3  md:ml-auto md:grow-0">
            <Label className="font-semibold text-gray-600">
              {getPageTitle(`${location.pathname}`)}
            </Label>
          </div>
        </div>
        <div className="flex items-center">
          <Label className="pr-2">Good Day, {userRole} : {decode?.firstName}</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 overflow-hidden rounded-full border-2 border-gray-800"
              >
                <Avatar className="hover:cursor-pointer">
                  <User className="h-5 w-5 text-gray-800" />
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={Logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
