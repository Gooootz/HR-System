import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";

interface FormInputProps {
  name: string;
  placeholder?: string;
  type?: string;
  control: Control<any>;
  className?: string;
  noLabel?: boolean;
  required?: boolean;
}
const FormInput = ({
  name,
  placeholder,
  type,
  control,
  className,
  noLabel,
  required,
}: FormInputProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          {!noLabel && <FormLabel>{placeholder}</FormLabel>}
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type ?? "text"}
              required={required}
              {...field}
            />
          </FormControl>
          {/* <FormMessage /> */}
        </FormItem>
      )}
    />
  );
};
export default FormInput;
