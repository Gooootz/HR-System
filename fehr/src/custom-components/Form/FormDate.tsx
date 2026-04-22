import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormDateProps {
  name: string;
  placeholder: string;
  control: any;
  type?: string;
}
const FormDate = ({ name, placeholder, control }: FormDateProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="col-span-4">
          <FormLabel>{placeholder}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type="date"
              value={
                field.value
                  ? new Date(field.value).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => field.onChange(new Date(e.target.value))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormDate;
