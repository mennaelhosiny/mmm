import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_BASE_URL, googleMapsApiKey } from '../../config';

const CreateLocation = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
    });
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState(null);

    console.log('Extracted ID:', id);

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/api/v1/regions`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        password: '$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32',
                        Accept: 'application/json',
                        lang: 'en',
                    },
                });
                setRegions(response.data.data || []);
            } catch (error) {
                console.error('Error fetching regions:', error);
            }
        };

        fetchRegions();
    }, []);

   
    const formik = useFormik({
        initialValues: {
            title: '',
            date: '',
            region: '',
            city: '',
            description: '',
            latitude: null,
            longitude: null,
        },
        validate: (values) => {
            const errors = {};
            if (!values.title) errors.title = 'العنوان مطلوب';
            if (!values.date) errors.date = 'التاريخ مطلوب';
            if (!values.description) errors.description = 'تفاصيل الموقع مطلوبة';
            if (!values.latitude || !values.longitude) errors.location = 'يرجى تحديد الموقع على الخريطة';

            console.log('Validation Errors:', errors); // Debugging
            return errors;
        },
        onSubmit: async (values) => {
            setLoading(true); // Start loading
            try {
                const token = localStorage.getItem('token');

                // Log form values and token
                console.log('Form Values:', values);
                console.log('Token:', token);

                const formData = new FormData();
                formData.append('date', values.date);
                formData.append('city_id', values.city);
                formData.append('region_id', values.region);
                formData.append('title', values.title);
                formData.append('address', values.description);
                formData.append('lat', Number(values.latitude));
                formData.append('lng', Number(values.longitude));
                formData.append('taemem_id', id);

                // Log FormData
                console.log('FormData:', Object.fromEntries(formData.entries()));

                const response = await axios.post(
                    `${API_BASE_URL}/api/v1/taemems/create-location`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/json',
                            password: '$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32',
                            lang: 'en',
                        },
                    }
                );

                // Log API response
                console.log('API Response:', response.data);

                if (response.data && response.data.is_success) {
                    alert('تم إنشاء الموقع بنجاح');
                    navigate('/home');
                } else {
                    alert('فشل في إنشاء الموقع');
                }
            } catch (error) {
                console.error('Error creating location:', error);
                if (error.response) {
                    console.error('API Response:', error.response.data);
                    if (error.response.data.error === 'هذا التعميم لا ينتمي لك') {
                        alert('ليس لديك إذن لإنشاء موقع لهذا التعميم');
                    } else {
                        alert(`حدث خطأ: ${error.response.data.error || 'بيانات غير صالحة'}`);
                    }
                } else {
                    alert('حدث خطأ أثناء محاولة إنشاء الموقع');
                }
            } finally {
                setLoading(false); // Stop loading
            }
        },
    });

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: googleMapsApiKey,
    });

    if (loadError) return <p>حدث خطأ أثناء تحميل الخريطة</p>;
    if (!isLoaded) return <p>جاري تحميل الخريطة...</p>;

    return (
        <div className="container mt-4">
            <h3 className="text-center mb-4">يرجى ملء التفاصيل التالية</h3>

            <form onSubmit={formik.handleSubmit} className="bg-light p-4 rounded-5">
                {/* Title Field */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="title" className="form-label">
                            أضف عنوان الموقع
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.title && <div className="text-danger">{formik.errors.title}</div>}
                    </div>

                    {/* Date Field */}
                    <div className="col-md-6">
                        <label htmlFor="date" className="form-label">
                            أضف تاريخ
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="date"
                            name="date"
                            value={formik.values.date}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.date && <div className="text-danger">{formik.errors.date}</div>}
                    </div>
                </div>

                {/* Description Field */}
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        أضف تفاصيل الموقع
                    </label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="3"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    ></textarea>
                    {formik.errors.description && <div className="text-danger">{formik.errors.description}</div>}
                </div>

                {/* Map Field */}
                <div className="mb-3">
                    <label className="form-label">حدد الموقع على الخريطة</label>
                    <div className="border rounded" style={{ height: '300px' }}>
                        <GoogleMap
                            mapContainerStyle={{ height: '100%', width: '100%' }}
                            center={{ lat: formik.values.latitude || 24.7136, lng: formik.values.longitude || 46.6753 }}
                            zoom={13}
                            onClick={(e) => {
                                const lat = e.latLng.lat();
                                const lng = e.latLng.lng();
                                setLocation({ latitude: lat, longitude: lng });
                                formik.setFieldValue('latitude', lat);
                                formik.setFieldValue('longitude', lng);
                            }}
                        >
                            {formik.values.latitude && formik.values.longitude && (
                                <Marker
                                    position={{ lat: formik.values.latitude, lng: formik.values.longitude }}
                                />
                            )}
                        </GoogleMap>
                    </div>
                    {formik.errors.location && <div className="text-danger">{formik.errors.location}</div>}
                </div>

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between align-items-center">
                    <button
                        type="button"
                        className="btn"
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#0000ff',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate(-1)}
                    >
                        <FontAwesomeIcon icon={faChevronRight} className="ms-2 mt-1" />
                        رجوع
                    </button>
                    <button
                        type="submit"
                        className="btn text-white"
                        style={{ background: '#0000ff' }}
                        disabled={loading}
                    >
                        {loading ? 'جاري الإنشاء...' : 'إنشاء الموقع'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateLocation;