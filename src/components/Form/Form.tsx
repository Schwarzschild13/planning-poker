import { FunctionComponent, useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../../utils/Firebase";
import { AdminContext } from "../../context/Context";
import { useLocalStorage } from "../useLocalStorage";
import { UserType } from "../../types/UserType";
import "./Form.css";

interface FormProps {
  id: string;
}

const Form: FunctionComponent<FormProps> = ({ id }) => {
  const [state, setState] = useLocalStorage("currentUserId", "");
  const { isAdmin, toggleAdmin } = useContext(AdminContext);
  const [title, setTitle] = useState("");
  const history = useHistory();
  const [usersList, setUsersList] = useState<Array<UserType>>();

  useEffect(() => {
    const userRef = firebase.database().ref(id);
    userRef.on("value", (snapshot) => {
      const users = snapshot.val();
      const usersList = [];
      for (let id in users) {
        usersList.push({ id, ...users[id] });
      }
      setUsersList(usersList);
    });
  }, []);

  // Redirect to lists
  const toList = () => {
    let delay = setTimeout(() => {
      let path = `/game/${id}`;
      history.push(path);
    }, 1000);
    return () => clearTimeout(delay);
  };
  const handleOnChange = (e: any) => {
    setTitle(e.target.value);
  };

  const createUser = () => {
    usersList?.map((user) => {
      const userRef = firebase.database().ref(id).child(user.id);
      userRef.update({
        flip: false,
      });
    });
    const userRef = firebase.database().ref(`${id}`);
    const user = {
      title,
      isAdmin: isAdmin,
      num: 0,
      flip: false,
    };

    // Get user id
    let pushid = userRef.push(user).key;
    console.log(pushid);
    setState(pushid!);
    toList();
  };
  return (
    <div className="username-form">
      <form
        className="form-container"
        action="submit"
        onSubmit={(e) => {
          e.preventDefault();
          createUser();
        }}
      >
        <div className="input-label">Enter your name:</div>
        <div className="name-input-body">
          <input
            className="name-input"
            type="text"
            onChange={handleOnChange}
            value={title}
            placeholder="Name"
          />
          <button className="btn name-submit-btn" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
