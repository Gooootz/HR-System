import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { applicantsData } from "./data";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Offer Extended":
      return "bg-blue-200 text-blue-800 hover:bg-gray-200 hover:text-gray-700";
    case "Interview Scheduled":
      return "bg-green-200 text-green-800 hover:bg-gray-200 hover:text-gray-700";
    case "Pending":
      return "bg-orange-200 text-orange-800 hover:bg-gray-200 hover:text-gray-700";
    case "Rejected":
      return "bg-red-200 text-red-800 hover:bg-gray-200 hover:text-gray-700";
    default:
      return "bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-700";
  }
};

const ApplicantTracking = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Card>
        <CardHeader className="text-lg font-bold">
          <CardTitle>Applicants</CardTitle>
          <CardDescription>
            List of all applicants and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {applicantsData.map((applicant) => (
              <Card
                key={applicant.id}
                className="p-4 border border-gray-200 shadow-md "
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="text-xl font-semibold">
                      {applicant.fullname}
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className=" h-7 bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                      onClick={() =>
                        navigate(`/admin/applicant-info/${applicant.id}`)
                      }
                    >
                      View
                    </Button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {applicant.jobTitle}
                </div>

                <div className="mt-1 text-sm text-gray-500">
                  {applicant.email}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {applicant.phoneNo}
                </div>

                <div className="mt-2">
                  <Badge
                    className={`px-3 py-1 rounded-full ${getStatusColor(
                      applicant.status
                    )}`}
                  >
                    {applicant.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicantTracking;
