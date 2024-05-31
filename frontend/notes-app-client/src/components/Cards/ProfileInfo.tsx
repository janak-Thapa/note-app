// ProfileInfo
import React from "react";
import { getInitials } from "../../utils/helper";

interface UserInfo {
  fullName: string;
  email: string;
}

interface ProfileInfoProps {
  onLogout: (event: React.MouseEvent<HTMLButtonElement>) => void;
  userInfo: UserInfo | null;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ userInfo, onLogout }) => {
  if (!userInfo) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 mt-3 md:mt-0">
      <div className="w-10 h-10 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {getInitials(userInfo.fullName)}
      </div>
      <div>
        <p className="text-xs md:text-sm font-medium">{userInfo.fullName}</p>
        <button className="text-xs md:text-sm text-slate-700 underline" onClick={onLogout}>Log Out</button>
      </div>
    </div>
  );
};

export default ProfileInfo;
