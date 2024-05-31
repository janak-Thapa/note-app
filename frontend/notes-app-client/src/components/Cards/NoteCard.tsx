import React from "react";
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";

interface NoteCardProps {
  title: string;
  date: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onPinNote: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">{date}</span>
        </div>
        <MdOutlinePushPin
          className={`text-xl cursor-pointer hover:text-primary ${
            isPinned ? "text-primary" : "text-slate-300"
          }`}
          onClick={onPinNote}
        />
      </div>
      <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 60)}</p>

      <div className="flex flex-wrap mt-2 justify-between">
        <div className="text-xs text-slate-500 mt-2">
          {tags.map((item, index) => (
            <span key={index} className="mr-1">
              {item}
              {index !== tags.length - 1 && ","}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <MdCreate className="icon-btn hover:text-green-600" onClick={onEdit} />
          <MdDelete className="icon-btn hover:text-red-500" onClick={onDelete} />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
