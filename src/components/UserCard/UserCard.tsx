import { FunctionComponent } from "react";
import "../../App.css";
import { UserType } from "../../types/UserType";
import "./UserCard.css";

interface UserCardProps {
  user: UserType;
  id: string;
}

const UserCard: FunctionComponent<UserCardProps> = ({ user, id }) => {
  const currUser = JSON.parse(localStorage.getItem("currentUserId")!);

  // Delete a user

  // const deleteUser = () => {
  //   const userRef = firebase.database().ref(`${id}`).child(user!.id);
  //   userRef.remove();
  // };

  return (
    <div className="user-card">
      {/* add a button for admin user to delete users */}
      {/* <button onClick={() => {}}>✕</button> */}
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
