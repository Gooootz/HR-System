import { Card, CardContent, CardHeader } from "@/components/ui/card";
import QuickAccess from "./components/quick-access";
import ChartComponent from "./components/Chart";
import Summary from "./components/Summary";

const AdminDashboard = () => {
  return (
    <div>
      <Summary /> {/*summary*/}
      <div className="grid grid-cols-6 gap-4">
        <Card className="col-span-3 h-[30rem]  overflow-auto">
          <CardHeader>Quick Access</CardHeader>
          <CardContent>
            <QuickAccess />
          </CardContent>
        </Card>
        <Card className="col-span-3 h-[30rem] ">
          <CardHeader>Employee Overview</CardHeader>
          <ChartComponent />
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
