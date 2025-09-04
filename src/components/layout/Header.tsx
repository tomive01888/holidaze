import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import holidazeLogo from "../../assets/holidaze_logo.png";
import Button from "../ui/Button";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const getHeaderClass = () => {
    return "bg-teal-800 text-white";
  };

  const helloLog = () => {
    console.log("hello login form");
  };
  return (
    <header className={`sticky top-0 z-40 h-16 shadow-md transition-colors ${getHeaderClass()}`}>
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:opacity-80 transition-opacity font-new flex gap-1">
          <img src={holidazeLogo} alt="Holidaze logo including a globe" className=" w-full max-w-30" />
        </Link>
        <div>
          <Button variant="secondary" onClick={helloLog} type="button">
            Login
          </Button>
          <Link to="/register">
            <Button variant="primary">Register</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
