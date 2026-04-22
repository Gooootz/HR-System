import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface TimeInProps {
  ontime: number;
  late: number;
  early: number;
  notime: number;
}

const TimeInSummary = ({ ontime, late, early, notime }: TimeInProps) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card className="rounded-md shadow-sm">
        <CardHeader>On Time</CardHeader>
        <CardContent>
          <Label className="text-3xl text-[#d7d764]">{ontime}</Label>
        </CardContent>
      </Card>
      <Card className="rounded-md shadow-sm">
        <CardHeader>Late Time In</CardHeader>
        <CardContent>
          <Label className="text-3xl text-[#d7d764]">{late}</Label>
        </CardContent>
      </Card>
      <Card className="rounded-md shadow-sm">
        <CardHeader>Early Time In</CardHeader>
        <CardContent>
          <Label className="text-3xl text-[#d7d764]">{early}</Label>
        </CardContent>
      </Card>
      <Card className="rounded-md shadow-sm">
        <CardHeader>No Time In</CardHeader>
        <CardContent>
          <Label className="text-3xl text-[#d7d764]">{notime}</Label>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeInSummary;
