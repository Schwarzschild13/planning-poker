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
  }, []);

  // window.onunload = () => {
  //   deleteUser();
  // };

  // window.addEventListener("beforeunload", (event) => {
  //   event.returnValue = `Are you sure you want to leave?`;
  //   console.log("eventListener");
  // });

  const flipCards = () => {
    usersList?.map((user) => {
      const userRef = firebase.database().ref(id).child(user.id);
      userRef.update({
        flip: !user.flip,
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
      <p>Hello, {`${userName}`}</p>
      <p>Room Id: {id}</p>
      <button
        onClick={() => {
          deleteUser();
        }}
      >
        Exit
      </button>
      <div className="fib-select">
        <form
          action="submit"
          onSubmit={(e) => {
            e.preventDefault();
            if (num !== 0) {
              submitNum();
              console.log("submitted:", num);
            } else {
              alert("Please select a number");
            }
          }}
        >
          {React.createElement(
            "select",
            {
              name: "fib",
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
          <button type="submit">Submit</button>
        </form>
        <div className="flip-btn">
          <button
            onClick={() => {
              flipCards();
            }}
          >
            Flip all cards
          </button>
          <button
            onClick={() => {
              console.log(averageScore());
            }}
          >
            Average
          </button>
        </div>
      </div>

      {/* game list */}

      <div className="game-list">
        <UserCardList id={id} />
      </div>
    </div>
  );
};

export default GameScreenList;
