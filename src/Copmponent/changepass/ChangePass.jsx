import React, { useState } from "react";
import "../resetPass/resetPass.css";
import ResetPassImage from "../images/Illstrations/Reset password-pana 1.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../../config";

function ChangePass() {
    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
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
        const url = `${API_BASE_URL}/api/v1/profile/change/password`;
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("لم يتم العثور على رمز الدخول. يرجى تسجيل الدخول مرة أخرى.");
        }

        const headers = {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
            lang: "ar",
        };

        const formDataToSend = new FormData();
        formDataToSend.append("old_password", formData.old_password);
        formDataToSend.append("new_password", formData.new_password);
        formDataToSend.append("confirm_password", formData.confirm_password);

        const response = await fetch(url, {
            method: "POST",
            headers,
            body: formDataToSend,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "حدث خطأ أثناء تحديث كلمة المرور");
        }

        return data;
    };

    const handleButtonClick = async () => {
        setError(null);
        setSuccessMessage(null);
        setIsSubmitting(true);

        try {
            const result = await resetPassword();
            setSuccessMessage(result.message || "تم تحديث كلمة المرور بنجاح");
            setFormData({ old_password: "", new_password: "", confirm_password: "" });
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
                    <h2> تغيير كلمة المرور</h2>
                    <p>يرجى إدخال كلمة مرور جديدة لحسابك</p>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label>كلمة المرور القديمة</label>
                            <div className="input-container">
                                <FontAwesomeIcon icon={faLock} className="icon" />
                                <input
                                    type="password"
                                    name="old_password"
                                    placeholder="أدخل كلمة المرور القديمة"
                                    value={formData.old_password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>كلمة المرور الجديدة</label>
                            <div className="input-container">
                                <FontAwesomeIcon icon={faLock} className="icon" />
                                <input
                                    type="password"
                                    name="new_password"
                                    placeholder="أدخل كلمة المرور الجديدة"
                                    value={formData.new_password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>تأكيد كلمة المرور الجديدة</label>
                            <div className="input-container">
                                <FontAwesomeIcon icon={faLock} className="icon" />
                                <input
                                    type="password"
                                    name="confirm_password"
                                    placeholder="أعد إدخال كلمة المرور الجديدة"
                                    value={formData.confirm_password}
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

export default ChangePass;