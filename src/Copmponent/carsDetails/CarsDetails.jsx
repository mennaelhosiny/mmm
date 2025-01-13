import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const CarsDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [taememType, setTaememType] = useState(null);
  const [error, setError] = useState({});
  const [errors, setErrors] = useState({});
  const [taememStates, setTaememStates] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    taemem_status: "",
    title: "",
    image: null,
    manufacturer: "",
    year_of_manufacture: "",
    plateNumber: "",
    color: "",
    description: "",
    taemem_type: "",
    name: "", 
    type: "",
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
      [name]: value,
    }));
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.taemem_status) newErrors.taemem_status = "حالة العمل مطلوبة";
    if (!formData.title) newErrors.title = "عنوان التعميم مطلوب";
    if (!formData.manufacturer) newErrors.manufacturer = "الشركة المصنعة مطلوبة";
    if (!formData.year_of_manufacture) newErrors.year_of_manufacture = "سنة الصنع مطلوبة";
    if (!formData.plateNumber) newErrors.plateNumber = "رقم اللوحة مطلوب";
    if (!formData.color) newErrors.color = "اللون مطلوب";
    if (!formData.description) newErrors.description = "الملاحظات مطلوبة";
    if (!formData.taemem_type) newErrors.taemem_type = "نوع التعميم مطلوب";

    return newErrors;
  };

  const handleNavigate = (e) => {
    e.preventDefault(); 
    validateForm() 

    console.log("Form Data:", formData);  
    navigate("/nextDetails", { state: formData }); 
  };

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">إضافة تفاصيل تعميم سيارات و مركبات</h3>
      <Row className="justify-content-start mb-3">
        <Col md={3} className="text-start">
          <Form.Select
            aria-label="Select taemem_status"
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
          </Form.Select>
          {errors.taemem_status && <div className="text-danger">{errors.taemem_status}</div>}

         
          <input
            type="hidden"
            name="taemem_type"
            value={formData.taemem_type || ""}
            onChange={handleInputChange}
          />
        </Col>
      </Row>

      <h5 className="mb-4">المعلومات الأساسية</h5>    
      <div className="p-4 border rounded-5 bg-light">
        <Row className="mb-3">
           <Col md={6}>
            <Form.Group controlId="name">
              <Form.Label> الاسم </Form.Label>
              <Form.Control
                type="text"
                placeholder="مثال: حادثة سيارات مفتوحة في الرياض..."
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="type">
              <Form.Label>  النوع</Form.Label>
              <Form.Control
                type="text"
                placeholder="مثال: حادثة سيارات مفتوحة في الرياض..."
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              />
              {errors.type && <div className="text-danger">{errors.type}</div>}
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="title">
              <Form.Label>اكتب عنوان التعميم</Form.Label>
              <Form.Control
                type="text"
                placeholder="مثال: حادثة سيارات مفتوحة في الرياض..."
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
              {errors.title && <div className="text-danger">{errors.title}</div>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="image">
              <Form.Label>أضف صورة</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="manufacturer">
              <Form.Label>الشركة المصنعة</Form.Label>
              <Form.Control
                type="text"
                placeholder="مثال: أسد"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleInputChange}
              />
              {errors.manufacturer && <div className="text-danger">{errors.manufacturer}</div>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="year_of_manufacture">
              <Form.Label>سنة الصنع</Form.Label>
              <Form.Control
                type="text"
                placeholder="مثال: 2024"
                name="year_of_manufacture"
                value={formData.year_of_manufacture}
                onChange={handleInputChange}
              />
              {errors.year_of_manufacture && <div className="text-danger">{errors.year_of_manufacture}</div>}
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="plateNumber">
              <Form.Label>اكتب رقم اللوحة</Form.Label>
              <Form.Control
                type="text"
                placeholder="مثال: 23567"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleInputChange}
              />
              {errors.plateNumber && <div className="text-danger">{errors.plateNumber}</div>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="color">
              <Form.Label>اللون</Form.Label>
              <Form.Control
                type="text"
                placeholder="مثال: أبيض"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              />
              {errors.color && <div className="text-danger">{errors.color}</div>}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group controlId="description">
              <Form.Label>الملاحظات و التنسيقات</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="أضف ملاحظاتك"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
              {errors.description && <div className="text-danger">{errors.description}</div>}
            </Form.Group>
          </Col>
        </Row>
      </div>

      <Row className="mt-4 mb-5">
        <Col className="text-start">
          <Button
            style={{ background: "#0000ff" }}
            onClick={handleNavigate}
          >
            التالي
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CarsDetails;
