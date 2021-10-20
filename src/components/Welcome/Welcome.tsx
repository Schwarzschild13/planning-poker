import { FunctionComponent, useContext } from "react";
import { useHistory } from "react-router";
import { v1 as uuidv1 } from "uuid";
import { AdminContext } from "../../context/Context";
import "./Welcome.css";

interface WelcomeProps {}

const Welcome: FunctionComponent<WelcomeProps> = () => {
  const { isAdmin, toggleAdmin } = useContext(AdminContext);

  let gameId: string;
  const history = useHistory();
  const createGame = () => {
    let path = `/${uuidv1()}`;
    history.push(path);
    toggleAdmin();
  };

  const joinGame = (gameId: string) => {
    let path = `/${gameId}`;
    history.push(path);
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
