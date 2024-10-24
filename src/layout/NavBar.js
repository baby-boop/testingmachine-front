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
                to="/dashboard"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item no-print">
              <NavLink
                exact
                to="/meta"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Meta
              </NavLink>
            </li>
            <li className="nav-item no-print">
              <NavLink
                exact
                to="/metaverse"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Metaverse
              </NavLink>
            </li>

            <li className="nav-item no-print">
              <NavLink
                exact
                to="/process"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Process
              </NavLink>
            </li>

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