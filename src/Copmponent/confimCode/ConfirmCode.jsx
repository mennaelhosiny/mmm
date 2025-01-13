import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./confirmCode.css";
import ConfirmCodePhoto from "../images/Illstrations/Forgot password-rafiki 1.svg";
import { API_BASE_URL } from "../../config";

function ConfirmCode() {
  const [code, setCode] = useState(""); 
  const [email, setemail] = useState(""); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate();


  async function handleConfirmCode(event) {
    event.preventDefault(); 
    setError(null); 

    if (!email) {
      setError("Email is not provided. Please try again.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/verify-code`,
        { email, code }, 
        {
          headers: {
            Accept: "application/json",
            password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
            lang: "ar",
          },
        }
      );

      console.log("Verification Successful:", response.data);
      navigate("/login"); 
    } catch (err) {
      console.error("Error verifying code:", err.response ? err.response.data : err.message);
      setError(
        err.response?.data?.error || "Invalid verification code or an error occurred. Please try again."
      );
    }
  }

  return (
    <div className="ConfirmCode-container">
      <div className="right-section">
        <div className="form-container">
          <img alt="Logo" className="logo" />
          <h2>تأكيد البريد الالكتروني</h2>
          <p>
            لقد أرسلنا رمز تحقق مكونا من 6 أرقام إلى بريدك الالكتروني. يرجى إدخال الرمز
            المرسل
          </p>
          <form className="form" onSubmit={handleConfirmCode}>
          <div className="form-group">
              <input
                type="email"
                placeholder=" البريد الالكتروني"
                className="form-input"
                value={email}
                onChange={(e) => setemail(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="أدخل الرمز"
                className="form-input"
                value={code}
                onChange={(e) => setCode(e.target.value)} 
              />
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "#0000ff" }}
                className="forgetPass"
              >
                إعادة إرسال الرمز
              </Link>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit-btn">
              تأكيد
            </button>
          </form>
        </div>
      </div>
      <div className="left-section">
        <img src={ConfirmCodePhoto} alt="Illustration" className="illustration" />
      </div>
    </div>
  );
}

export default ConfirmCode;
