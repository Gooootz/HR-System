import { Checkbox } from "@/components/ui/checkbox"; 
import { useAtom } from "jotai"; 
import { acceptRegistrationTermsAndConditionAtom } from "../atom"; 

export function RegistrationTermsAndCondition() { 
  const [isChecked, setIsChecked] = useAtom(acceptRegistrationTermsAndConditionAtom);

  return (
    <div className="flex space-x-2 items-top">
      <Checkbox
        id="terms1"
        checked={isChecked}
        onCheckedChange={(checked: boolean) => setIsChecked(checked)}
      />
      <div className="grid gap-1.5 leading-none">
        <label htmlFor="terms1" className="text-sm font-medium leading-none">
          Accept terms and conditions
        </label>
        <p className="text-sm text-muted-foreground">
          I agree to share my personal data through the process.
        </p>
      </div>
    </div>
  ); 
}
