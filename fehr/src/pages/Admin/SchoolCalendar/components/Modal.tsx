import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
        <div className="flex justify-end">
          {/* <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Close
          </button> */}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;