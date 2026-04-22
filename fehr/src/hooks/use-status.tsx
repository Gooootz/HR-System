import { cn } from "@/lib/utils";
export function useStatusBadge(
  status: string,
  category: "attendance" | "onboarding" | "applicant" | "leaveStatus"
) {
  const statusStyles: Record<string, Record<string, string>> = {
    attendance: {
      Present:
        "bg-green-200 text-green-800 hover:bg-gray-200 hover:text-gray-700",
      Absent: "bg-red-200 text-red-800 hover:bg-gray-200 hover:text-gray-700",
      Late: "bg-orange-200 text-orange-800 hover:bg-gray-200 hover:text-gray-700",
      Pending:
        "bg-yellow-200 text-yellow-800 hover:bg-gray-200 hover:text-gray-700",
    },
    onboarding: {
      Completed:
        "bg-green-200 text-green-800 hover:bg-gray-200 hover:text-gray-700",
      InProgress:
        "bg-blue-200 text-blue-800 hover:bg-gray-200 hover:text-gray-700",
      Pending:
        "bg-yellow-200 text-yellow-800 hover:bg-yellow-200 hover:text-gray-700",
      Rejected: "bg-red-200 text-red-800 hover:bg-gray-200 hover:text-gray-700",
    },
    applicant: {
      Approved:
        "bg-blue-200 text-blue-800 hover:bg-gray-200 hover:text-gray-700",
      Conditional:
        "bg-yellow-200 text-yellow-800 hover:bg-gray-200 hover:text-gray-700",
      Rejected: "bg-red-200 text-red-800 hover:bg-gray-200 hover:text-gray-700",
      Interview:
        "bg-blue-200 text-blue-800 hover:bg-gray-200 hover:text-gray-700",
    },
    leaveStatus: {
      Approved:
        "bg-green-200 text-green-800 hover:bg-gray-200 hover:text-gray-700",
      Pending:
        "bg-yellow-200 text-yellow-800 hover:bg-gray-200 hover:text-gray-700",
      Rejected: "bg-red-200 text-red-800 hover:bg-gray-200 hover:text-gray-700",
    },
  };

  return cn(
    statusStyles[category]?.[status] ||
      "bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-700"
  );
}
