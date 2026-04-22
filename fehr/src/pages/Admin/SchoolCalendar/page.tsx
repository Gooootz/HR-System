import { Card, CardContent } from "@/components/ui/card";
import SchoolCalendar from "./components/SchoolCalendar";


const SchoolCalendarPage = () => {
  return (
    <div>
        <Card>
            <CardContent>
                <SchoolCalendar />
            </CardContent>
        </Card>
    </div>
  );
};

export default SchoolCalendarPage;