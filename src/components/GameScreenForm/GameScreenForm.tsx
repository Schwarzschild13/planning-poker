import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import Form from "../Form/Form";

interface GameScreenFormProps {}

interface IdType {
  id: string;
}

const GameScreenForm: FunctionComponent<GameScreenFormProps> = () => {
  const { id } = useParams<IdType>();
  return (
    <div className="game-form">
      <Form id={id} />
    </div>
  );
};

export default GameScreenForm;
