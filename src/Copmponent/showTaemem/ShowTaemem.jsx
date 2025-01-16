import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./showTaemem.css";
import { faUser, faPhone, faEnvelope, faLocationDot, faPenToSquare, faEye, faHeartbeat, faCalendarAlt, faStickyNote, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { API_BASE_URL, googleMapsApiKey } from "../../config";
import Button from 'react-bootstrap/Button';
import { GoogleMap, Marker, useLoadScript, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
    height: '440px',
    borderRadius: '10px',
};

const center = {
    lat: 24.7136,
    lng: 46.6753,
};

const ShowTaemem = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [taememData, setTaememData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: googleMapsApiKey,
    });

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/v1/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            Accept: 'application/json',
                            password: '$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32',
                            lang: 'en',
                        },
                    }
                );

                if (response.data && response.data.data && response.data.data.id) {
                    setLoggedInUserId(response.data.data.id);
                } else {
                    console.error('User ID not found in the response');
                }
            } catch (err) {
                console.error('Failed to fetch logged-in user data', err);
            }
        };

        fetchLoggedInUser();
    }, []);

    useEffect(() => {
        const fetchTaemem = async () => {
            if (!id) return;

            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/v1/taemems/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            Accept: 'application/json',
                            password: '$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32',
                            lang: 'en',
                        },
                    }
                );
                setTaememData(response.data.data);
            } catch (err) {
                setError('Failed to fetch Taemem data');
            } finally {
                setLoading(false);
            }
        };

        fetchTaemem();
    }, [id]);

    const handleEditClick = () => {
        if (!taememData) return;

        const { taemem_type, id: taemem_id, gender } = taememData;

        let targetPath = '';
        let queryParam = '';

        switch (taemem_type.id) {
            case 1:
                targetPath = "/edit-person";
                queryParam = `taemem_type=1&taemem_id=${taemem_id}&gender=${gender}`;
                break;
            case 2:
                targetPath = "/edit-device";
                queryParam = `taemem_type=2&taemem_id=${taemem_id}`;
                break;
            case 3:
                targetPath = "/edit-cars";
                queryParam = `taemem_type=3&taemem_id=${taemem_id}`;
                break;
            case 4:
                targetPath = "/edit-files";
                queryParam = `taemem_type=4&taemem_id=${taemem_id}`;
                break;
            case 5:
                targetPath = "/edit-things";
                queryParam = `taemem_type=5&taemem_id=${taemem_id}`;
                break;
            default:
                console.error("Invalid taemem_type selected");
                return;
        }

        navigate(`${targetPath}?${queryParam}`);
    };

    const handleEditMapClick = () => {
        if (!taememData || !taememData.main_location) {
            console.error('taememData or main_location is undefined');
            return;
        }
        const mapId = taememData.main_location.id;
        navigate(`/edit-map/${mapId}`);
    };

    const handleEditLocationClick = () => {
        if (!taememData || !taememData.locations || taememData.locations.length === 0) {
            console.error('taememData or locations is undefined or empty');
            return;
        }
        const locationId = taememData.locations[0].id;
        navigate(`/edit-map/${locationId}`);
    };

    const handleDeleteClick = async () => {
        if (!taememData) return;

        const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا التعميم؟");
        if (!confirmDelete) return;

        try {
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                Accept: 'application/json',
                password: '$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32',
                lang: 'en',
            };

            const formData = new FormData();
            formData.append('taemem_id', taememData.id);

            const response = await axios.post(
                `${API_BASE_URL}/api/v1/taemems/delete`,
                formData,
                { headers }
            );

            if (response.data && response.data.is_success) {
                navigate('/home');
            } else {
                setError('فشل في حذف التعميم');
            }
        } catch (err) {
            console.error('Error deleting taemem:', err);
            setError('حدث خطأ أثناء محاولة حذف التعميم');
        }
    };

    const handleDeleteLocation = async (locationId) => {
        console.log('Deleting location with ID:', locationId);
        const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا الموقع؟");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                password: '$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32',
                lang: 'en',
            };

            const response = await axios.post(
                `${API_BASE_URL}/api/v1/taemems/delete-location/${locationId}`,
                null,
                { headers }
            );

            console.log('Delete Location Response:', response.data);

            if (response.data && response.data.is_success) {
                alert('تم حذف الموقع بنجاح');
                setTaememData((prevData) => ({
                    ...prevData,
                    locations: prevData.locations.filter((loc) => loc.id !== locationId),
                }));
            } else {
                alert('فشل في حذف الموقع');
            }
        } catch (error) {
            console.error('Error deleting location:', error);
            alert('حدث خطأ أثناء محاولة حذف الموقع');
        }
    };

    if (loading) {
        return <div>جاري التحميل...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!taememData) {
        return <div>لا يوجد بيانات</div>;
    }

    const handleNavigate = () => {
        if (!taememData?.id) {
            console.error('taememData or taememData.id is undefined');
            return;
        }
        navigate(`/create-location/${taememData.id}`);
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <div className="container mt-3">
            <div className="container mt-3">
                {loggedInUserId === taememData?.user?.id && (
                    <div className="icons d-flex mb-2 mt-5">
                        <FontAwesomeIcon
                            icon={faPenToSquare}
                            style={{ background: "#004efe", color: "#fff", padding: "10px", borderRadius: "7px", cursor: "pointer" }}
                            onClick={handleEditClick}

                        />
                        <FontAwesomeIcon
                            icon={faTrash}
                            style={{ background: "#E0383B", color: "#fff", padding: "10px", borderRadius: "7px" }}
                            className="mx-3"
                            onClick={handleDeleteClick}
                        />
                    </div>
                )}

            </div>
            <div className="main-card">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="col-right">
                            <div className="card-header">
                                <h5>{taememData.taemem_type.name}</h5>
                                <span className='text-secondary'>رقم التعميم: {taememData?.id}</span>                               
                            </div>
                            <div className="d-flex">
                            <div className="image-taemem-mobile" style={{float: 'left',display:"none",maxWidth:"35%"}}>
                                <img src={taememData.image} alt="taemem" width="100%" />
                            </div>
                            <div className="list-group mx-2">
                                
                                <h5><strong>عنوان التعميم:</strong><span className='text-secondary mx-2'>{taememData?.title || 'تفاصيل التعميم'}</span></h5>
                                <h5> <strong>مفقود منذ:</strong><span className='text-secondary mx-2 '>{taememData?.lost_date || 'غير متوفر'}</span> </h5>
                                <h5><strong>آخر مرة شوهد فيها:</strong> <span className='text-secondary mx-2'>{taememData?.locations[0]?.date || 'غير متوفر'}</span></h5>


                                {taememData.taemem_type.id === 1 && (
                                    <>
                                        <h5><strong>العمر:</strong> <span className='text-secondary mx-2'>{taememData?.age || 'غير متوفر'}</span></h5>
                                        <h5><strong>لون البشرة:</strong> <span className='text-secondary mx-2'>{taememData?.skin_color || 'غير متوفر'}</span></h5>
                                        <h5><strong>لون الشعر:</strong> <span className='text-secondary mx-2'>{taememData?.hair_color || 'غير متوفر'}</span></h5>
                                    </>
                                )}

                                {taememData.taemem_type.id === 2 || taememData.taemem_type.id === 3 ? (
                                    <>
                                        <h5><strong>اللون:</strong> <span className='text-secondary mx-2'>{taememData?.color || 'غير متوفر'}</span></h5>
                                        <h5><strong>سنة الصنع:</strong> <span className='text-secondary mx-2'>{taememData?.year_of_manufacture || 'غير متوفر'}</span></h5>
                                        <h5><strong>النوع :</strong> <span className='text-secondary mx-2'>{taememData?.type || 'غير متوفر'}</span></h5>
                                    </>
                                ) : null}

                            </div>
                            </div>
                        </div>

                        <div className="col-left mx-3">
                            <div className="image-taemem">
                                <img src={taememData.image} alt="taemem" width="100%" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="card-char mt-5" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                {taememData.taemem_type.id !== 4 && taememData.taemem_type.id !== 5 && (
                    <div className="card-2 section-card">
                        <h5 className="card-header-2">
                            <FontAwesomeIcon icon={faEye} className="icon" />
                            الصفات الظاهرية
                        </h5>
                        <div className="card-body">
                            <ul className="list-group">
                                {taememData.taemem_type.id === 3 && (
                                    <>
                                        <li>
                                            <strong>الشركة المصنعة :</strong>
                                            <span className="text-secondary mx-2 float-start">
                                                {taememData?.manufacturer || 'غير متوفر'}
                                            </span>
                                        </li>
                                        <li>
                                            <strong>سنة الصنع :</strong>
                                            <span className="text-secondary mx-2 float-start">
                                                {taememData?.year_of_manufacture || 'غير متوفر'}
                                            </span>
                                        </li>
                                        <li>
                                            <strong>رقم اللوحة :</strong>
                                            <span className="text-secondary mx-2 float-start">
                                                {taememData?.plate_number || 'غير متوفر'}
                                            </span>
                                        </li>
                                        <li>
                                            <strong>النوع :</strong>
                                            <span className="text-secondary mx-2 float-start">
                                                {taememData?.type || 'غير متوفر'}
                                            </span>
                                        </li>
                                    </>
                                )}

                                {taememData.taemem_type.id === 2 && (
                                    <>
                                        <li>
                                            <strong>الشركة المصنعة :</strong>
                                            <span className="text-secondary mx-2 float-start">
                                                {taememData?.manufacturer || 'غير متوفر'}
                                            </span>
                                        </li>
                                        <li>
                                            <strong>سنة الصنع :</strong>
                                            <span className="text-secondary mx-2 float-start">
                                                {taememData?.year_of_manufacture || 'غير متوفر'}
                                            </span>
                                        </li>
                                        <li>
                                            <strong>اللون :</strong>
                                            <span className="text-secondary mx-2 float-start">
                                                {taememData?.color || 'غير متوفر'}
                                            </span>
                                        </li>
                                        <li>
                                            <strong>نوع الجهاز :</strong>
                                            <span className="text-secondary mx-2 float-start">
                                                {taememData?.type || 'غير متوفر'}
                                            </span>
                                        </li>
                                    </>
                                )}

                                {taememData.taemem_type.id === 1 && (
                                    <>
                                         <li>
                                        <strong>الجنس:</strong>
                                        <span className="text-secondary mx-2 float-start">
                                            {taememData?.gender === "male"
                                            ? "ذكر"
                                            : taememData?.gender === "female"
                                            ? "أنثى"
                                            : "غير متوفر"}
                                        </span>
                                        </li>
                                        <li>
                                            <strong>اسم المفقود:</strong>
                                            <span className="text-secondary mx-2 float-start">
                                                {taememData?.person_name || 'غير متوفر'}
                                            </span>
                                        </li>
                                        <li>
                                            <strong>العمر:</strong>
                                            <span className="text-secondary mx-2 float-start">
                                                {taememData?.age || 'غير متوفر'}
                                            </span>
                                        </li>
                                        <li>
                                            <strong>لون البشرة:</strong>
                                            <span className="text-secondary mx-2 float-start">
                                                {taememData?.skin_color || 'غير متوفر'}
                                            </span>
                                        </li>
                                        <li>
                                            <strong>لون الشعر:</strong>
                                            <span className="text-secondary mx-2 float-start">
                                                {taememData?.hair_color || 'غير متوفر'}
                                            </span>
                                        </li>
                                        <li>
                                            <strong>طول القامة:</strong>
                                            <span className="text-secondary mx-2 float-start">
                                                {taememData?.height || 'غير متوفر'} سم
                                            </span>
                                        </li>
                                        <li>
                                            <strong>وزن الشخص:</strong>
                                            <span className="text-secondary mx-2 float-start">
                                                {taememData?.weight || 'غير متوفر'} كجم
                                            </span>
                                        </li>
                                        <li>
                                            <strong>العمر:</strong>
                                            <span className="text-secondary mx-2 float-start">
                                                {taememData?.age || 'غير متوفر'}
                                            </span>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                )}

                {taememData.taemem_type.id === 1 && (
                    <div className="card-2 section-card">
                        <h5 className="card-header-2">
                            <FontAwesomeIcon icon={faHeartbeat} className="icon" />
                            الحالة الصحية
                        </h5>
                        <div className="card-body">
                            <p>
                                <span style={{ textAlign: "center" }} className='text-secondary'>
                                    {taememData?.health_condition || 'غير متوفر'}
                                </span>
                            </p>
                        </div>
                    </div>
                )}

                <div className="card-2 section-card">
                    <h5 className="card-header-2">
                        <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
                        تواريخ وأزمنة
                    </h5>
                    <div className="card-body">
                        <ul className="list-group">
                            <li>
                                <strong>تاريخ الفقد:</strong>
                                <span className='text-secondary mx-2 float-start'>{taememData?.main_location.date || 'غير متوفر'}</span>
                            </li>
                            <li>
                                <strong>مفقود منذ:</strong>
                                <span className='text-secondary mx-2 float-start'>{taememData?.lost_date || 'غير متوفر'}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="card-2 section-card">
                    <h5 className="card-header-2">
                        <FontAwesomeIcon icon={faStickyNote} className="icon" />
                        ملاحظات وتسهيلات
                    </h5>
                    <div className="card-body">
                        <p className='text-secondary mx-2'>{taememData?.description || 'لا توجد ملاحظات'}</p>
                    </div>
                </div>
            </div>

            <div className="map-contain d-flex mt-5">
                <div className="location-info-card w-50">
                    <Button
                        variant="link"
                        onClick={handleNavigate}
                        style={{
                            backgroundColor: 'transparent',
                            border: '#66666B 1px solid',
                            color: '#66666B',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            float: 'left',
                        }}
                    >
                        <span>اضافة موقع آخر</span>
                        <FontAwesomeIcon icon={faPlus} className="ms-2 mx-1 mt-1" />
                    </Button>

                    <h6>المواقع و الإحداثيات</h6>

                    <ul className="list-group">
                        <li>
                            <strong className='text-secondary'> <FontAwesomeIcon icon={faLocationDot} className="icon" />المنطقة التي فقد فيها </strong>
                            <br />
                            <strong className='locate'>المدينة:</strong>
                            <span className='text-secondary mx-2'>
                                {taememData?.main_location?.city?.name || 'غير متوفر'}
                            </span>

                            <strong className='locate mx-2'>المنطقة:</strong>
                            <span className='text-secondary'>
                                {taememData?.main_location?.region?.name || 'غير متوفر'}
                            </span>
                            <br />
                            {loggedInUserId === taememData?.user?.id && (
                                <FontAwesomeIcon
                                    icon={faPenToSquare}
                                    className="mx-3"
                                    style={{ color: "#004efe", cursor: "pointer", float: "left" }}
                                    onClick={handleEditMapClick}

                                />
                            )}
                            <strong className='locate'>تاريخ الموقع:</strong>
                            <span className='text-secondary mx-2'>
                                {taememData?.main_location?.date || 'غير متوفر'}
                            </span>
                            <br />
                            <strong className='locate'> الوصف:</strong>
                            <span className='text-secondary mx-2'>
                                {taememData?.main_location?.address || 'غير متوفر'}
                            </span>

                        </li>
                        {taememData?.locations?.map((location) => (
                            <li key={location.id}>
                                <strong className='text-secondary'>
                                    <FontAwesomeIcon icon={faLocationDot} className="icon" />
                                    المنطقة التي شوهد فيها بعد الفقد
                                </strong>
                                <br />
                                <div className="icons d-block mx-3" style={{ float: "left" }}>
                                    {loggedInUserId === taememData?.user?.id && (
                                        <FontAwesomeIcon
                                            icon={faPenToSquare}
                                            style={{ color: "#004efe", cursor: "pointer", display: "block", marginBottom: "10px" }}
                                            onClick={handleEditLocationClick}
                                            disabled={!taememData || !taememData.location}
                                        />
                                    )}

                                    {taememData.locations.map((location) => (
                                        <div key={location.id} className="location-item">
                                        </div>
                                    ))}
                                    {loggedInUserId === taememData?.user?.id && (
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            style={{ color: "#E0383B", cursor: "pointer", display: "block" }}
                                            onClick={() => handleDeleteLocation(location.id)}
                                        />
                                    )}
                                </div>
                                <strong className="">تاريخ الموقع:</strong>
                                <span className="text-secondary mx-2">
                                    {location.date || 'غير متوفر'}
                                </span>
                                <br />

                                <strong >الوصف:</strong>
                                <span className="text-secondary mx-2">
                                    {location.address || 'غير متوفر'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="map w-50">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={10}
                        center={center}
                    >
                        {/* عرض العلامة للموقع الرئيسي */}
                        {taememData?.main_location && (
                            <Marker
                                position={{
                                    lat: parseFloat(taememData.main_location.lat),
                                    lng: parseFloat(taememData.main_location.lng),
                                }}
                                onClick={() => setSelectedLocation(taememData.main_location)}
                            />
                        )}

                        {/* عرض العلامات للمواقع الأخرى */}
                        {Array.isArray(taememData?.locations) &&
                            taememData.locations.map((location) => (
                                <Marker
                                    key={location.id}
                                    position={{
                                        lat: parseFloat(location.lat),
                                        lng: parseFloat(location.lng),
                                    }}
                                    onClick={() => setSelectedLocation(location)}
                                />
                            ))}

                        {/* عرض InfoWindow عند النقر على علامة */}
                        {selectedLocation && (
                            <InfoWindow
                                position={{
                                    lat: parseFloat(selectedLocation.lat),
                                    lng: parseFloat(selectedLocation.lng),
                                }}
                                onCloseClick={() => setSelectedLocation(null)}
                            >
                                <div>
                                    <h6>{selectedLocation.title}</h6>
                                    <p>{selectedLocation.address}</p>
                                    <p>التاريخ: {selectedLocation.date}</p>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </div>
            </div>

            <div className="publisher-card w-50 mt-5 mb-5">
                <h5>ناشر التعميم</h5>
                <ul className="list-group">

                    <li>
                        <strong>الاسم</strong>
                        <p className='text-secondary'>
                            <FontAwesomeIcon icon={faUser} className="icon" />
                            {taememData?.user?.name || 'غير متوفر'}
                        </p>
                    </li>
                    <li>
                        <strong>رقم الهاتف</strong>
                        <p className='text-secondary'>
                            <FontAwesomeIcon icon={faPhone} className="icon" />
                            {taememData?.user?.phone1 ? (
                                <span dir="ltr">
                                    {`${taememData.user.phone1.key}${taememData.user.phone1.number}`}
                                </span>
                            ) : (
                                'غير متوفر'
                            )}
                        </p>
                    </li>

                    <li>
                        <strong>رقم الهاتف</strong>
                        <p className='text-secondary'>
                            <FontAwesomeIcon icon={faPhone} className="icon" />
                            {taememData?.user?.phone2 ? (
                                <span dir="ltr">
                                    {`${taememData.user.phone2.key}${taememData.user.phone2.number}`}
                                </span>
                            ) : (
                                'غير متوفر'
                            )}
                        </p>
                    </li>

                    <li>
                        <strong>البريد الإلكتروني</strong>
                        <p className='text-secondary'>
                            <FontAwesomeIcon icon={faEnvelope} className="icon" />
                            {taememData?.user.email || 'غير متوفر'}
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ShowTaemem;