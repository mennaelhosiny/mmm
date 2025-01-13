import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import {googleMapsApiKey} from '../../config';
// Google Maps configuration
const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

const libraries = ['places'];

const MapComponent = ({ setLocation, latitude, longitude }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey, 
    libraries,
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  const center = {
    lat: latitude || 24.7136, 
    lng: longitude || 46.6753, 
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={13}
      center={center}
      onClick={(e) => {
        setLocation({
          latitude: e.latLng.lat(),
          longitude: e.latLng.lng(),
        });
      }}
    >
      {latitude && longitude && (
        <Marker position={{ lat: latitude, lng: longitude }} />
      )}
    </GoogleMap>
  );
};

const Nextdescription = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState({
    latitude: 24.7136, // Default latitude
    longitude: 46.6753, // Default longitude
    latitude2: null,
    longitude2: null,
    latitude3: null,
    longitude3: null,
  });
  const [imageFile, setImageFile] = useState(null);
  const prevPage = useLocation();
  const [savedData, setSavedData] = useState(null);
  const [formData, setFormData] = useState(prevPage.state);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');

  const formik = useFormik({
    initialValues: {
      title: '',
      date: '',
      region: '',
      city: '',
      description: '',
      latitude: null,
      longitude: null,
      title2: '',
      date2: '',
      title3: '',
      date3: '',
      description2: '',
      latitude2: null,
      longitude2: null,
      description3: '',
      latitude3: null,
      longitude3: null,
      taememType: '',
    },
    onSubmit: async (values) => {
      if (step === 1) {
        console.log('Step 1 Data:', values);
        setSavedData(values);
        setStep(2);
      } else if (step === 2) {
        console.log('Step 2 Data:', values);
        setSavedData((prev) => ({
          ...prev,
          title2: values.title2,
          date2: values.date2,
          description2: values.description2,
          latitude2: values.latitude2,
          longitude2: values.longitude2,
        }));
        setStep(3);
      } else if (step === 3) {
        console.log('Final Data at Step 3:', values);
        setSavedData((prev) => ({
          ...prev,
          title3: values.title3,
          date3: values.date3,
          description3: values.description3,
          latitude3: values.latitude3,
          longitude3: values.longitude3,
          taemem_type: values.taememType,
        }));

        const data = {
          ...savedData,
          ...values,
          title: savedData?.title || '',
          taemem_status: savedData?.taemem_status || '',
          color: savedData?.color || '',
          type: savedData?.type || '',
          year_of_manufacture: savedData?.year_of_manufacture || '',
          taemem_type: savedData?.year_of_manufacture || '',
          plate_number: savedData?.plate_number || '',
          locations: [
            {
              date: savedData?.date || '',
              city_id: savedData?.city || '',
              region_id: savedData?.region || '',
              title: savedData?.title || '',
              address: savedData?.description || '',
              lat: savedData?.latitude || '',
              lng: savedData?.longitude || '',
            },
            {
              date: savedData?.date2 || '',
              title: savedData?.title2 || '',
              address: savedData?.description2 || '',
              lat: savedData?.latitude2 || '',
              lng: savedData?.longitude2 || '',
            },
            {
              date: savedData?.date3 || '',
              title: savedData?.title3 || '',
              address: savedData?.description3 || '',
              lat: savedData?.latitude3 || '',
              lng: savedData?.longitude3 || '',
            },
          ],
        };

        console.log('All Saved Data:', savedData);
      }
    },
  });

  React.useEffect(() => {
    const storedImage = localStorage.getItem('image');
    if (storedImage) {
      setImageFile(storedImage);
    }
  }, []);

  useEffect(() => {
    console.log('Received Form Data:', formData);
  }, [formData]);

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
        console.log('Regions API response:', response.data);
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
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/cities?region_id=${selectedRegion}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              password: '$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32',
              Accept: 'application/json',
              lang: 'en',
            },
          }
        );
        console.log('Cities API response:', response.data);
        setCities(response.data.data || []);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, [selectedRegion]);

  const postData = async () => {
    console.log('Button clicked, postData function triggered.');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      const imageFile = localStorage.getItem('image');
      if (!imageFile) {
        console.error('No image file found in localStorage');
        alert('Please select an image.');
        return;
      }

      const formDataToPost = new FormData();
      formDataToPost.append('title', formData.title || '');
      formDataToPost.append('taemem_status', formData.taemem_status || '');
      formDataToPost.append('color', formData.color || '');
      formDataToPost.append('type', formData.type || '');
      formDataToPost.append('year_of_manufacture', formData.year || '');
      formDataToPost.append('plate_number', formData.plateNumber || '');
      formDataToPost.append('taemem_type', formData.taemem_type || '');
      formDataToPost.append('description', formData.description || '');
      formDataToPost.append('name', formData.name || '');
      formDataToPost.append('year_of_manufacture', formData.year_of_manufacture || '');
      formDataToPost.append('deviceType', formData.deviceType || '');
      formDataToPost.append('manufacturer', formData.manufacturer || '');
      formDataToPost.append('age', formData.age || '');
      formDataToPost.append('nationality', formData.nationality || '');
      formDataToPost.append('gender', formData.gender || '');
      formDataToPost.append('height', formData.height || '');
      formDataToPost.append('weight', formData.weight || '');
      formDataToPost.append('skin_color', formData.skin_color || '');
      formDataToPost.append('health_condition', formData.health_condition || '');
      formDataToPost.append('hair_color', formData.hair_color || '');
      formDataToPost.append('relationship', formData.relationship || '');
      formDataToPost.append('type', formData.type || '');
      formDataToPost.append('person_name', formData.person_name || '');

      const locations = [
        {
          date: savedData?.date || '',
          city_id: savedData?.city || 1,
          region_id: savedData?.region || 1,
          title: savedData?.title || 'عنوان الموقع الرئيسي',
          address: savedData?.description || 'تفاصيل العنوان',
          lat: savedData?.latitude || 23.8859,
          lng: savedData?.longitude || 45.0792,
        },
        {
          date: savedData?.date2 || '2024-11-12',
          title: savedData?.title2 || 'تفاصيل العنوان 2',
          address: savedData?.description2 || 'تفاصيل العنوان تفاصيل العنوان تفاصيل العنوان',
          lat: savedData?.latitude2 || 50.0792,
          lng: savedData?.longitude2 || 50.0792,
        },
      ];

      locations.forEach((location, index) => {
        Object.entries(location).forEach(([key, value]) => {
          formDataToPost.append(`locations[${index}][${key}]`, value);
        });
      });

      const blob = dataURLtoBlob(imageFile);
      formDataToPost.append('image', blob);

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/taemems/create`,
        formDataToPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            password: '$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32',
            Accept: 'application/json',
            lang: 'en',
          },
        }
      );

      console.log('Response:', response.data);

      if (response.data.is_success) {
        alert('Data posted successfully!');
      } else {
        console.error('API Error:', response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error('Server Error:', error.response.data);
      } else if (error.request) {
        console.error('Network Error:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  const dataURLtoBlob = (dataURL) => {
    const [metadata, base64] = dataURL.split(',');
    const mime = metadata.match(/:(.*?);/)[1];
    const binary = atob(base64);
    const length = binary.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return new Blob([bytes], { type: mime });
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">يرجى ملء التفاصيل التالية</h3>

      {step === 1 && (
        <form onSubmit={formik.handleSubmit} className="bg-light p-4 rounded-5">
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
                placeholder="مثل: مخطط سكني متنوع في الرياض..."
                value={formik.values.title}
                onChange={formik.handleChange}
              />
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
            </div>
          </div>

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
                {Array.isArray(regions) ? (
                  regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))
                ) : (
                  <option disabled>لا توجد مناطق متاحة</option>
                )}
              </select>
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
                disabled={!Array.isArray(cities) || cities.length === 0}
              >
                <option value="">اختر مدينة</option>
                {Array.isArray(cities) ? (
                  cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))
                ) : (
                  <option disabled>لا توجد مدن متاحة</option>
                )}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              أضف تفاصيل الموقع
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              placeholder="مثل: إضافة تفاصيل الموقع..."
              value={formik.values.description}
              onChange={formik.handleChange}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">حدد الموقع على الخريطة</label>
            <div className="border rounded" style={{ height: '300px' }}>
              <MapComponent
                setLocation={(location) => {
                  setLocation(location);
                  formik.setFieldValue('latitude', location.latitude);
                  formik.setFieldValue('longitude', location.longitude);
                }}
                latitude={formik.values.latitude}
                longitude={formik.values.longitude}
              />
            </div>
          </div>

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
              حفظ
            </button>
          </div>
        </form>
      )}

      {step === 2 && savedData && (
        <div>
          <div className="bg-light p-4 rounded-5 mb-3">
            <div className="mb-3 col-md-6">
              <FontAwesomeIcon icon={faLocationDot} style={{ color: '#0000ff' }} className="mx-2" />
              <label htmlFor="">المواقع المضافة</label>
              <input
                type="text"
                className="form-control"
                value={savedData.title}
                readOnly
              />
            </div>
          </div>

          <div className="bg-light p-4 rounded-5">
            <form onSubmit={formik.handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="title2">
                    العنوان
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title2"
                    name="title2"
                    value={formik.values.title2}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">التاريخ</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date2"
                    name="date2"
                    value={formik.values.date2}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">التفاصيل</label>
                <textarea
                  className="form-control"
                  id="description2"
                  name="description2"
                  rows="3"
                  value={formik.values.description2}
                  onChange={formik.handleChange}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">حدد الموقع على الخريطة</label>
                <div className="border rounded" style={{ height: '300px' }}>
                  <MapComponent
                    setLocation={(location) => {
                      formik.setFieldValue('latitude2', location.latitude);
                      formik.setFieldValue('longitude2', location.longitude);
                    }}
                    latitude={formik.values.latitude2}
                    longitude={formik.values.longitude2}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary mx-2"
                  onClick={() => setStep(3)}
                >
                  إضافة موقع آخر
                </button>

                <button
                  type="submit"
                  className="btn btn-primary mx-2"
                  onClick={postData}
                >
                  نشر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {step === 3 && savedData && (
        <div>
          <div className="bg-light p-4 rounded-5 mb-3">
            <div className="mb-3 col-md-6">
              <FontAwesomeIcon icon={faLocationDot} style={{ color: '#0000ff' }} className="mx-2" />
              <label htmlFor="">المواقع المضافة</label>
              <input
                type="text"
                className="form-control"
                value={savedData.title}
                readOnly
              />
              <input
                type="text"
                className="form-control mt-2"
                value={savedData.title2 || formik.values.title2}
                readOnly
              />
            </div>
          </div>

          <div className="bg-light p-4 rounded-5">
            <form onSubmit={formik.handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">العنوان</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title3"
                    name="title3"
                    value={formik.values.title3}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">التاريخ</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date3"
                    name="date3"
                    value={formik.values.date3}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">التفاصيل</label>
                <textarea
                  className="form-control"
                  id="description3"
                  name="description3"
                  rows="3"
                  value={formik.values.description3}
                  onChange={formik.handleChange}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">حدد الموقع على الخريطة</label>
                <div className="border rounded" style={{ height: '300px' }}>
                  <MapComponent
                    setLocation={(location) => {
                      formik.setFieldValue('latitude3', location.latitude);
                      formik.setFieldValue('longitude3', location.longitude);
                    }}
                    latitude={formik.values.latitude3}
                    longitude={formik.values.longitude3}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary mx-2"
                  onClick={() => setStep()}
                >
                  إضافة موقع آخر
                </button>
                <button
                  type="button"
                  className="btn btn-primary mx-2"
                  onClick={postData}
                >
                  نشر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nextdescription;