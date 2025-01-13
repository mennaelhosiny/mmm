import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [locationData, setLocationData] = useState(null);

  console.log('Extracted ID:', id);

  const fetchLocationData = async (mapId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/v1/taemems/location-data/${mapId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          password: '$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32',
          Accept: 'application/json',
          lang: 'en',
        },
      });
      console.log('Location Data:', response.data);
      setLocationData(response.data.data);
      formik.setValues({
        ...formik.values,
        title: response.data.data.title || '',
        date: response.data.data.date || '',
        region: response.data.data.region?.id || '',
        city: response.data.data.city?.id || '',
        description: response.data.data.address || '',
        latitude: parseFloat(response.data.data.lat) || null,
        longitude: parseFloat(response.data.data.lng) || null,
      });
      setSelectedRegion(response.data.data.region?.id || null);
    } catch (error) {
      console.error('Error fetching location data:', error);
      setError('Failed to fetch location data');
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedRegion) return;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/v1/cities?region_id=${selectedRegion}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            password: '$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32',
            Accept: 'application/json',
            lang: 'en',
          },
        });
        setCities(response.data.data || []);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, [selectedRegion]);

  useEffect(() => {
    if (!id) {
      console.error('No ID provided in the URL');
      return;
    }
    fetchLocationData(id);
  }, [id]);

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
      if (!values.region) errors.region = 'المنطقة مطلوبة';
      if (!values.city) errors.city = 'المدينة مطلوبة';
      if (!values.description) errors.description = 'تفاصيل الموقع مطلوبة';
      if (!values.latitude || !values.longitude) errors.location = 'يرجى تحديد الموقع على الخريطة';
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('date', values.date);
        formData.append('city_id', values.city);
        formData.append('region_id', values.region);
        formData.append('title', values.title);
        formData.append('address', values.description);
        formData.append('lat', Number(values.latitude));
        formData.append('lng', Number(values.longitude));
        formData.append('location_id', id);

        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        const response = await axios.post(
          `${API_BASE_URL}/api/v1/taemems/edit-location`,
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

        console.log('Edit Location Response:', response.data);

        if (response.data && response.data.is_success) {
          alert('تم تحديث الموقع بنجاح');
          navigate('/home');
        } else {
          alert('فشل في تحديث الموقع');
        }
      } catch (error) {
        console.error('Error updating location:', error);
        if (error.response) {
          console.error('API Response:', error.response.data);
          if (error.response.data.error === 'هذا التعميم لا ينتمي لك') {
            alert('ليس لديك إذن لتعديل هذا التعميم');
          } else {
            alert(`حدث خطأ: ${error.response.data.error || 'بيانات غير صالحة'}`);
          }
        } else {
          alert('حدث خطأ أثناء محاولة تحديث الموقع');
        }
      }
    },
  });

  const LocationMarker = ({ setLocation }) => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLocation({ latitude: lat, longitude: lng });
        formik.setFieldValue('latitude', lat);
        formik.setFieldValue('longitude', lng);
      },
    });

    return null;
  };

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">يرجى ملء التفاصيل التالية</h3>

      <form onSubmit={formik.handleSubmit} className="bg-light p-4 rounded-5">
        {/* Form Fields */}
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

        {/* Region and City Selection */}
        {locationData && locationData.is_main === 1 && (
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="region" className="form-label">
                المنطقة
              </label>
              <select
                className="form-select"
                id="region"
                name="region"
                value={formik.values.region}
                onChange={(e) => {
                  const regionId = e.target.value;
                  formik.setFieldValue('region', regionId);
                  setSelectedRegion(regionId);
                }}
              >
                <option value="">اختر منطقة</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
              {formik.errors.region && <div className="text-danger">{formik.errors.region}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="city" className="form-label">
                المدينة
              </label>
              <select
                className="form-select"
                id="city"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                disabled={!selectedRegion}
              >
                <option value="">{selectedRegion ? 'اختر مدينة' : 'يرجى اختيار منطقة أولاً'}</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              {formik.errors.city && <div className="text-danger">{formik.errors.city}</div>}
            </div>
          </div>
        )}

        {/* Description and Map */}
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

        <div className="mb-3">
          <label className="form-label">حدد الموقع على الخريطة</label>
          <div className="border rounded" style={{ height: '300px' }}>
            <MapContainer
              center={[formik.values.latitude || 24.7136, formik.values.longitude || 46.6753]}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker setLocation={setLocation} />
              {formik.values.latitude && formik.values.longitude && (
                <Marker position={[formik.values.latitude, formik.values.longitude]}>
                  <Popup>موقعك الحالي</Popup>
                </Marker>
              )}
            </MapContainer>
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
          <button type="submit" className="btn text-white" style={{ background: '#0000ff' }}>
            تحديث الموقع
          </button>
        </div>
      </form>
    </div>
  );
};

export default MapEdit;