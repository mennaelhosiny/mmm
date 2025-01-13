  import React, { useState, useEffect } from "react";
  import { Container, Form, Row, Col, Button } from "react-bootstrap";
  import { useNavigate, useLocation } from "react-router-dom";
  import axios from "axios";
  import { API_BASE_URL } from "../../config";

  const FilesDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [taememType, setTaememType] = useState(null);
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
      taemem_status: "",
      title: "",
      image: null,
      description: "",
    });
    const [errors, setErrors] = useState({});

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

    useEffect(() => {
      const fetchStatuses = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_BASE_URL}/api/v1/taemem-status`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("local_token")}`,
              Accept: "application/json",
              password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
              lang: "en",
            },
          });

          if (response.data && response.data.is_success) {
            setStatuses(response.data.data);
          } else {
            setError(response.data.message || "Failed to fetch statuses");
          }
        } catch (err) {
          setError("Error fetching statuses");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchStatuses();
    }, []);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const validateForm = () => {
      const newErrors = {};
      if (!formData.taemem_status) newErrors.taemem_status = "حالة العمل مطلوب";
      if (!formData.title) newErrors.title = "عنوان التعميم مطلوب";
      if (!formData.description) newErrors.description = "الملاحظات مطلوبة";
      return newErrors;
    };

    const handleNavigate = (e) => {
      e.preventDefault();
      const formErrors = validateForm();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
      } else {
        console.log("Form Data:", formData);
        navigate("/nextDetails", { state: formData });
      }
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
      <div className="mt-5 container">
        <h3 className="text-center mb-4">إضافة تفاصيل تعميم الوثائق والمستندات</h3>

        <Row className="justify-content-start mb-3">
          <Col md={3} className="text-start">
            <Form.Select
              aria-label="Select option"
              name="taemem_status"
              value={formData.taemem_status}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="">حالة الاعلان</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.title}
                </option>
              ))}
            </Form.Select>
            {errors.taemem_status && (
              <div className="text-danger">{errors.taemem_status}</div>
            )}
            {loading && <div className="text-muted">Loading statuses...</div>}
            {error && <div className="text-danger">{error}</div>}
          </Col>
        </Row>

        <h5 className="mb-4">المعلومات الأساسية</h5>

        <div className="p-3 border rounded-5 bg-light mb-5">
          <Row>
            <Col md={8} className="mb-3">
              <Form.Group controlId="titleInput">
                <Form.Label>اكتب عنوان التعميم</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="مثال: هناك ساعات مفتوحة من الرياض..."
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
                {errors.title && <div className="text-danger">{errors.title}</div>}
              </Form.Group>
            </Col>

            <Col md={4} className="mb-3">
              <Form.Group controlId="imageInput">
                <Form.Label>أضف صورة</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12} className="mb-3">
              <Form.Group controlId="descriptionTextarea">
                <Form.Label>الملاحظات و التنسيقات</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="أضف ملاحظاتك"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
                {errors.description && (
                  <div className="text-danger">{errors.description}</div>
                )}
              </Form.Group>
            </Col>
          </Row>
        </div>

        <Row className="mt-4 mb-5">
          <Col className="text-start">
            <Button
              className="mb-5"
              style={{ background: "#0000ff" }}
              onClick={handleNavigate}
            >
              التالي
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  export default FilesDetails;
