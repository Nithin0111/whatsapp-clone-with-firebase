import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFile,
  Delete,
  Edit,
  Favorite,
  InsertEmoticon,
  MessageSharp,
  Mic,
  MoreVert,
  SearchOutlined,
} from "@material-ui/icons";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import "./componetsStyles/Chat.css";
import db from "../config/firebase";
import { useStateValue } from "../StateProvider";
import firebase from "firebase";
const Chat = () => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }] = useStateValue();
  let history = useHistory();

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log("You typed >>>>", input);

    await db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput("");
  };
  const handleDelete = async () => {
    await db
      .collection("rooms")
      .doc(roomId)
      .delete()
      .then(() => {
        history.push("/rooms");
        console.log("Deleted successfully with room id: ", roomId);
      })
      .catch((error) => {
        console.log("Error in deleting document", error.message);
      });
  };
  const handleUpdate = () => {
    const newRoomName = prompt("Enter new room room name");
    db.collection("rooms")
      .doc(roomId)
      .set({
        name: newRoomName,
      })
      .then(() => {
        console.log("Room name updated");
      })
      .catch((error) => {
        return alert(error.message);
      });
  };

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) =>
          snapshot.data()
            ? setRoomName(snapshot.data().name)
            : history.push("/rooms")
        );

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    } else {
      history.push("/rooms");
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  return (
    <>
      {}
      <div className="chat">
        <div className="chat_header">
          <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
          <div className="chat_headerInfo">
            <h3>{roomName}</h3>
            <p>
              last seen{" "}
              {new Date(
                messages[messages.length - 1]?.timestamp?.toDate()
              ).toLocaleString(undefined, { timeZone: "Asia/Kolkata" })}
            </p>
          </div>
          <div className="chay_headerRight">
            <IconButton onClick={handleUpdate} title="Edit room name">
              <Edit />
            </IconButton>
            <IconButton onClick={handleDelete} title="Delete room">
              <Delete />
            </IconButton>
            <IconButton>
              <MoreVert />
            </IconButton>
          </div>
        </div>
        <div className="chat_body">
          {messages.map((message) => (
            <p
              className={`chat_message ${
                message.name === user.displayName && "chat_reciever"
              }`}
            >
              <span className="chat_name">{message.name}</span>
              {message.message}
              <span className="chat_timestamp">
                {new Date(message.timestamp?.toDate()).toLocaleString(
                  undefined,
                  {
                    timeZone: "Asia/Kolkata",
                  }
                )}
              </span>
            </p>
          ))}
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
    </>
  );
};

export default Chat;
