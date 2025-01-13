import React, { useState } from "react";
import imageContact from "../../Copmponent/images/Illstrations/Layer_1.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "./contact.css";
import { API_BASE_URL } from "../../config";

const ContactInfoItem = ({ icon, title, content }) => (
  <div className="info-item">
    <FontAwesomeIcon icon={icon} className="icon" />
    <h5>{title}</h5>
    <p>{content}</p>
  </div>
);

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/contact-us`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
          lang: "ar",
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || "تم إرسال رسالتك بنجاح");
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        setError(data.error || "حدث خطأ أثناء إرسال الرسالة");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالخادم.");
    }
  };

  return (
    <div className="contact-us-container">
      <div className="about-us-section about-head">
        <div className="text-center">
          <div className='text-aboutus'>
            <h2 className="text-center text-white">تواصل معنا </h2>
            <p className='text-white m-auto mb-5' >
            نحن هنا لمساعدتك. تواصل معنا لأي استفسار.
            </p>
          </div>
        </div>
        </div>
      <div className="about-us-section">
        <div className="form-and-image">
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">الاسم</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="أدخل اسمك هنا"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
                minLength="3"
              />
              <FontAwesomeIcon icon={faUser} className="icon-input" />
            </div>

            <div className="form-group">
              <label htmlFor="phone">رقم الهاتف</label>
              <input
                type="number"
                name="phone"
                id="phone"
                placeholder="أدخل رقم هاتفك هنا"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="\d{10,15}"
              />
              <FontAwesomeIcon icon={faPhone} className="icon-input" />
            </div>

            <div className="form-group">
              <label htmlFor="email">البريد الالكتروني</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="أدخل بريدك الإلكتروني هنا"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <FontAwesomeIcon icon={faEnvelope} className="icon-input" />
            </div>

            <div className="form-group">
              <label htmlFor="message">نص الرسالة</label>
              <textarea
                name="message"
                id="message"
                placeholder="أدخل رسالتك"
                className="form-textarea"
                value={formData.message}
                onChange={handleChange}
                required
                minLength="10"
              ></textarea>
            </div>

            <div aria-live="polite">
              {error && <p className="error-message">{error}</p>}
              {successMessage && <p className="success-message">{successMessage}</p>}
            </div>

            <button type="submit" className="form-button">
              إرسل الآن
            </button>
          </form>

          <div className="icon-section">
            <img src={imageContact} alt="Contact Illustration" />
          </div>
        </div>
      </div>

      <div className="contact-info">
       <div className="mail">
       <ContactInfoItem
          icon={faEnvelope}
          title="البريد الإلكتروني:"
          content="test@example.com"
        />
       </div>
        <div className="phone">
        <ContactInfoItem
          icon={faPhone}
          title="رقم التواصل:"
          content="+966 123456789"
        />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
