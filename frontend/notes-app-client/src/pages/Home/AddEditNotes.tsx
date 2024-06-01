import React, { useState, ChangeEvent } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axios";

interface AddEditNotesProps {
  type: 'add' | 'edit';
  noteData: { title: string; content: string; tags: string[]; _id: string } | null;
  onClose: () => void;
  getAllNotes: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showToastMessage: (message: any, type: any) => void;
}

const AddEditNotes: React.FC<AddEditNotesProps> = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {
  const [title, setTitle] = useState<string>(noteData ? noteData.title : "");
  const [content, setContent] = useState<string>(noteData ? noteData.content : "");
  const [tags, setTags] = useState<string[]>(noteData ? noteData.tags : []);
  const [error, setError] = useState<string | null>(null);

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post(`${import.meta.env.BASE_URL}/addnote`, {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully", "add");
        getAllNotes();
        onClose();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  const editNote = async () => {
    if (!noteData) {
      return;
    }

    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put(`${import.meta.env.BASE_URL}/editnote` + noteId, {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully", "edit");
        getAllNotes();
        onClose();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!content) {
      setError("Please enter the content");
      return;
    }

    setError(null);
    if (type === 'edit') {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="w-full mx-auto p-1">
      <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500" onClick={onClose}>
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-slate-400">TITLE</label>
        <input
          type="text"
          className="text-lg text-slate-950 outline-none "
          placeholder="Go to gym"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="text-xs text-slate-400">CONTENT</label>
        <textarea
          className="text-base text-slate-950 outline-none bg-slate-50 p-2 rounded "
          placeholder="Content"
          rows={6}
          value={content}
          onChange={handleContentChange}
        />
      </div>
      <div className="mt-3">
        <label className="text-xs text-slate-400">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
      <button
        className="w-full text-sm bg-primary text-white rounded my-1 hover:bg-blue font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        {type === 'add' ? 'ADD' : 'UPDATE'}
      </button>
    </div>
  );
};

export default AddEditNotes;
