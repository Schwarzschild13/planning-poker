import { FunctionComponent } from "react";
import "./Navbar.css";

interface NavbarProps {}

const Navbar: FunctionComponent<NavbarProps> = () => {
  return (
    <div className="navbar">
      <h1>Planning poker</h1>
    </div>
  );
};

export default Navbar;
