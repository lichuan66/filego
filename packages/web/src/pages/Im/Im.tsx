import React, { useMemo, useState } from "react";
import ImMenu from "./ImMenu";
import ImLinkList from "./ImLinkList";
import Imchat from "./ImChat";
import { ShowUserOrGroupInfoContext } from "../../context";
import UserInfo from "./UserInfo";

export default function Im() {
  const [imMenuIndex, setImMenuIndex] = useState(1);

  const [userInfoDialog, setUserInfoDialog] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [groupInfoDialog, setGroupInfoDialog] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);

  const contextValue = useMemo(
    () => ({
      showUserInfo(user: any) {
        setUserInfo(user);
        setUserInfoDialog(true);
      },
      showGroupInfo(group: any) {
        setGroupInfo(group);
        setGroupInfoDialog(true);
      },
    }),
    []
  );

  return (
    <div className=" w-full h-full rounded-lg p-2 bg-[#eee] flex flex-row">
      <ShowUserOrGroupInfoContext.Provider
        value={contextValue as unknown as null}
      >
        <div className="w-36 bg-white">
          <ImMenu setImMenuIndex={setImMenuIndex} imMenuIndex={imMenuIndex} />
        </div>
        <div className="w-100 bg-white mx-1">
          <ImLinkList />
        </div>
        <div className="flex-auto bg-white relative">
          <Imchat />
        </div>
      </ShowUserOrGroupInfoContext.Provider>
      <UserInfo
        visible={userInfoDialog}
        // @ts-ignore
        user={userInfo}
        onClose={() => {
          setUserInfoDialog(false);
        }}
      />
    </div>
  );
}
