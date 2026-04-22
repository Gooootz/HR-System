import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EmployeeTypeSelect = () => {
  return (
    <>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Employee Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Teaching">Teaching</SelectItem>
          <SelectItem value="Non-Teaching">Non-Teaching</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default EmployeeTypeSelect;
