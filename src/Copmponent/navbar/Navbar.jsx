import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import "./navbar.css";
import { API_BASE_URL } from "../../config";
import barsIcon from "../images/ic_round-menu.png"
function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
          lang: "en",
        };

        const response = await axios.get(
          `${API_BASE_URL}/api/v1/profile`,
          { headers }
        );
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data?.error || error.message);
      }
    };

    fetchUserData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserData(null);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="container-nav">
        <div className="logo d-flex">
          <img src="/logo.png" alt="Logo" />
          {!userData ? (
            <img src={barsIcon}
              alt="icon"
              className="bars"
              onClick={toggleNav}
              srcset="" />
          ) : (
            <>
              <div className="profile-info profile-info-mobile">
                <div className="icon mt-3">
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="profile-icon mx-1"
                    onClick={toggleDropdown}
                  />
                </div>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={userData.image}
                    alt="Profile"
                    className="profile-picture"
                    onClick={toggleDropdown}
                    style={{ cursor: "pointer" }}
                  />
                  {isDropdownOpen && (
                    <div
                      className="dropdown-menu open"
                      ref={dropdownRef}
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(85%)",
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        zIndex: 1000,
                        minWidth: "150px",
                      }}
                    >
                      <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                        <li style={{ padding: "8px 16px" }}>
                          <Link to="/home" style={{ textDecoration: "none", color: "#333" }}>
                            الرئيسية
                          </Link>
                        </li>
                        <li style={{ padding: "8px 16px" }}>
                          <Link to="/profile" style={{ textDecoration: "none", color: "#333" }}>
                            حسابي الشخصي
                          </Link>
                        </li>
                        <li style={{ padding: "8px 16px" }}>
                          <Link to="/myt3mem" style={{ textDecoration: "none", color: "#333" }}>
                            تعميماتي
                          </Link>
                        </li>
                        <li style={{ padding: "8px 16px" }}>
                          <Link
                            to="/change-pass"
                            style={{ textDecoration: "none", color: "#333" }}
                          >
                            تعديل كلمة المرور
                          </Link>
                        </li>
                        <li
                          style={{ padding: "8px 16px", cursor: "pointer", color: "#333" }}
                          onClick={handleLogout}
                        >
                          تسجيل خروج
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </>


          )}
        </div>

        <nav className={`nav ${isNavOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link to="/" className="active">الرئيسية</Link>
            </li>
            <li>
              <Link to="/about">من نحن</Link>
            </li>
            <li>
              <Link to="/contact">تواصل معنا</Link>
            </li>
            <li>
              <Link className="login-link-mobile" onClick={() => navigate("/login")}>
                تسجيل الدخول
              </Link>
            </li>
          </ul>
        </nav>

        <div className="user-section">
          {userData ? (
            <div className="profile-menu">
              <div className="profile-info d-flex">
                <div className="icon mt-3">
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="profile-icon mx-1"
                    onClick={toggleDropdown}
                  />
                </div>
                <img
                  src={userData.image}
                  alt="Profile"
                  className="profile-picture"
                  onClick={toggleDropdown}
                />
                {isDropdownOpen && (
                  <div className="dropdown-menu open" ref={dropdownRef}>
                    <ul>
                      <li>
                        <Link to="/profile">حسابي الشخصي</Link>
                      </li>

                      <li>
                        <Link to="/myt3mem">تعميماتي</Link>
                      </li>
                      <li>
                        <Link to="/change-pass">تعديل كلمة المرور</Link>
                      </li>
                      <li onClick={handleLogout}>تسجيل خروج</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <button className="btnn log-btnn" onClick={() => navigate("/login")}>
                تسجيل الدخول
              </button>
              <button className="btnn reg-btnn mx-2" onClick={() => navigate("/register")}>
                تسجيل جديد
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;