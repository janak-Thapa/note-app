import React, { useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

interface ToastProps {
  isShown: boolean;
  message: string;
  type: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ isShown, message, type, onClose }) => {
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [onClose]);

  return (
    <div className={`fixed top-20 right-6 transition-all duration-400 ${!isShown ? "opacity-0" : "opacity-100"}`}>
      <div className={`flex items-center gap-3`}>
        <div className={`min-w-10 w-2 ${type === "delete" ? "bg-red-500" : "bg-green-500"}`} />
        <div className={`bg-white border shadow-2xl rounded-md relative`}>
          <div className="flex items-center gap-3 py-2 px-4">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${type === "delete" ? "bg-red-50" : "bg-green-50"}`}>
              {type === "delete" ? <MdDeleteOutline className="text-xl text-red-500" /> : <LuCheck className="text-xl text-green-500" />}
            </div>
            <p className="text-sm text-slate-800">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
