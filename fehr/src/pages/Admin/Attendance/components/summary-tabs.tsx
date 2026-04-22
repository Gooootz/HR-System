import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimeInSummary from "./summary";

export function SummaryTabs() {
  return (
    <Tabs defaultValue="account">
      <div className="flex justify-start">
        <TabsList className="grid grid-cols-2 w-[350px]">
          <TabsTrigger value="account">Time In Summary</TabsTrigger>
          <TabsTrigger value="password">Time Out Summary</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="account">
        <TimeInSummary ontime={1} late={2} early={3} notime={5} />
      </TabsContent>
      <TabsContent value="password">
        <TimeInSummary ontime={1} late={2} early={3} notime={5} />
      </TabsContent>
    </Tabs>
  );
}
