import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EmploymentSelect = () => {
  return (
    <>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Fulltime">Full Time</SelectItem>
          <SelectItem value="Parttime">Part-Time/Contractual</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default EmploymentSelect;
