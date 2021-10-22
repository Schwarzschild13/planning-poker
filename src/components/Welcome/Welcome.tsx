import firebase from "firebase/compat";
import { FunctionComponent, useContext, useState } from "react";
import { useHistory } from "react-router";
import { v1 as uuidv1 } from "uuid";
import { AdminContext } from "../../context/Context";
import "./Welcome.css";

interface WelcomeProps {}

const Welcome: FunctionComponent<WelcomeProps> = () => {
  const { isAdmin, toggleAdmin } = useContext(AdminContext);
  // const [games, setGames] = useState<Array<string>>();

  let gameId: string;
  const history = useHistory();
  const createGame = () => {
    let path = `/${uuidv1()}`;
    history.push(path);
    toggleAdmin();
  };

  // Check for valid games before joining a game

  // const fun = () => {
  //   const userRef = firebase.database().ref(gameId);
  //   userRef.on("value", (snapshot) => {
  //     const users = snapshot.val();
  //     const usersList = [];
  //     for (let id in users) {
  //       usersList.push(id);
  //     }
  //     setGames(usersList);
  //   });
  // };

  // check if entered join room id is valid

  const checkUuid = (gameId: string) => {
    const regexExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(gameId);
  };

  const joinGame = (gameId: string) => {
    if (checkUuid(gameId)) {
      let path = `/${gameId}`;
      history.push(path);
    } else {
      alert("Invalid game id");
    }
  };

  return (
    <div>
      <h1>Welcome</h1>
      <div className="welcome-form">
        <button onClick={createGame} className="create-btn">
          Create Game
        </button>
        <p>OR</p>
        <div className="join-form">
          <input
            className="gameId-input"
            type="text"
            name="joinGame"
            id="joinGame"
            placeholder="  Enter game id"
            onChange={(e) => {
              gameId = e.target.value;
            }}
          />
          <button
            onClick={() => {
              joinGame(gameId);
            }}
            className="join-btn"
          >
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
