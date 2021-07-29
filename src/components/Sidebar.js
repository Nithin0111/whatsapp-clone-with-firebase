import React, { useState, useEffect } from "react";
import "./componetsStyles/Sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import {
  Chat,
  DonutLarge,
  MoreVert,
  SearchOutlined,
  ExitToAppOutlined,
} from "@material-ui/icons";
import SidebarChat from "./SidebarChat";

import db, { auth } from "../config/firebase";
import { useStateValue } from "../StateProvider";
import { useHistory } from "react-router-dom";

const Sidebar = () => {
  const [rooms, setRooms] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  let history = useHistory();
  const handleSignOut = async () => {
    return await auth
      .signOut()
      .then(() => {
        history.push("/");
        console.log("Singout Successful");
      })
      .catch((err) => {
        return alert(err.message);
      });
  };

  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar_headerRight">
          <IconButton>
            <DonutLarge />
          </IconButton>
          <IconButton>
            <Chat />
          </IconButton>
          <IconButton onClick={handleSignOut}>
            <ExitToAppOutlined title="SignOut" />
          </IconButton>
        </div>
      </div>
      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <SearchOutlined />
          <input type="text" placeholder="Search or start a new chat" />
        </div>
      </div>
      <div className="sidebar_chat">
        <SidebarChat addNewChat />
        {rooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
