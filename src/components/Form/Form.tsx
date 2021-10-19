import { FunctionComponent, useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../../utils/Firebase";
import { AdminContext } from "../../context/Context";
import { useLocalStorage } from "../useLocalStorage";
import { UserType } from "../../types/UserType";

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
    <div>
      <form
        action="submit"
        onSubmit={(e) => {
          e.preventDefault();
          createUser();
        }}
      >
        <label htmlFor="name"> Enter name</label>
        <input type="text" onChange={handleOnChange} value={title} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
