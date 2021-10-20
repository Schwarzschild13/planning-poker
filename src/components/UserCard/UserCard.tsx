import React, { FunctionComponent, useEffect } from "react";
import firebase from "../../utils/Firebase";
import "../../App.css";
import { UserType } from "../../types/UserType";
import "./UserCard.css";

interface UserCardProps {
  user: UserType;
  id: string;
}

const UserCard: FunctionComponent<UserCardProps> = ({ user, id }) => {
  const currUser = JSON.parse(localStorage.getItem("currentUserId")!);

  useEffect(() => {
    console.log(`${user.num}`);
  }, [user.num]);

  const deleteUser = () => {
    const userRef = firebase.database().ref(`${id}`).child(user!.id);
    userRef.remove();
  };

  return (
    <div className="user-card">
      <div className="user-details">
        <div>{user!.title}</div>
        <p>{user.id === currUser ? "(You)" : " "}</p>
      </div>
      <div className={`card ${!user.flip ? "card-flipped" : " "} `}>
        {user.flip && <p>{user.num}</p>}
      </div>
    </div>
  );
};

export default UserCard;
