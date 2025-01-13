import React, { useState } from "react";
import "./register.css";
import RegisterImage from "../images/Illstrations/Mobile login-pana 1.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { faUser, faPhone, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";

function Register() {
  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
      id_photo: null, 
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      setErrMsg(null);

      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("confirm_password", values.rePassword);
        formData.append("phone_key", "+966"); 
        formData.append("phone", values.phone);
        formData.append("id_photo", values.id_photo);

        const { data } = await axios.post(
          `${API_BASE_URL}/api/v1/register`, 
          formData,
          {
            headers: {
              Accept: "application/json",
              password:"$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
            },
          }
        );

        if (data.is_success === true) {
          setSuccessMsg("تم انشاء الحساب بنجاح");
          setTimeout(() => navigate("/Confirmcode"), 1000);
        }
      } catch (error) {
        setErrMsg(error.response?.data?.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    validate: (values) => {
      const errors = {};

      if (values.name.length < 4 || values.name.length > 10) {
        errors.name = "يجب أن يكون الاسم بين 4 و 10 أحرف.";
      }
      if (!values.email.includes("@") || !values.email.includes(".")) {
        errors.email = "البريد الإلكتروني غير صالح.";
      }
      if (!values.phone.match(/^\d{9}$/)) {
        errors.phone = "يجب أن يتكون رقم الهاتف من 9 أرقام.";
      }
      if (values.password.length < 8) {
        errors.password = "يجب أن تكون كلمة المرور على الأقل 8 أحرف.";
    }
    
      if (values.rePassword !== values.password) {
        errors.rePassword = "كلمتا المرور غير متطابقتين.";
      }
      if (!values.id_photo) {
        errors.id_photo = "الصورة الشخصية مطلوبة.";
      }
      
      return errors;
    },
  });

  return (
    <div className="Register-container">
      <div className="right-section">
        <div className="form-container">
          <h2>إنشاء حساب</h2>
          <form className="register-form" onSubmit={formik.handleSubmit}>
            {/* Name Field */}
            <div className="form-group">
              <label>الاسم</label>
              <div className="input-container">
                <FontAwesomeIcon icon={faUser} className="icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="اكتب اسمك هنا"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <small className="error-msg">{formik.errors.name}</small>
              )}
            </div>

            {/* Phone Field */}
            <div className="form-group">
              <label>رقم الهاتف</label>
              <div className="input-container">
                <FontAwesomeIcon icon={faPhone} className="icon" />
                <input
                  type="text"
                  name="phone"
                  placeholder="اكتب رقم هاتفك هنا"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <div className="flag-code-container">
                  <span className="country-code">+966</span>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg"
                    alt="Saudi Flag"
                    className="flag-icon"
                    style={{ width: "35px", height: "35px", borderRadius: "50%" }}
                  />
                </div>
              </div>
              {formik.touched.phone && formik.errors.phone && (
                <small className="error-msg">{formik.errors.phone}</small>
              )}
            </div>


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
              {formik.touched.email && formik.errors.email && (
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
                  minLength={8} 
              />

              </div>
              {formik.touched.password && formik.errors.password && (
                  <small className="error-msg">{formik.errors.password}</small>
              )}

            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label>تأكيد كلمة المرور</label>
              <div className="input-container">
                <FontAwesomeIcon icon={faLock} className="icon" />
                <input
                  type="password"
                  name="rePassword"
                  placeholder="تأكيد كلمة المرور"
                  value={formik.values.rePassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.rePassword && formik.errors.rePassword && (
                <small className="error-msg">{formik.errors.rePassword}</small>
              )}
            </div>

            {/* ID Photo Field */}
          <div className="form-group">
            <label htmlFor="id_photo">صورة الهوية الوطنية</label>
            <div className="file-input-container">
              <input
                type="file"
                id="id_photo"
                accept="image/*"
                className="file-input"
                onChange={(event) => {
                  if (event.target.files && event.target.files[0]) {
                    formik.setFieldValue("id_photo", event.target.files[0]);
                  }
                }}
              />
              <label htmlFor="id_photo" className="file-label">
                اختر صورة
              </label>
            </div>
            {formik.touched.id_photo && formik.errors.id_photo && (
              <small className="error-msg">{formik.errors.id_photo}</small>
            )}
          </div>




            {/* Error or Success Messages */}
            {errMsg && <p className="error-msg">{errMsg}</p>}
            {successMsg && <p className="success-msg">{successMsg}</p>}

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "جارٍ التحميل..." : "تسجيل حساب"}
            </button>
          </form>

          <p className="form-footer">
            لديك حساب بالفعل؟ <Link to="/">تسجيل دخول</Link>
          </p>
        </div>
      </div>

      <div className="left-section">
        <img src={RegisterImage} alt="Illustration" className="illustration" />
      </div>
    </div>
  );
}

export default Register;



