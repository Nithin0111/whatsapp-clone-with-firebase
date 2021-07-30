import React from "react";
import { useStateValue } from "../StateProvider";

const User = () => {
  const [{ user }] = useStateValue();
  console.log(user);
  return (
    <div>
      <p>username: {user.email}</p>
    </div>
  );
};

export default User;
