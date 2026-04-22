import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FC } from "react";

interface EmployeeSelectProps {
  onChange: (value: string) => void;
}

const EmployeeSelect: FC<EmployeeSelectProps> = ({ onChange }) => {
  return (
    <>
      <Select onValueChange={onChange}>
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

export default EmployeeSelect;
