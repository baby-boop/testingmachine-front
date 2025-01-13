import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { CodeIcon, HamburgetMenuClose, HamburgetMenuOpen } from "./Icons";

function NavBar() {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  return (
    <>
      <nav className="navbar no-print">
        <div className="nav-container no-print">
          <NavLink exact to="/" className="nav-logo">
            <span>Testing machine</span>
            <span className="icon">
              <CodeIcon />
            </span>
          </NavLink>

          <ul className={click ? "nav-menu active" : "nav-menu "}>
            <li className="nav-item no-print">
              <NavLink
                exact
                to="/new-process"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Процесс
              </NavLink>
            </li>

            <li className="nav-item no-print">
              <NavLink
                exact
                to="/new-metaprocess"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Металист процесс
              </NavLink>
            </li>

            <li className="nav-item no-print">
              <NavLink
                exact
                to="/new-meta"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Металист
              </NavLink>
            </li>
            <li className="nav-item no-print">
              <NavLink
                exact
                to="/new-patch"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Patch
              </NavLink>
            </li>
{/* 
            <li className="nav-item no-print">
              <NavLink
                exact
                to="/test"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Тест класс
              </NavLink>
            </li> */}


          </ul>
          <div className="nav-icon no-print" onClick={handleClick}>

            {click ? (
              <span className="icon">
                <HamburgetMenuOpen />{" "}
              </span>
            ) : (
              <span className="icon">
                <HamburgetMenuClose />
              </span>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;