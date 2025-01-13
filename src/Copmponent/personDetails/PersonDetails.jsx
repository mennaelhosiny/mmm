import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate,useLocation } from 'react-router-dom';
import axios from "axios";
import { API_BASE_URL } from "../../config";

const PersonDetails = () => {
  const navigate = useNavigate(); 
  const location = useLocation();
  const [taememType, setTaememType] = useState(null);
  const [error, setError] = useState({});
   const [taememStates, setTaememStates] = useState([]);
    const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    taemem_status: "",
    title: "",
    relationship: "",
    person_name: "",
    photo: null,
    gender: "",
    age: "",
    nationality: "",
    weight: "",
    skin_color: "",
    height: "",
    health_condition: "",
    description: "",
    hair_color: "",
  });
  
   useEffect(() => {
      const fetchTaememStates = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_BASE_URL}/api/v1/taemem-status`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              password:"$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
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
        const params = new URLSearchParams(location.search);
        const type = params.get("taemem_type");
        setTaememType(type);
      }, [location]);
   
      useEffect(() => {
        if (taememType) {
          setFormData((prevData) => ({
            ...prevData,
            taemem_type: taememType,
          }));
        }
      }, [taememType]);


  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleNavigate = (e) => {
    e.preventDefault();  

    console.log("Form Data:", formData);  
    navigate("/nextDetails", { state: formData }); 
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
      <h2 className="text-center mb-4">إضافة تفاصيل تعميم الأشخاص</h2>
      <form onSubmit={handleNavigate}>
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
              <label htmlFor="photo" className="file-input">أضف صورة</label>
              <input
                type="file"
                id="photo"
                name="photo"
                className="form-control"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

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

        <div className="text-start">
          <button
            type="submit"
            className="btn px-4 mt-3"
            style={{ color: "#fff", background: "#0000ff" }}
          >
            التالي
          </button>
        </div>
</form>

    </div>
  );
};

export default PersonDetails;
