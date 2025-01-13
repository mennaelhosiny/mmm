import React, { useContext, useState } from "react";
import "./login.css";
import loginImage from "../images/Illstrations/Mobile login-pana 1.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import { authContext } from "../../context/authentication";
import { API_BASE_URL } from "../../config";

function Login() {
  const { setToken } = useContext(authContext);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      setIsLoading(true);
      setErrMsg(null);

      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/login`,
        {
          email: values.email,
          password: values.password,
        },
        {
          headers: {
            Accept: "application/json",
            password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32", 
          },
        }
      );

      if (data.is_success === true) {
        localStorage.setItem("token", data.data.token);
        setToken(data.data.token); 
        setSuccessMsg("Welcome back!");
        
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      } else {
        setErrMsg("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error occurred:", error.response?.data?.error || error.message);
      setErrMsg(error.response?.data?.error || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      await handleLogin(values);
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!values.email.includes("@")) {
        errors.email = "Invalid email format";
      }
      if (!values.password || values.password.length < 8) {
        errors.password = "Password must be at least 8 characters.";
      }
      return errors;
    },
  });

  return (
    <div className="login-container">
      <div className="right-section">
        <div className="form-container">
          <h2>تسجيل الدخول إلى حسابك</h2>
          <form className="form" onSubmit={formik.handleSubmit}>
            {/* Email Field */}
            <div className="form-group">
              <label>البريد الإلكتروني</label>
              <div className="input-container">
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="اكتب البريد الإلكتروني هنا"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.errors.email && formik.touched.email && (
                <small className="error-msg">{formik.errors.email}</small>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label>كلمة المرور</label>
              <div className="input-container">
                <FontAwesomeIcon icon={faLock} className="icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="اكتب كلمة المرور هنا"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.errors.password && formik.touched.password && (
                <small className="error-msg">{formik.errors.password}</small>
              )}
            </div>

            <div className="options">
              <div className="remember-me d-flex">
                <input type="checkbox" id="remember" className="mx-1" />
                <label htmlFor="remember" className="mt-1">
                  تذكرني
                </label>
              </div>
              <Link to="/ForgetPass">نسيت كلمة المرور؟</Link>
            </div>

            {/* Error or Success Messages */}
            {errMsg && <p className="error-msg">{errMsg}</p>}
            {successMsg && <p className="success-msg">{successMsg}</p>}

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "جارٍ التحميل..." : "تسجيل الدخول"}
            </button>
          </form>
          <p>
            ليس لديك حساب؟ <Link to="/register">إنشاء حساب</Link>
          </p>
        </div>
      </div>

      <div className="left-section">
        <img src={loginImage} alt="Illustration" className="illustration" />
      </div>
    </div>
  );
}

export default Login;
