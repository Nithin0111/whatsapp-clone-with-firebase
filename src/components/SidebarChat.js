import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./componetsStyles/SidebarChat.css";
import db from "../config/firebase";
import { Link } from "react-router-dom";

const SidebarChat = ({ id, name, addNewChat }) => {
  const [seed, setSeed] = useState("");

  const createChat = () => {
    const roomName = prompt("Please enter a room name");
    console.log(roomName);
    if (roomName) {
      //DONE AND I AM RIGHT:Do Some Stuff in Database as of now i don't know what they will be doing but i am assuming that they will store the name in the firebase database using write method and then show it in the sidebar.
      db.collection("rooms")
        .add({
          name: roomName,
        })
        .then((docRef) => {
          console.log("Document written in db with id: ", docRef.id);
        })
        .catch((error) => {
          console.log("Error caught is", error);
        });
    }
  };

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat_info">
          <h2>{name}</h2>
          <p>Last Messagee...</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <div className="sidebarChat_info">
        <h2>Add New Chat</h2>
      </div>
    </div>
  );
};

export default SidebarChat;
