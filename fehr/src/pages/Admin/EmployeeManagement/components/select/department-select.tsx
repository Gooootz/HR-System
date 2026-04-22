import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DepartmentSelect = () => {
  return (
    <>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="CASEIT">CASEIT</SelectItem>
          <SelectItem value="SMS">SMS</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default DepartmentSelect;
