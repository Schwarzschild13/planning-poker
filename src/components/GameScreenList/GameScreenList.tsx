import firebase from "firebase/compat";
import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useState,
} from "react";
import { UserType } from "../../types/UserType";
import UserCardList from "../UserCardList/UserCardList";
import { useParams, useHistory } from "react-router-dom";
import "./GameScreenList.css";

interface GameScreenListProps {}

interface IdType {
  id: string;
}

const GameScreenList: FunctionComponent<GameScreenListProps> = () => {
  const fib = [1, 2, 3, 5, 8, 13, 21, 34];
  const history = useHistory();
  const [num, setNum] = useState(0);
  const { id } = useParams<IdType>();
  const [admin, setAdmin] = useState<boolean>();
  const [avg, setAvg] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>();
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<Array<UserType>>();
  const userId = JSON.parse(localStorage.getItem("currentUserId")!);

  useEffect(() => {
    const userRef = firebase.database().ref(id);
    userRef.on("value", (snapshot) => {
      const users = snapshot.val();
      const usersList = [];
      for (let id in users) {
        usersList.push({ id, ...users[id] });
      }

      setUsersList(usersList);
      if (users !== null) {
        setUserName(users[userId]?.title);
        setAdmin(users[userId]?.isAdmin);
      }
    });
    setAvg(true);
  }, []);

  // Reset on page reload
  window.onunload = () => {
    flipCards(false);
    onReset();
  };

  const flipCards = (a: boolean) => {
    usersList?.map((user) => {
      const userRef = firebase.database().ref(id).child(user.id);
      userRef.update({
        flip: a,
      });
    });
  };

  const onReset = () => {
    usersList?.map((user) => {
      const userRef = firebase.database().ref(id).child(user.id);
      userRef.update({
        num: 0,
      });
    });
  };

  const averageScore = () => {
    let count = 0;
    let sum = 0;
    usersList?.map((user) => {
      if (user.num !== 0) {
        count = count + 1;
        sum = sum + user.num;
      }
    });
    if (count === 0 || sum === 0) {
      return -1;
    } else {
      return Math.round(sum / count);
    }
  };

  const onExit = () => {
    let path = "/";
    history.push(path);
  };

  const deleteUser = () => {
    const userRef = firebase.database().ref(id).child(userId);
    userRef.remove();
    onExit();
  };

  const submitNum = () => {
    const userRef = firebase.database().ref(id).child(userId!);
    userRef.update({
      num: num,
    });
  };

  const invite = () => {
    const el = document.createElement("input");
    el.value = `${window.location.origin}/${id}`;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div>
      <div className="navbar-gamescreen">
        <h1>Planning poker</h1>
        {userName && (
          <p>
            Hello, <b>{`${userName}`}</b>
          </p>
        )}
      </div>
      <div className="room-data">
        <p>
          <b>Room Id:</b> {id}
        </p>
        <button
          className={`game-btn ${copied ? "copied-btn" : "copy-btn"}`}
          onClick={() => {
            invite();
          }}
        >
          {copied ? "Copied!" : "Copy Invite Link"}
        </button>
      </div>

      <div className="fib-select">
        <div>
          <button
            className="exit-btn game-btn"
            onClick={() => {
              deleteUser();
            }}
          >
            Exit
          </button>
        </div>
        <div className="num-select-div">
          {React.createElement(
            "select",
            {
              name: "fib",
              className: "num-select",
              onChange: (e: ChangeEvent<HTMLSelectElement>) => {
                setNum(parseInt(e.target.value));
              },
            },
            React.createElement(
              "option",
              {
                value: 0,
              },
              "--select a number--"
            ),
            fib.map((num, index) => {
              return React.createElement(
                "option",
                {
                  value: num,
                  key: index,
                },
                num
              );
            })
          )}
        </div>
        <div>
          <button
            className="submit-btn game-btn"
            type="submit"
            onClick={() => {
              if (num !== 0) {
                submitNum();
                console.log("submitted:", num);
              } else {
                alert("Please select a number");
              }
            }}
          >
            Submit
          </button>
        </div>
      </div>
      {admin && (
        <div className="flip-btn-div">
          <button
            className="game-btn flip-btn"
            onClick={() => {
              if (averageScore() !== -1) {
                flipCards(true);
                setAvg(false);
                console.log(averageScore());
              } else {
                alert("Select a number and click submit");
              }
            }}
          >
            Flip all cards
          </button>

          <button
            className="reset game-btn"
            onClick={() => {
              setAvg(true);
              flipCards(false);
              onReset();
            }}
          >
            Reset
          </button>
        </div>
      )}
      {avg ? (
        ""
      ) : (
        <div className="avg-disp">{`${
          averageScore() === -1 ? "" : `Average: ${averageScore()}`
        }`}</div>
      )}

      {/* game list */}

      <div className="game-list">
        <UserCardList id={id} isSubmit={isSubmit} />
      </div>
    </div>
  );
};

export default GameScreenList;
