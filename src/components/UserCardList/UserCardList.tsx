import React, { useState, useEffect, FunctionComponent } from "react";
import { UserType } from "../../types/UserType";
import firebase from "../../utils/Firebase";
import UserCard from "../UserCard/UserCard";
import "./UserCardList.css";

interface UserCardListProps {
  id: string;
}

const UserCardList: FunctionComponent<UserCardListProps> = ({ id }) => {
  const [userList, setUserList] = useState<Array<UserType>>();

  useEffect(() => {
    const userRef = firebase.database().ref(id);
    userRef.on("value", (snapshot) => {
      const users = snapshot.val();
      const userList = [];
      for (let id in users) {
        userList.push({ id, ...users[id] });
      }
      setUserList(userList);
    });
  }, []);

  return (
    <div className="game-card-list">
      {userList
        ? userList.map((user, index) => (
            <UserCard user={user} key={index} id={id} />
          ))
        : ""}
    </div>
  );
};
export default UserCardList;
