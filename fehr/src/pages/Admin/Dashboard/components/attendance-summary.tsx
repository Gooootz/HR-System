import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttendanceSummaryProps {
  present: number;
  absent: number;
  late: number;
}

const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({
  present,
  absent,
  late,
}) => {
  return (
    <div className="grid grid-cols-3 w-full justify-center items-center gap-4">
      <Card className="shadow-sm rounded-md border border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600 text-sm font-semibold uppercase">
            Present
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-3xl font-semibold text-green-600">
          {present}
        </CardContent>
      </Card>
      <Card className="shadow-sm rounded-md border border-red-200 bg-red-50">
        <CardHeader className="text-center">
          <CardTitle className="text-red-500 text-sm font-semibold uppercase">
            Absent
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-3xl font-semibold text-red-500">
          {absent}
        </CardContent>
      </Card>
      <Card className="shadow-sm rounded-md border border-yellow-200 bg-yellow-50">
        <CardHeader className="text-center">
          <CardTitle className="text-yellow-600 text-sm font-semibold uppercase">
            Late
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-3xl font-semibold text-yellow-600">
          {late}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceSummary;
