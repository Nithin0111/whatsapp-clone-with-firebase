import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFile,
  InsertEmoticon,
  Mic,
  MoreVert,
  SearchOutlined,
} from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./componetsStyles/Chat.css";
import db from "../config/firebase";
const Chat = () => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const sendMessage = (e) => {
    e.preventDefault();
    console.log("You typed >>>>", input);
    setInput("");
  };

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat_headerInfo">
          <h3>{roomName}</h3>
          <p>Last seen at...</p>
        </div>
        <div className="chay_headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        <div className={`chat_message ${false && "chat_reciever"}`}>
          <span className="chat_name">Nithin</span>
          Hey Guys
          <span className="chat_timestamp">9:46pm</span>
        </div>
        <div className="chat_message chat_reciever">
          <span className="chat_name">Nithin</span>
          Hey Guys
          <span className="chat_timestamp">9:46pm</span>
        </div>
      </div>
      <div className="chat_footer">
        <InsertEmoticon />
        <form>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            Send message
          </button>
        </form>
        <Mic />
      </div>
    </div>
  );
  //FIXME:Paused at 1:57:21
};

export default Chat;
