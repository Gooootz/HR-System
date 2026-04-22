import { Card, CardContent } from "@/components/ui/card";
import PayrollSalaries from "./components/payroll-table";


const Payroll = () => {
    return (
        <div>
            <Card>
                <CardContent>
                    <PayrollSalaries />
                </CardContent>
            </Card>
        </div>
    );
};
// ayoko na mag code
export default Payroll;