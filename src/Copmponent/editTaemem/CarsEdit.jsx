import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const CarsEdit = () => {
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
    plate_number: "",
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
            manufacturer: taemem.manufacturer || "",
            year_of_manufacture: taemem.year_of_manufacture || "",
            plate_number: taemem.plate_number || "",
            color: taemem.color || "",
            description: taemem.description || "",
            taemem_type: taemem.taemem_type?.id || "",
            name: taemem.name || "",
            type: taemem.type || "",
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

    if (!formData.taemem_status) newErrors.taemem_status = "حالة العمل مطلوبة";
    if (!formData.title) newErrors.title = "عنوان التعميم مطلوب";
    if (!formData.manufacturer) newErrors.manufacturer = "الشركة المصنعة مطلوبة";
    if (!formData.year_of_manufacture) newErrors.year_of_manufacture = "سنة الصنع مطلوبة";
    if (!formData.plate_number) newErrors.plate_number = "رقم اللوحة مطلوب";
    if (!formData.color) newErrors.color = "اللون مطلوب";
    if (!formData.description) newErrors.description = "الملاحظات مطلوبة";
    if (!formData.taemem_type) newErrors.taemem_type = "نوع التعميم مطلوب";

    return newErrors;
  };

  const handleNavigate = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const params = new URLSearchParams(location.search);
        const taemem_id = params.get("taemem_id");

        if (!taemem_id) {
          setError("Taemem ID not found in URL");
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("taemem_id", taemem_id);
        formDataToSend.append("taemem_status", formData.taemem_status);
        formDataToSend.append("title", formData.title);
        formDataToSend.append("manufacturer", formData.manufacturer);
        formDataToSend.append("year_of_manufacture", formData.year_of_manufacture);
        formDataToSend.append("plate_number", formData.plate_number);
        formDataToSend.append("color", formData.color);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("taemem_type", formData.taemem_type);
        formDataToSend.append("name", formData.name);
        formDataToSend.append("type", formData.type);

        if (formData.image instanceof File) {
          formDataToSend.append("image", formData.image);
        }

        const response = await axios.post(
          `${API_BASE_URL}/api/v1/taemems/edit`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
              Accept: "application/json",
              lang: "en",
              "Content-Type": "multipart/form-data", 
            },
          }
        );

        if (response.data && response.data.is_success) {
          alert("تم تعديل البيانات بنجاح");
          navigate("/home", { state: formData });
        } else {
          setError(response.data.message || "Failed to update taemem");
        }
      } catch (err) {
        setError("Error updating taemem");
        console.error(err);
      }
    }
  };
  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">تعديل تفاصيل تعميم سيارات و مركبات</h3>
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
              <Form.Label> النوع</Form.Label>
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
            <Form.Group controlId="plate_number">
              <Form.Label>اكتب رقم اللوحة</Form.Label>
              <Form.Control
                type="text"
                placeholder="مثال: 23567"
                name="plate_number"
                value={formData.plate_number}
                onChange={handleInputChange}
              />
              {errors.plate_number && <div className="text-danger">{errors.plate_number}</div>}
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
            تحديث التعميم      
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CarsEdit;