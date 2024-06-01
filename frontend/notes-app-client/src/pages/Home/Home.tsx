/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { MdAdd } from "react-icons/md";
import NoteCard from "../../components/Cards/NoteCard";
import EmptyCard from "../../components/EmptyCard/EmptyCard"; // Import the EmptyCard component
import AddNoteImg from "../../assets/images/add-note.png"; // Import the image if necessary
import Navbar from "../../components/Navbar/Navbar";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import moment from "moment";
import Toast from "../../components/ToastMessage/Toast";
import NoData from "../../assets/images/no-notes.png"
interface UserInfo {
  fullName: string;
  email: string;
}

interface Note {
  _id: string;
  title: string;
  createdAt: Date;
  content: string;
  tags: string[];
  isPinned: boolean;
}

const Home: React.FC = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add" as "add" | "edit",
    data: null as Note | null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });


  const [isSearch, setIsSearch] = useState<boolean>(false);

  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  const handleEdit = (noteDetails: Note) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const handleDelete = async (noteId: string) => {
    try {
      await axiosInstance.delete(`/deletenote/${noteId}`);
      showToastMessage("Note Deleted Successfully", "delete");
      getAllNotes();
    } catch (error) {
      console.log("Failed to delete the note. Please try again.");
    }
  };

  const showToastMessage = (message: any, type: any) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
      type: "",
    });
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  const handleAddNote = () => {
    setOpenAddEditModal({ isShown: true, type: "add", data: null });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get(`${import.meta.env.BASE_URL}/getuser`);
      if (response.data && response.data.user) {
        setUserInfo(response.data.user as UserInfo);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate(`${import.meta.env.BASE_URL}/login`);
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get(`${import.meta.env.BASE_URL}/getallnotes`);
      if (response.data && response.data.notes) {
        const uniqueNotes = response.data.notes.filter(
          (note: Note, index: number, self: Note[]) =>
            index === self.findIndex((t) => t._id === note._id)
        );
        setAllNotes(uniqueNotes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const onSearchNote = async (query: any)=>{
    try{
      const response = await axiosInstance.get(`${import.meta.env.BASE_URL}/searchnotes`,{
        params:{query},

      })
      if(response.data && response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    }catch(error){
      console.log(error);
      
    }
  }

  const handleClearSearch = ()=>{
    setIsSearch(false);
    getAllNotes();
  }

  const updateIsPinned = async (noteData: Note) =>{
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put(`${import.meta.env.BASE_URL}/notepinned` + noteId, {
        "isPinned":!noteData.isPinned,
      });
      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully", "edit");
        getAllNotes();
        
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      
    }
  }

  Modal.setAppElement("#root");

  return (
    <>
      <Navbar userInfo={userInfo}  onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>

      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={moment(item.createdAt).format("Do MM YYYY")}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item._id)} // Call handleDelete with note ID
                onPinNote={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard imgSrc={isSearch? NoData :AddNoteImg} message={isSearch?`Oops! No notes found matching your search.`:`No notes available. Click the + button to add a new note.`} /> // Render the EmptyCard component
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={handleAddNote}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
