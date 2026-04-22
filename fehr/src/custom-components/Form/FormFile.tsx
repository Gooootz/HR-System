import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

interface FormFileProps {
  name: string;
  placeholder: string;
  form: UseFormReturn<any>;
  fileRef: any;
  accept?: string;
  className?: string;
}
const FormFile = ({
  name,
  placeholder,
  form,
  fileRef,
  accept,
  className,
}: FormFileProps) => {
  return (
    <FormField
      name={name}
      control={form.control}
      render={() => (
        <FormItem className={cn(className)}>
          <FormLabel>{placeholder}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type="file"
              accept={accept ? accept : "*"}
              {...fileRef}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default FormFile;
