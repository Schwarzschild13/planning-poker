import React, { FunctionComponent, useEffect, useState } from "react";
import firebase from "../../utils/Firebase";
import "../../App.css";
import { UserType } from "../../types/UserType";
import "./UserCard.css";

interface UserCardProps {
  user: UserType;
  id: string;
  isSubmit: boolean;
}

const UserCard: FunctionComponent<UserCardProps> = ({ user, id, isSubmit }) => {
  const currUser = JSON.parse(localStorage.getItem("currentUserId")!);
  // const [usersList, setUsersList] = useState<Array<UserType>>();
  // const userId = JSON.parse(localStorage.getItem("currentUserId")!);
  // const [admin, setAdmin] = useState<boolean>(false);

  useEffect(() => {
    console.log("currennt user: ", currUser);
    console.log("currennt user id: ", userId);
    console.log("admin status is: ", admin);
  }, []);

  // useEffect(() => {
  //   const userRef = firebase.database().ref(id);
  //   userRef.on("value", (snapshot) => {
  //     const users = snapshot.val();
  //     const usersList = [];
  //     if (users[currUser].isAdmin) {
  //       setAdmin(true);
  //       console.log("useeffect", true);
  //     } else {
  //       setAdmin(false);
  //       console.log("useeffect", false);
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   console.log(`${user.num}`);
  // }, [user.num]);

  // const testFun = () => {
  //   const userRef = firebase.database().ref(id);
  //   userRef.on("value", (snapshot) => {
  //     const users = snapshot.val();
  //     const usersList = [];
  //     if (users[currUser].isAdmin) {
  //       setAdmin(true);
  //     } else {
  //       setAdmin(false);
  //     }
  //   });
  // };

  const deleteUser = () => {
    const userRef = firebase.database().ref(`${id}`).child(user!.id);
    userRef.remove();
  };

  return (
    <div className="user-card">
      {/* {admin && (
        <div
          className="del"
          onClick={() => {
            deleteUser();
          }}
        >
          ✕
        </div>
      )} */}
      <div className="user-details">
        <div>{user!.title}</div>
        <p>{user.id === currUser ? "(You)" : " "}</p>
      </div>

      <div
        className={`card ${!user.flip ? "card-back" : " "} 
        ${user.flip === false && user.num !== 0 ? "card-back-ready" : " "}
      `}
      >
        {user.flip && <p>{user.num === 0 ? "Empty" : user.num}</p>}
      </div>
    </div>
  );
};

export default UserCard;
