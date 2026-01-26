import React from "react";

interface MobileModalProps {
  onClose: () => void;
}

const MobileModal: React.FC<MobileModalProps> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center w-screen h-screen">
    <div
      className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center flex flex-col items-center justify-center"
    >
      <h2 className="text-lg font-bold mb-2">Hey there, phone user!</h2>
      <p className="mb-4 text-zinc-700">
        This app is designed for computers, but you can still take a look on a phone.<br />
        I recommend you tilt your phone horizontally
      </p>
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={onClose}
      >
        Gotcha!
      </button>
    </div>
  </div>
);

export default MobileModal;
