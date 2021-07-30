import React from "react";
import { useState } from "react";
import { useStateValue } from "../StateProvider";
import "./componetsStyles/User.css";

const User = () => {
  const [{ user }] = useStateValue();
  const [isCopied, setIsCopied] = useState(false);
  const copyUrl = window.location.href + "/" + user.uid;
  console.log(copyUrl);
  const handleCopy = () => {
    navigator.clipboard.writeText(copyUrl).then(
      () => {
        setIsCopied(true);
        console.log("Copy Successful");
      },
      (err) => {
        setIsCopied(false);
        console.log(err.message);
      }
    );
  };
  console.log(user);
  return (
    <div className="userComponent">
      <div className="userInfo">
        <img src={user.photoURL} alt={user.username} />
        <h3>{user.displayName}</h3>
        <h3>{user.email}</h3>
        {isCopied
          ? (setTimeout(() => {
              setIsCopied(!isCopied);
            }, 3000),
            (<p>Copy Successful</p>))
          : null}
        <button onClick={handleCopy}>Share Profile</button>
      </div>
    </div>
  );
};

export default User;
