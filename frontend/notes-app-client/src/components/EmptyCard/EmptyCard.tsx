import React from "react";

interface EmptyCardProps {
  imgSrc: string;
  message: string;
}

const EmptyCard: React.FC<EmptyCardProps> = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <img src={imgSrc} alt="No notes" className="w-60" />
      <p className="w-1/2 text-sm font-medium text-slate-700 text-center mt-2">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
