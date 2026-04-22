import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ApplicantEvaluationDialog() {
  const [evaluationStatus, setEvaluationStatus] = useState<string | null>(null);
  const [evaluationText, setEvaluationText] = useState("");
  const [schedule, setSchedule] = useState("");
  const [missingRequirements, setMissingRequirements] = useState("");

  const handleSubmit = () => {
    if (evaluationStatus === "approved") {
      console.log(`Approved: Schedule - ${schedule}`);
      // Send email with schedule details
    } else if (evaluationStatus === "conditional") {
      console.log(`Conditional: Missing - ${missingRequirements}`);
      // Send email about missing requirements
    } else if (evaluationStatus === "rejected") {
      console.log("Rejected: Archiving application...");
      // Send rejection email and archive the application
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Evaluate Applicant</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Applicant Evaluation</DialogTitle>
          <DialogDescription>
            Select the evaluation status and provide details.
          </DialogDescription>
        </DialogHeader>
        <Label>Status</Label>
        <Select onValueChange={setEvaluationStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="conditional">Conditional</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        {evaluationStatus === "approved" && (
          <div>
            <Label>Schedule</Label>
            <Input
              type="datetime-local"
              onChange={(e) => setSchedule(e.target.value)}
            />
          </div>
        )}
        {evaluationStatus === "conditional" && (
          <div>
            <Label>Missing Requirements</Label>
            <Textarea
              placeholder="Specify missing requirements..."
              value={missingRequirements}
              onChange={(e) => setMissingRequirements(e.target.value)}
            />
          </div>
        )}
        <div>
          <Label>Evaluation Notes</Label>
          <Textarea
            className="h-32"
            placeholder="Enter your evaluation..."
            value={evaluationText}
            onChange={(e) => setEvaluationText(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
