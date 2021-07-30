import React from "react";
import "./componetsStyles/Login.css";
import { Button } from "@material-ui/core";
import db, { auth, provider } from "../config/firebase";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";
import firebase from "firebase";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [{ user }, dispatch] = useStateValue();
  let history = useHistory();
  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
        console.log(result.user.email);

        let userExists = db
          .collection("users")
          .where("uid", "==", result.user.uid)
          .get();
        userExists.then((user) => {
          if (user.docs.length > 0) {
            console.log("User already exists");
          } else {
            db.collection("users")
              .add({
                name: result.user.displayName,
                email: result.user.email,
                photoUrl: result.user.photoURL,
                uid: result.user.uid,
              })
              .then(() => {
                console.log("User added successfully");
              })
              .catch((error) => {
                return alert(error.message);
              });
          }
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="login">
      {user ? (
        history.push("/")
      ) : (
        <div className="login_container">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/479px-WhatsApp.svg.png"
            alt=""
          />
          <div className="login_text">
            <h1>Sign in to Whatsapp</h1>
          </div>
          <Button onClick={signIn}>Sign In with google</Button>
        </div>
      )}
    </div>
  );
};

export default Login;
