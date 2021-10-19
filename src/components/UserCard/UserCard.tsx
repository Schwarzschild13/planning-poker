import React, { FunctionComponent } from "react";
import firebase from "../../utils/Firebase";
import "../../App.css";
import { UserType } from "../../types/UserType";
import "./UserCard.css";

interface UserCardProps {
  user: UserType;
  id: string;
}

const UserCard: FunctionComponent<UserCardProps> = ({ user, id }) => {
  const deleteUser = () => {
    const userRef = firebase.database().ref(`${id}`).child(user!.id);
    userRef.remove();
  };

  return (
    <div className="user-card">
      <h1>{user!.title}</h1>
      {user.flip && <h1>{user.num}</h1>}
      {/* <button onClick={deleteUser}>Delete</button> */}
    </div>
  );
};

export default UserCard;
