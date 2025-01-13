import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./forgetPass.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import forgetPassPhoto from "../images/Illstrations/Forgot password-rafiki 1.svg"

function ForgetPass() {


  return (<div className="ForgetPass-container">
     <div className="right-section">
      <div className="form-container">
        <img
          
          alt="Logo"
          className="logo"
        />
        <h2> نسيت كلمة المرور؟</h2>
        <p>لا تقلق سنرسل إليك رابط إعادة تعيين كلمة المرور</p>
        <form>
          <div className="form-group">
            <label>البريد الإلكتروني</label>
              <div className="input-container">
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                <input type="email" placeholder="اكتب البريد الإلكتروني هنا" />
              </div>
          </div>
         
          <Link to="/confirmCode" >  
              <button type="button" className="submit-btn">التالي
            </button>
        </Link>


        </form>
       
      </div>
    </div>
    <div className="left-section">
      <img
        src={forgetPassPhoto}
        alt="Illustration"
        className="illustration"
      />
    </div>
   
  </div>
  );
}

export default ForgetPass;
