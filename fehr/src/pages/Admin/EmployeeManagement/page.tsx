import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateButton from "./components/button/create-button";
import DepartmentSelect from "./components/select/department-select";
import EmployeeSelect from "./components/select/employee-select";
import { DataTable } from "@/custom-components/DataTable";
import { employeeColumns } from "./components/table/employee-cols";
import { LayoutGridIcon, LayoutListIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getEmployees } from "./components/table/data";
import { ToggleGroup, ToggleGroupItem } from "@/components/toggle-group";
import { Employee } from "./components/table/employee-cols";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Onboarding":
      return "bg-blue-200 text-blue-800 hover:bg-gray-200 hover:text-gray-700";
    case "Active":
      return "bg-green-200 text-green-800 hover:bg-gray-200 hover:text-gray-700";
    case "On Leave":
      return "bg-yellow-200 text-yellow-800 hover:bg-gray-200 hover:text-gray-700";
    default:
      return "bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-700";
  }
};

const viewVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const EmployeeManagement = () => {
  const [view, setView] = useState("table");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
          <CardDescription>
            Manage and track employee information and other relevant data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading employees...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employees</CardTitle>
        <CardDescription>
          Manage and track employee information and other relevant data
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <EmployeeSelect />
            <DepartmentSelect />
          </div>
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(val) => val && setView(val)}
              className="flex bg-gray-100 rounded-lg"
            >
              <ToggleGroupItem value="table" className="p-2 rounded-md">
                <LayoutListIcon className="w-5 h-5 text-gray-700" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" className="p-2 rounded-md">
                <LayoutGridIcon className="w-5 h-5 text-gray-700" />
              </ToggleGroupItem>
            </ToggleGroup>
            <CreateButton />
          </div>
        </div>
        <AnimatePresence mode="wait">
          {view === "grid" ? (
            <motion.div
              key="grid"
              variants={viewVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-4"
            >
              {employees.map((emp) => (
                <Card
                  key={emp.id}
                  className="relative p-4 flex flex-col items-center shadow-md"
                >
                  <Badge
                    className={`absolute top-2 right-2 px-3 py-1 rounded-full ${getStatusColor(
                      emp.status
                    )}`}
                  >
                    {emp.status}
                  </Badge>
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={emp.avatar} />
                    <AvatarFallback>{emp.fullname[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-lg font-semibold mt-2">
                    {emp.fullname}
                  </div>
                  <div className="text-md text-gray-600">{emp.employeeId}</div>
                  <div className="text-sm">{emp.jobTitle}</div>
                  <div className="text-sm text-gray-600">{emp.department}</div>
                  <div className="py-2">
                    <Button className="bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200">
                      View / Edit
                    </Button>
                  </div>
                </Card>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="table"
              variants={viewVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DataTable columns={employeeColumns} data={employees} />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default EmployeeManagement;
