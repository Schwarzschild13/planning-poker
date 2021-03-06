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
  const [userNum, setUserNum] = useState<number>();
  const [userName, setUserName] = useState<string>();
  const [copied, setCopied] = useState<boolean>(false);
  const [isFlip, setisFlip] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<Array<UserType>>();
  const userId = JSON.parse(localStorage.getItem("currentUserId")!);

  useEffect(() => {
    let mounted = true;
    const userRef = firebase.database().ref(id);
    userRef.on("value", (snapshot) => {
      const users = snapshot.val();
      const usersList = [];
      for (let id in users) {
        usersList.push({ id, ...users[id] });
      }
      if (mounted) {
        setUsersList(usersList);
        if (users !== null) {
          setUserName(users[userId]?.title);
          setAdmin(users[userId]?.isAdmin);
          setUserNum(users[userId]?.num);
          setisFlip(users[userId]?.flip);
        }
      }
    });
    if (mounted) {
      setAvg(true);
    }
    return function cleanup() {
      mounted = false;
    };
  }, [id, userId]);

  useEffect(() => {
    console.log("inside useEffect", isFlip);
    if (isFlip) {
      setAvg(false);
    } else {
      setAvg(true);
    }
  }, [isFlip]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      if (userNum !== 0) {
        setIsSubmit(true);
        console.log("useeffect true");
      } else {
        setIsSubmit(false);
        console.log("useeffect false");
      }
    }
    return function cleanup() {
      mounted = false;
    };
  }, [userNum]);

  // Reset on page reload
  window.onunload = () => {
    flipCards(false);
    onReset();
  };

  const flipCards = (a: boolean) => {
    usersList?.forEach((user) => {
      const userRef = firebase.database().ref(id).child(user.id);
      userRef.update({
        flip: a,
      });
    });
  };

  const onReset = () => {
    usersList?.forEach((user) => {
      const userRef = firebase.database().ref(id).child(user.id);
      userRef.update({
        num: 0,
      });
    });
  };

  const averageScore = () => {
    let count = 0;
    let sum = 0;
    usersList?.forEach((user) => {
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
        <div
          className="heading-btn"
          onClick={() => {
            window.confirm("You will be removed from the game. Continue?");
            deleteUser();
          }}
        >
          <h1>Planning Poker</h1>
        </div>

        <p>Hello, {userName && <b>{`${userName}`}</b>}</p>
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
                setIsSubmit(false);
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
          {!isSubmit && (
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
          )}
          {isSubmit && (
            <button disabled className="submit-btn game-btn">
              Submitted ???
            </button>
          )}
          {/* {!isSubmit && <button>test</button>} */}
        </div>
      </div>
      {admin && (
        <div className="flip-btn-div">
          <button
            className="game-btn flip-btn"
            onClick={() => {
              if (averageScore() !== -1) {
                flipCards(true);
                // setAvg(false);
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
              // setAvg(true);
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
        <UserCardList id={id} />
      </div>
    </div>
  );
};

export default GameScreenList;
