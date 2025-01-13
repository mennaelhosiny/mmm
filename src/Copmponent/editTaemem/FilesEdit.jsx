import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const FilesEdit = () => {
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
    taemem_type: "",
  });
  const [errors, setErrors] = useState({});

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
              Accept: "application/json",
              password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
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
            description: taemem.description || "",
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
    const fetchStatuses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/v1/taemem-status`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        setError("الملف المحدد ليس صورة صالحة. يرجى تحميل صورة بصيغة JPEG أو PNG أو GIF.");
        return;
      }

      // Check file size (e.g., limit to 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("حجم الصورة كبير جدًا. الحد الأقصى لحجم الصورة هو 5MB.");
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
      setError(""); // Clear any previous errors
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.taemem_status) newErrors.taemem_status = "حالة العمل مطلوب";
    if (!formData.title) newErrors.title = "عنوان التعميم مطلوب";
    if (!formData.description) newErrors.description = "الملاحظات مطلوبة";
    if (!formData.image) newErrors.image = "الصورة مطلوبة"; // Add this if the image is required
    return newErrors;
  };

  const handleNavigate = async (e) => {
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
      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image); // Append the image file
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
        setError("Failed to update taemem");
      }
    } catch (err) {
      console.error("Error updating taemem:", err);
      if (err.response && err.response.status === 401) {
        setError("حاول مره اخري.");
        navigate("/login");
      } else {
        setError("Error updating taemem");
      }
    }
  };

  return (
    <div className="mt-5 container">
      <h3 className="text-center mb-4">تعديل تفاصيل تعميم الوثائق والمستندات</h3>

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
              {errors.image && <div className="text-danger">{errors.image}</div>}
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
            تحديث التعميم
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default FilesEdit;