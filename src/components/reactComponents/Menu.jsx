import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import "./Menu.css";

function Menu() {
  const [hide, setHide] = useState(true);

  const handleHide = () => {
    setHide(!hide);
  };

  return (
    <>
      {hide ? (
        <FaBars className="icon" onClick={handleHide} />
      ) : (
        <SideMenu show={hide} handleHide={handleHide} />
      )}
    </>
  );
}

function SideMenu({ handleHide, show }) {
  return (
    <div className={show.toString()}>
      <div className="header">
        <h2 className=" ">Gymland</h2>
        <IoCloseSharp onClick={handleHide} />
      </div>
      <ul className="links-container">
        <a className="link" href="/" onClick={handleHide}>
          Inicio
        </a>
        <a className="link" href="/sproducts" onClick={handleHide}>
          Favoritos
        </a>
        <a className="link" href="/products" onClick={handleHide}>
          Gymshark
        </a>
        <a className="link" href="/wbest" onClick={handleHide}>
          Wommen's Best
        </a>
      </ul>
      <div className="icons-container">
        <a href="https://www.instagram.com/gymlandhn/" target="_blank">
          <BsInstagram className="icon" />
        </a>
        <a href="https://www.facebook.com/gymlandhn?locale=es_LA" target="_blank">
          <FaFacebook className="icon" />
        </a>
      </div>
    </div>
  );
}

export default Menu;
