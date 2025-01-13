  import React, { useState } from "react";
  import "./resetPass.css";
  import ResetPassImage from "../images/Illstrations/Reset password-pana 1.svg";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faLock } from "@fortawesome/free-solid-svg-icons";
  import { API_BASE_URL } from "../../config";

  function ResetPass() {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
      password_confirmation: "",
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    const resetPassword = async () => {
      const url = `${API_BASE_URL}/api/v1/reset/password`;
      const headers = {
        Accept: "application/json",
        password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
        lang: "ar",
      };

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      return fetch(url, { method: "POST", headers, body: formDataToSend })
        .then(async (response) => {
          const data = await response.json();
          if (response.ok) {
            return { success: data.message || "تم تحديث كلمة المرور بنجاح" };
          } else {
            throw new Error(data.error || "حدث خطأ أثناء تحديث كلمة المرور");
          }
        })
        .catch((err) => {
          throw new Error("حدث خطأ أثناء الاتصال بالخادم.");
        });
    };


    const handleButtonClick = async () => {
      setError(null);
      setSuccessMessage(null);
      setIsSubmitting(true);

      try {
        const result = await resetPassword();
        setSuccessMessage(result.success);
        setFormData({ email: "", password: "", password_confirmation: "" });
      } catch (error) {
        setError(error.message);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="ResetPass-container">
        <div className="right-section">
          <div className="form-container">
            <img alt="Logo" className="logo" />
            <h2>إعادة تعيين كلمة المرور</h2>
            <p>يرجى إدخال كلمة مرور جديدة لحسابك</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>البريد الإلكتروني</label>
                <div className="input-container">
                  <input
                    type="email"
                    name="email"
                    placeholder="اكتب بريدك الإلكتروني"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>كلمة المرور</label>
                <div className="input-container">
                  <FontAwesomeIcon icon={faLock} className="icon" />
                  <input
                    type="password"
                    name="password"
                    placeholder="اكتب كلمة مرور جديدة"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>إعادة كتابة كلمة المرور</label>
                <div className="input-container">
                  <FontAwesomeIcon icon={faLock} className="icon" />
                  <input
                    type="password"
                    name="password_confirmation"
                    placeholder="أعد كتابة كلمة المرور الجديدة"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {error && <p className="error-message">{error}</p>}
              {successMessage && <p className="success-message">{successMessage}</p>}
              <button
                type="button"
                className="submit-btn"
                onClick={handleButtonClick}
                disabled={isSubmitting}
              >
                {isSubmitting ? "جارٍ التحديث..." : "تحديث كلمة المرور"}
              </button>
            </form>
          </div>
        </div>
        <div className="left-section">
          <img src={ResetPassImage} alt="Illustration" className="illustration" />
        </div>
      </div>
    );
  }

  export default ResetPass;