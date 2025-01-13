import React from "react";
import "./footer.css"; // Import the CSS file for styling
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faFacebook, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Social Media Section */}
   

        {/* Links Section */}
        <div className="footer-column footer-links">
          <a href="/">الرئيسية</a>
          <a href="/about">من نحن</a>
          <a href="/contact">تواصل معنا</a>
        </div>

        <div className="footer-column footer-links">
          <a href="/map">الخريطة</a>
          <a href="/lost-items">الإعلان عن مفقودات</a>
          <a href="/contents">الإعلان عن محتويات</a>
        </div>

        <div className="footer-column footer-links">
          <a href="/terms">الشروط والأحكام</a>
          <a href="/privacy-policy">سياسة الخصوصية</a>
        </div>
        <div className="footer-column footer-social">
          <p>تابعنا على منصات التواصل الاجتماعي</p>
          <div className="social-icons">
            <Link to="#" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} />
            </Link>
            <Link to="#" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} />
            </Link>
            <Link to="#" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </Link>
            <Link to="#" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faYoutube} />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-copyright">
        <hr />
        <p>© جميع الحقوق محفوظة 2024</p>
      </div>
    </footer>
  );
};

export default Footer;
