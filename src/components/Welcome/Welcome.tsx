import { FunctionComponent, useContext } from "react";
import { useHistory } from "react-router";
import { v1 as uuidv1 } from "uuid";
import { AdminContext } from "../../context/Context";

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
    <>
      <h1>Welcome</h1>
      <button onClick={createGame}>Create a game</button>
      <input
        type="text"
        name="joinGame"
        id="joinGame"
        onChange={(e) => {
          gameId = e.target.value;
        }}
      />
      <button
        onClick={() => {
          joinGame(gameId);
        }}
      >
        Join
      </button>
    </>
  );
};

export default Welcome;
