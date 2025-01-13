import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

function DeviceEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const [taememStates, setTaememStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const [formData, setFormData] = useState({
    taemem_status: "",
    title: "",
    image: null,
    deviceType: "",
    manufacturer: "",
    year_of_manufacture: "",
    description: "",
    taemem_type: "",
    name: "",
    color: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTaememStates = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/v1/taemem-status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
            Accept: "application/json",
            lang: "ar",
          },
        });

        if (response.data && response.data.is_success) {
          setTaememStates(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch taemem states");
        }
      } catch (err) {
        setError("Error fetching taemem states");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTaememStates();
  }, []);

  useEffect(() => {
    const fetchTaememData = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const taemem_id = params.get("taemem_id");
  
        if (!taemem_id) {
          setError("Taemem ID not found in URL");
          return;
        }
  
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/taemems/${taemem_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
              Accept: "application/json",
              lang: "en",
            },
          }
        );
  
        if (response.data && response.data.is_success) {
          const taemem = response.data.data;
  
          setFormData({
            taemem_status: taemem.taemem_status?.id || "",
            title: taemem.title || "",
            image: taemem.image || null,
            deviceType: taemem.type || "",
            manufacturer: taemem.manufacturer || "",
            year_of_manufacture: taemem.year_of_manufacture || "",
            description: taemem.description || "",
            taemem_type: taemem.taemem_type?.id || "",
            name: taemem.name || "",
            color: taemem.color || "",
          });
        } else {
          setError("Failed to fetch taemem data");
        }
      } catch (err) {
        setError("Error fetching taemem data");
        console.error(err);
      }
    };
  
    fetchTaememData();
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        setError("الملف المحدد ليس صورة صالحة. يرجى تحميل صورة بصيغة JPEG أو PNG أو GIF.");
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        image: file, 
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.taemem_status) newErrors.taemem_status = "حالة الإعلان مطلوب";
    if (!formData.title) newErrors.title = "عنوان التعميم مطلوب";
    if (!formData.deviceType) newErrors.deviceType = "نوع الجهاز مطلوب";
    if (!formData.manufacturer) newErrors.manufacturer = "الشركة المصنعة مطلوبة";
    if (!formData.year_of_manufacture) newErrors.year_of_manufacture = "سنة الصنع مطلوبة";
    if (!formData.description) newErrors.description = "الملاحظات مطلوبة";
    if (!formData.name) newErrors.name = "الاسم مطلوب";
    if (!formData.color) newErrors.color = "اللون مطلوب";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
  
    try {
      const params = new URLSearchParams(location.search);
      const taemem_id = params.get("taemem_id");
  
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("taemem_status", formData.taemem_status);
      formDataToSend.append("taemem_type", formData.taemem_type);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("taemem_id", taemem_id);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("color", formData.color);
      formDataToSend.append("device_type", formData.deviceType);
      formDataToSend.append("manufacturer", formData.manufacturer);
      formDataToSend.append("year_of_manufacture", formData.year_of_manufacture);
      formDataToSend.append("type", formData.type);
      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }
  
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
        Accept: "application/json",
        lang: "en",
      };
  
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/taemems/edit`,
        formDataToSend,
        { headers }
      );
  
      if (response.data && response.data.is_success) {
        navigate("/home", { state: formData });
      } else {
        setError(response.data.message || "Failed to update taemem");
      }
    } catch (err) {
      console.error("Error updating taemem:", err);
      if (err.response && err.response.status === 401) {
        setError("Unauthorized: Please log in again.");
        navigate("/login");
      } else {
        setError("Error updating taemem");
      }
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4">تعديل تفاصيل تعميم هواتف وأجهزة</h2>
      <div className="p-4">
        <div className="mb-3">
          <label htmlFor="general-dropdown" className="form-label">
            حالة الإعلان
          </label>
          <select
            id="general-dropdown"
            className="form-select w-25"
            name="taemem_status"
            value={formData.taemem_status}
            onChange={handleInputChange}
          >
            <option value="">حالة الاعلان</option>
            {taememStates.map((state) => (
              <option key={state.id} value={state.id}>
                {state.title}
              </option>
            ))}
          </select>
          {errors.taemem_status && <div className="text-danger">{errors.taemem_status}</div>}
        </div>

        <h5 className="mb-4">المعلومات الأساسية</h5>
        <form className="p-4 bg-light" style={{ borderRadius: "30px" }} onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">
                الاسم
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="أدخل اسمك..."
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="taemem-title" className="form-label">
                اكتب عنوان التعميم
              </label>
              <input
                type="text"
                id="taemem-title"
                className="form-control"
                placeholder="مثال: مواصفات مفقودة في الأجهزة..."
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
              {errors.title && <div className="text-danger">{errors.title}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="color" className="form-label">
                اللون
              </label>
              <input
                type="text"
                id="color"
                className="form-control"
                placeholder="أدخل اللون"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              />
              {errors.color && <div className="text-danger">{errors.color}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="type" className="form-label">
                النوع
              </label>
              <input
                type="text"
                id="type"
                className="form-control"
                placeholder="أدخل النوع"
                name="deviceType"
                value={formData.deviceType}
                onChange={handleInputChange}
              />
              {errors.deviceType && <div className="text-danger">{errors.deviceType}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="add-image" className="form-label">
                أضف صورة
              </label>
              <input
                type="file"
                id="add-image"
                className="form-control"
                name="image"
                onChange={handleFileChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="manufacturer" className="form-label">
                الشركة المصنعة
              </label>
              <input
                type="text"
                id="manufacturer"
                className="form-control"
                placeholder="مثال: أبل..."
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleInputChange}
              />
              {errors.manufacturer && <div className="text-danger">{errors.manufacturer}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="model-year" className="form-label">
                سنة الصنع
              </label>
              <input
                type="text"
                id="model-year"
                className="form-control"
                placeholder="مثال: 2024..."
                name="year_of_manufacture"
                value={formData.year_of_manufacture}
                onChange={handleInputChange}
              />
              {errors.year_of_manufacture && <div className="text-danger">{errors.year_of_manufacture}</div>}
            </div>

            <div className="col-12">
              <label htmlFor="description" className="form-label">
                الملاحظات والتفصيلات
              </label>
              <textarea
                id="description"
                className="form-control"
                rows="4"
                placeholder="أضف ملاحظاتك..."
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
              {errors.description && <div className="text-danger">{errors.description}</div>}
            </div>
          </div>

          <div className="text-start mt-4">
            <button
              type="submit"
              className="btn px-4 text-white"
              style={{ backgroundColor: "#0000ff" }}
            >
              تحديث التعميم
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeviceEdit;