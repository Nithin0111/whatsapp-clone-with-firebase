import React, { useState, useEffect } from "react";
import "./componetsStyles/Sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import {
  Chat,
  DonutLarge,
  MoreVert,
  SearchOutlined,
  ExitToAppOutlined,
  VisibilityOff,
  Visibility,
} from "@material-ui/icons";
import SidebarChat from "./SidebarChat";

import db, { auth } from "../config/firebase";
import { useStateValue } from "../StateProvider";
import { useHistory, Link } from "react-router-dom";
import { actionTypes } from "../reducer";

const Sidebar = () => {
  const [rooms, setRooms] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [addrtype, setAddrtype] = useState(["Normal", "Admin"]);
  const Add = addrtype.map((Add) => Add);
  let history = useHistory();
  const [roomtype, setRoomtype] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomUsers, setRoomUsers] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  console.log(roomtype);

  const reset = () => {
    setIsOpen(!isOpen);
    setRoomName("");
    setRoomUsers("");
  };

  const handleCreateRoom = async () => {
    console.log(roomUsers);
    const newArr = roomUsers.split(",");
    console.log(newArr);
    const roomUserIds = newArr.map((user) => {
      return user.replace("http://localhost:3000/profile/", "");
    });
    if (roomtype === "Private") {
      if (!roomName || !roomUsers) {
        alert("Please fill all fields");
      } else {
        await db
          .collection("rooms")
          .add({
            name: roomName,
            type: roomtype,
            users: roomUserIds,
          })
          .then(() => {
            console.log("Private room added successfully");
          })
          .catch((err) => alert(err.message));
      }
    } else {
      if (!roomName) {
        alert("Please fill all fields");
      } else {
        await db
          .collection("rooms")
          .add({
            name: roomName,
            type: roomtype,
          })
          .then(() => {
            console.log("Public room added successfully");
          })
          .catch((err) => alert(err.message));
      }
    }

    reset();
  };

  const handleShowPrivateRooms = async () => {
    setShowHidden(!showHidden);
    return showHidden
      ? await db
          .collection("rooms")
          .where("users", "array-contains", user.uid)
          .onSnapshot((snapshot) =>
            setRooms(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }))
            )
          )
      : await db
          .collection("rooms")
          .where("type", "==", "Public")
          .onSnapshot((snapshot) =>
            setRooms(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }))
            )
          );
  };

  const handleSignOut = async () => {
    return await auth
      .signOut()
      .then(() => {
        history.push("/signin");
        dispatch({
          type: actionTypes.SET_USER,
          user: null,
        });
        console.log("Signout Successful");
      })
      .catch((err) => {
        return alert(err.message);
      });
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("rooms")
      .where("type", "==", "Public")
      .onSnapshot((snapshot) =>
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
  console.log(showHidden);

  return user ? (
    <div className="sidebar">
      <div className="sidebar_header">
        <Link to={`/profile`}>
          <Avatar src={user?.photoURL} />
        </Link>
        <div className="sidebar_headerRight">
          <IconButton onClick={handleShowPrivateRooms}>
            {showHidden ? <VisibilityOff /> : <Visibility />}
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
        <div className="modal_opening" onClick={() => setIsOpen(!isOpen)}>
          <SidebarChat addNewChat open={isOpen} />
        </div>
        {isOpen && (
          <div className="sidebar_modal">
            <form onSubmit={handleCreateRoom}>
              <input
                type="text"
                placeholder="Please enter room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <br />
              <select
                value={roomtype}
                onChange={(e) => setRoomtype(e.target.value)}
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              <br />
              {roomtype === "Private" && (
                <input
                  type="text"
                  placeholder="Add members by profile urls seperated by comma"
                  value={roomUsers}
                  onChange={(e) => setRoomUsers(e.target.value)}
                />
              )}
              <br />
              <button type="button" onClick={handleCreateRoom}>
                Submit
              </button>
            </form>
          </div>
        )}
        {rooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  ) : (
    history.push("/")
  );
};

export default Sidebar;
