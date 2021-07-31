import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./componetsStyles/SidebarChat.css";
import db from "../config/firebase";
import { Link } from "react-router-dom";

const SidebarChat = ({ id, name, addNewChat, open }) => {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  const createChat = () => {
    const roomName = prompt("Please enter a room name");
    console.log(roomName);
    if (roomName) {
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
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div className="sidebarChat">
      <div className="sidebarChat_info">
        <div className="sidebarChat_open">
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-11.414L9.172 7.757 7.757 9.172 10.586 12l-2.829 2.828 1.415 1.415L12 13.414l2.828 2.829 1.415-1.415L13.414 12l2.829-2.828-1.415-1.415L12 10.586z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11H7v2h4v4h2v-4h4v-2h-4V7h-2v4z" />
            </svg>
          )}
          <h2> Add New Room</h2>
        </div>
      </div>
    </div>
  );
};

export default SidebarChat;
