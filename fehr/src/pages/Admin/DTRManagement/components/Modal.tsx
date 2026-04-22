import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (remarks: string) => void;
  title: string;
  label: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = React.useState("");

  // Close modal on Escape key
  useEffect(() => {
    if (!isOpen) return; // Only add event when modal is open

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-semibold mb-4">Remarks</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          autoFocus
          aria-label="Remarks"
        />

        <div className="flex justify-end">
          <Button variant="outline" size="sm" className="mr-2" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={!reason.trim()} // Prevent empty submissions
            onClick={() => {
              onSubmit(reason.trim());
              onClose();
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
