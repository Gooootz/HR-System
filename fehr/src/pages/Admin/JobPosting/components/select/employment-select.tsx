import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FC } from "react";

interface EmploymentSelectProps {
  onChange: (value: string) => void;
}

const EmploymentSelect: FC<EmploymentSelectProps> = ({ onChange }) => {
  return (
    <>
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Employment Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Full-Time">Full-Time</SelectItem>
          <SelectItem value="Part-Time">Part-Time</SelectItem>
          <SelectItem value="Contractual">Contractual</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default EmploymentSelect;
