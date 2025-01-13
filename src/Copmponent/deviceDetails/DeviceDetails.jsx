import React, { useState ,useEffect} from "react";
import { useNavigate,useLocation } from "react-router-dom"; 
import axios from "axios";
import { API_BASE_URL } from "../../config";

function DeviceDetails() {
  const navigate = useNavigate(); 
  const location = useLocation();
  const [taememType, setTaememType] = useState(null);
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

  const handleInputChange = (e) => {   
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };


  const validateForm = () => {
    const newErrors = {};
    if (!formData.status) newErrors.status = "حالة الإعلان مطلوب";
    if (!formData.title) newErrors.title = "عنوان التعميم مطلوب";
    if (!formData.deviceType) newErrors.deviceType = "نوع الجهاز مطلوب";
    if (!formData.manufacturer) newErrors.manufacturer = "الشركة المصنعة مطلوبة";
    if (!formData.year_of_manufacture) newErrors.year_of_manufacture = "سنة الصنع مطلوبة";
    if (!formData.description) newErrors.description = "الملاحظات مطلوبة";  
    if (!formData.name) newErrors.name = "الملاحظات مطلوبة";  
    return newErrors;
  };

  const handleNavigate = (e) => {
    e.preventDefault();  

    console.log("Form Data:", formData);  
    navigate("/nextDetails", { state: formData }); 
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        localStorage.setItem("image", reader.result);
      };

      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4">إضافة تفاصيل تعميم هواتف وأجهزة</h2>
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

          {error.taemem_status && <div className="text-danger">{error.taemem_status}</div>}
        </div>

        {/* Form Title */}
        <h5 className="mb-4">المعلومات الأساسية</h5>
        <form
            className="p-4 bg-light"
            style={{ borderRadius: "30px" }}
            onSubmit={handleNavigate}
          >
            <div className="row g-3">
              {/* Name Input Field */}
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
                {error.name && <div className="text-danger">{error.name}</div>}
              </div>

              {/* Title Input Field */}
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
                {error.title && <div className="text-danger">{error.title}</div>}
              </div>

              {/* Color Input Field */}
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
                {error.color && <div className="text-danger">{error.color}</div>}
              </div>

              {/* Type Input Field */}
              <div className="col-md-6">
                <label htmlFor="type" className="form-label">
                  النوع
                </label>
                <input
                  type="text"
                  id="type"
                  className="form-control"
                  placeholder="أدخل النوع"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                />
                {error.type && <div className="text-danger">{error.type}</div>}
              </div>

              {/* Image Input Field */}
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

              {/* Device Type Input Field */}
              <div className="col-md-6">
                <label htmlFor="device-type" className="form-label">
                  نوع الجهاز
                </label>
                <input
                  type="text"
                  id="device-type"
                  className="form-control"
                  placeholder="مثال: هاتف سامسونج..."
                  name="deviceType"
                  value={formData.deviceType}
                  onChange={handleInputChange}
                />
                {error.deviceType && <div className="text-danger">{error.deviceType}</div>}
              </div>

              {/* Manufacturer Input Field */}
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
                {error.manufacturer && <div className="text-danger">{error.manufacturer}</div>}
              </div>

              {/* Model Year Input Field */}
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
                {error.year_of_manufacture && <div className="text-danger">{error.year_of_manufacture}</div>}
              </div>

              {/* Description Textarea */}
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
                {error.description && <div className="text-danger">{error.description}</div>}
              </div>
            </div>

            <div className="text-start mt-4">
              <button
                type="submit"
                className="btn px-4 text-white"
                style={{ backgroundColor: "#0000ff" }}
                onClick={validateForm}
              >
                التالي
              </button>
            </div>
          </form>


      </div>
    </div>
  );
}

export default DeviceDetails;
