import firebase from "firebase/compat";
import React, {
  ChangeEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { UserType } from "../../types/UserType";
import UserCardList from "../UserCardList/UserCardList";
import "./GameScreenList.css";
import { useHistory } from "react-router-dom";
import { AdminContext } from "../../context/Context";
import "./GameScreenList.css";

interface GameScreenListProps {}

interface IdType {
  id: string;
}

const GameScreenList: FunctionComponent<GameScreenListProps> = () => {
  const fib = [1, 2, 3, 5, 8, 13, 21, 34];
  const [num, setNum] = useState(0);
  const [userList, setUserList] = useState<Array<UserType>>();
  const { id } = useParams<IdType>();
  const userId = JSON.parse(localStorage.getItem("currentUserId")!);
  const history = useHistory();
  const [userName, setUserName] = useState<string>();
  const [usersList, setUsersList] = useState<Array<UserType>>();
  const { isAdmin, toggleAdmin } = useContext(AdminContext);
  const [avg, setAvg] = useState<boolean>(false);

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
      }
    });
    // setAvg(false);
  }, []);

  // window.onunload = () => {
  //   deleteUser();
  // };

  // window.addEventListener("beforeunload", (event) => {
  //   event.returnValue = `Are you sure you want to leave?`;
  //   console.log("eventListener");
  // });

  const flipCards = (a: boolean) => {
    usersList?.map((user) => {
      const userRef = firebase.database().ref(id).child(user.id);
      userRef.update({
        flip: a,
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
    return Math.round(sum / count);
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

  return (
    <div>
      <div className="room-data">
        <p>Hello, {`${userName}`}</p>
        <p>Room Id: {id}</p>
      </div>

      <div className="fib-select">
        <div>
          <button
            className="exit-btn btn"
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
            className="submit-btn btn"
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
      <div className="flip-btn-div">
        <button
          className="btn flip-btn"
          onClick={() => {
            flipCards(true);
            setAvg(false);
            console.log(averageScore());
          }}
        >
          Flip all cards
        </button>

        <button
          className="reset btn"
          onClick={() => {
            setAvg(true);
            flipCards(false);
          }}
        >
          Reset
        </button>

        {!avg && <div className="avg-disp">{`Average: ${averageScore()}`}</div>}
      </div>

      {/* game list */}

      <div className="game-list">
        <UserCardList id={id} />
      </div>
    </div>
  );
};

export default GameScreenList;
