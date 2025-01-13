import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const PersonEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [taememStates, setTaememStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    taemem_status: "",
    title: "",
    relationship: "",
    person_name: "",
    image: null,
    gender: "",
    age: "",
    nationality: "",
    weight: "",
    skin_color: "",
    height: "",
    health_condition: "",
    description: "",
    hair_color: "",
    taemem_type: "",
  });

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
            relationship: taemem.relationship || "",
            person_name: taemem.person_name || "",
            image: taemem.image || null,
            gender: taemem.gender || "",
            age: taemem.age || "",
            nationality: taemem.nationality || "",
            weight: taemem.weight || "",
            skin_color: taemem.skin_color || "",
            height: taemem.height || "",
            health_condition: taemem.health_condition || "",
            description: taemem.description || "",
            hair_color: taemem.hair_color || "",
            taemem_type: taemem.taemem_type?.id || "",
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
      setError(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.gender) {
      setError("يرجى تحديد الجنس.");
      return;
    }
  
    if (
      formData.image &&
      typeof formData.image === "object" &&
      !formData.image.type.startsWith("image/")
    ) {
      setError("حقل الصورة يجب أن يكون صورة.");
      return;
    }
  
    try {
      const params = new URLSearchParams(location.search);
      const taemem_id = params.get("taemem_id");
  
      if (!taemem_id) {
        setError("Taemem ID not found in URL");
        return;
      }
  
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("taemem_status", formData.taemem_status);
      formDataToSend.append("taemem_type", formData.taemem_type);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("nationality", formData.nationality);
      formDataToSend.append("gender", formData.gender); 
      formDataToSend.append("height", formData.height);
      formDataToSend.append("weight", formData.weight);
      formDataToSend.append("hair_color", formData.hair_color);
      formDataToSend.append("person_name", formData.person_name);
      formDataToSend.append("skin_color", formData.skin_color);
      formDataToSend.append("health_condition", formData.health_condition);
      formDataToSend.append("relationship", formData.relationship);
  
      if (formData.image && typeof formData.image === "object") {
        formDataToSend.append("image", formData.image);
      }
  
      formDataToSend.append("taemem_id", taemem_id);
  
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
        setError(response.data.error || "Failed to update taemem");
      }
    } catch (err) {
      console.error("Error updating taemem:", err);
      if (err.response && err.response.status === 400) {
        setError(err.response.data.error || "حقل الجنس غير صالح.");
      } else if (err.response && err.response.status === 401) {
        setError("Unauthorized: Please log in again.");
        navigate("/login");
      } else {
        setError("Error updating taemem");
      }
    }
  };

  return (
    <div className="container my-5">
      <style>
        {`
          input::placeholder,
          textarea::placeholder {
            color: #A6A6A6;
            font-weight: 350;
          }
        `}
      </style>
      <h2 className="text-center mb-4">تعديل تفاصيل تعميم الأشخاص</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="taemem_status" className="form-label">نوع الحالة</label>
          <select
            id="taemem_status"
            name="taemem_status"
            className="form-select w-25"
            value={formData.taemem_status}
            onChange={handleChange}
          >
            <option value="">حالة الاعلان</option>
            {taememStates.map((state) => (
              <option key={state.id} value={state.id}>
                {state.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 p-3">
          <h3 className="mb-3">المعلومات الأساسية</h3>
          <div className="row mt-2 p-4 border rounded-5 bg-light">
            <div className="col-md-6">
              <label htmlFor="title" className="form-label">اكتب عنوان التعميم</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                placeholder="مثل: مفقود في موقع الرياض..."
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="relationship" className="form-label">صلة القرابة</label>
              <input
                type="text"
                id="relationship"
                name="relationship"
                className="form-control"
                placeholder="حدد صلة القرابة التي تربطك بالمفقود"
                value={formData.relationship}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="person_name" className="form-label">اسم المفقود</label>
              <input
                type="text"
                id="person_name"
                name="person_name"
                className="form-control"
                placeholder="أدخل اسم الشخص المفقود"
                value={formData.person_name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="add-image" className="form-label">أضف صورة</label>
              <input
                type="file"
                id="add-image"
                className="form-control"
                name="image"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        {/* الصفات الظاهرية */}
        <div className="container mt-5">
          <h3 className="text-end mb-4">الصفات الظاهرية</h3>
          <div className="row p-4 rounded-5 bg-light">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="gender" className="form-label">الجنس</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="male"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="male">ذكر</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="female"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="female">أنثى</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="height" className="form-label">الطول</label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  className="form-control"
                  placeholder="مثال: 175 سم"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="age" className="form-label">عمر الشخص</label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  className="form-control"
                  placeholder="مثال: 20-30"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="nationality" className="form-label">الجنسية</label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  className="form-control"
                  placeholder="مثال: سعودي"
                  value={formData.nationality}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="weight" className="form-label">وزن الشخص</label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  className="form-control"
                  placeholder="مثال: 70-100 كجم"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="skin_color" className="form-label">لون البشرة</label>
                <input
                  type="text"
                  id="skin_color"
                  name="skin_color"
                  className="form-control"
                  placeholder="مثال: لون بني"
                  value={formData.skin_color}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="hair_color" className="form-label">لون الشعر</label>
                <input
                  type="text"
                  id="hair_color"
                  name="hair_color"
                  className="form-control"
                  placeholder="مثال: أسود، بني، أشقر..."
                  value={formData.hair_color}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-12">
                <label htmlFor="health_condition" className="form-label">الحالة الصحية</label>
                <textarea
                  id="health_condition"
                  name="health_condition"
                  className="form-control"
                  rows="2"
                  placeholder="عدد الحالات الصحية المذكورة"
                  value={formData.health_condition}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <label htmlFor="description" className="form-label">الملاحظات والتنبيهات</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  rows="2"
                  placeholder="أضف ملاحظاتك"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* زر التحديث */}
        <div className="text-start">
          <button
            type="submit"
            className="btn px-4 mt-3"
            style={{ color: "#fff", background: "#0000ff" }}
          >
            تحديث التعميم
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonEdit;