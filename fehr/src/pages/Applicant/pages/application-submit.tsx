import { Button } from "@/components/ui/button";

const ApplicationSubmitted = () => {

  return (
    <>
      <h1 className="text-5xl text-white font-extrabold font-heading mb-4 uppercase whitespace-nowrap">
        Your Application is In!
      </h1>
      <p className="mb-8 text-2xl text-white text-center">
        Thank you for your interest in joining our team! Your application for
        the selected job vacancy has been successfully submitted. Our
        recruitment team is currently reviewing your application, and we will
        get back to you soon with updates.
      </p>
      <Button
        size={"lg"}
        className="text-md bg-yellow-400 hover:bg-yellow-700 rounded-full text-white font-semibold transition-colors duration-300"
      >
        Return Home
      </Button>
    </>
  );
};

export default ApplicationSubmitted;
