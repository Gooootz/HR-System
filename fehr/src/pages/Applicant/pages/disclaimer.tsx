import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { RegistrationTermsAndCondition } from "./registration-terms-and-conditions";
import { useAtomValue } from "jotai";
import { acceptRegistrationTermsAndConditionAtom } from "../atom";

const Disclaimer = () => {
  const navigate = useNavigate();
  const registrationTermsAndCondition = useAtomValue(
    acceptRegistrationTermsAndConditionAtom
  );
  const handleStart = () => {
    navigate("/application/personal-information");
  };
  
  return (
    <>
      <Card className="w-[140vh] h-[78vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="uppercase text-primary">
            <div className="flex items-center justify-center gap-2">
              <img src="/AC_LOGO.png" alt="LOGO" width={100} />
            </div>
            Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <h5 className="font-bold uppercase text-primary">
            DATA PRIVACY AND PROTECTION CONSENT
          </h5>
          <p className="text-justify">
            Aldersgate College shall protect the data that you provided in
            compliance with the Data Privacy Law of 2012 and its implementing
            rules and regulations. The school shall take appropriate
            organizational measures to protect your data against unauthorized
            disclosure or unauthorized access, including those that may be
            classified as personal information and/or sensitive personal
            information unless you voluntarily choose to give your consent
            thereto or unless such disclosure is required by applicable laws and
            regulations. Furthermore, you are given the right to object to
            illegal processing of your data, the right to access your data, the
            right to correct any inaccurate data, and the right to erasure and
            blocking of data.
          </p>
          <br />
          <p className="text-justify">
            <strong className="uppercase text-primary">
              You have the right to:
            </strong>
          </p>
          <ul className="text-justify">
            <li>1. Object to illegal processing of your data</li>
            <li>2. Access your data</li>
            <li>3. Correct any inaccuracies in your data</li>
            <li>4. Request the erasure or blocking of your data</li>
          </ul>
          <br />
          <p className="text-justify">
            By clicking the <strong className="text-primary">NEXT</strong>{" "}
            button, you confirm that you freely and voluntarily give consent to
            the collection of your data, which may include personal information
            and/or sensitive information set out in this form, including other
            documents that will be required of you to submit for admission
            purposes.
          </p>
          <br />
          <p className="text-justify">
            <span className="text-red-600 font-bold uppercase">
              Please Note
            </span>
            : <br />
                Ensure that all your required documents are uploaded as clear images (
            <span style={{ color: "black", fontWeight: "bold" }}>
              Each image must be below 200kb in size
            </span>
            ). This helps us process your application efficiently.
          </p>
          <br />
        </CardContent>
        <CardFooter className="justify-between w-full">
          <RegistrationTermsAndCondition />
          <Button
            onClick={handleStart}
            disabled={!registrationTermsAndCondition}
            size={"sm"}
            className="w-[100px]"
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default Disclaimer;