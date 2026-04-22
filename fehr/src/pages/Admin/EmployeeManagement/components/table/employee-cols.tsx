"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

export type Employee = {
  id: string;
  employeeId: string;
  fullname: string;
  jobTitle: string;
  office: string;
  department: string;
  status: string;
  email: string;
  phoneNo: string;
  avatar: string;
};

export const employeeColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },
  {
    accessorKey: "fullname",
    header: "Full Name",
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
  },
  {
    accessorKey: "office",
    header: "Office",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "phoneNo",
    header: "Phone",
  },
  {
    accessorKey: "isPosted",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return status === "Active" ? (
        <Badge className="border border-green-200 bg-green-100 text-green-700 hover:bg-green-200">
          Active
        </Badge>
      ) : (
        <div>
          <Badge className="border border-orange-200 bg-orange-100 text-orange-700 hover:bg-orange-200">
            On Leave
          </Badge>
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: () => <Button variant="outline">View</Button>,
  },
];
