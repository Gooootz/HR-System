import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FormSelectProps {
  name: string;
  placeholder: string;
  control: any;
  options?: any[];
  className?: string;
}
const FormSelect = ({
  name,
  placeholder,
  control,
  className,
  options,
}: FormSelectProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <FormLabel>{placeholder}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <FormControl>
                <SelectValue placeholder={`Select ${placeholder}`} />
              </FormControl>
            </SelectTrigger>
            <SelectContent>
              {options &&
                options.map((item, index) => (
                  <SelectItem key={index} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default FormSelect;
