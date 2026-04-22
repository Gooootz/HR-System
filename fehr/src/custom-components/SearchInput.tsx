import React from "react";
import { Input } from "@/components/ui/input";

type SearchInputProps = {
  columnKey: string;
  table: any;
  placeholder?: string;
  className?: string;
};

const SearchInput: React.FC<SearchInputProps> = ({
  columnKey,
  table,
  placeholder,
  className,
}) => {
  return (
    <Input
      placeholder={placeholder}
      value={(table.getColumn(columnKey)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(columnKey)?.setFilterValue(event.target.value)
      }
      className={
        className ??
        "h-8 w-full text-sm rounded-md bg-background pl-8 md:w-[200px] lg:w-[278px]"
      }
    />
  );
};

export default SearchInput;
