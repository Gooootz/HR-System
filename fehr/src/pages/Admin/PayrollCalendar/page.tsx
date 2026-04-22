import { Card, CardContent } from "@/components/ui/card";
import PayrollCalendar from "./components/payroll-calendar";


const PayrollCalendarPage = () => {
    return (
        <div>
            <Card>
                <CardContent>
                    <PayrollCalendar />
                </CardContent>
            </Card>
        </div>
    );
};

export default PayrollCalendarPage;