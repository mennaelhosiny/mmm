import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faChevronDown, faChevronRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { googleMapsApiKey } from "../../config";

import "./home.css";
import iconSearch from "../images/map icons/search-normal.svg";
import iconMobile from "../images/kind of miss/Frame-3.svg";
import iconFile from "../images/kind of miss/Frame-2.svg";
import iconUser from "../images/kind of miss/Frame-1.svg";
import iconCar from "../images/kind of miss/Frame.svg";
import iconBox from "../images/kind of miss/shopping-bag 1.svg";
import axios from "axios";
import mapArrow from "../images/map icons/Frame 13992.png";
import mapFilter from "../images/map icons/mage_filter-fill.png";
import { type } from "@testing-library/user-event/dist/type";
import mapArrowClose from "../images/map icons/Frame 13993.png";
import { API_BASE_URL } from "../../config";

const Home = () => {
  const [error, setError] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [totalResults, setTotalResults] = useState([]);
  const [results, setResults] = useState([]);
  const [showFullList, setShowFullList] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [roundedImages, setRoundedImages] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);


  const markerRefs = useRef([]);
  const createRoundedImage = (imageUrl, size, borderRadius) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.src = imageUrl;
      img.onload = () => {
        canvas.width = size;
        canvas.height = size;

        // Draw the image with a border radius
        ctx.beginPath();
        ctx.moveTo(borderRadius, 0);
        ctx.lineTo(size - borderRadius, 0);
        ctx.quadraticCurveTo(size, 0, size, borderRadius);
        ctx.lineTo(size, size - borderRadius);
        ctx.quadraticCurveTo(size, size, size - borderRadius, size);
        ctx.lineTo(borderRadius, size);
        ctx.quadraticCurveTo(0, size, 0, size - borderRadius);
        ctx.lineTo(0, borderRadius);
        ctx.quadraticCurveTo(0, 0, borderRadius, 0);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(img, 0, 0, size, size);

        resolve(canvas.toDataURL());
      };
    });
  };

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  const center = {
    lat: 24.7136,
    lng: 46.6753,
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    region: "",
    city: "",
    date: null,
  });

  const [hasFetchedDropdown, setHasFetchedDropdown] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const datePickerRef = useRef(null);
  const navigate = useNavigate();
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const containerRef = useRef(null);
  const [isFilterGroupVisible, setIsFilterGroupVisible] = useState(false);
  const headers = {
    Accept: "application/json",
    password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
    lang: "en"
  };

  const fetchDropdownData = useCallback(async () => {
    try {
      const params = {
        taemem_status: filters.status,
        taemem_type: filters.category,
        location: filters.location,
        regions: filters.region,
        cities: filters.city
      };

      const [categoriesRes, statusesRes, regionsRes, citiesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/taemem-types`, { headers, params }),
        axios.get(`${API_BASE_URL}/api/v1/taemem-status`, { headers, params }),
        axios.get(`${API_BASE_URL}/api/v1/regions`, { headers, params }),
        axios.get(`${API_BASE_URL}/api/v1/cities`, { headers, params }),
      ]);

      setCategories(categoriesRes.data?.data || []);
      setStatuses(statusesRes.data?.data || []);
      setRegions(regionsRes.data?.data || []);
      setCities(citiesRes.data?.data || []);
    } catch (err) {
      console.error("Dropdown fetch error:", err.response?.data || err.message);
      setError("Failed to load dropdown options.");
    }
  }, [filters, headers]);

  const fetchData = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/taemems`, {
        headers,
        params: {
          type: filters.category,
          status: filters.status,
          date: filters.date,
          city_id: filters.city,
          region_id: filters.region,
          limit: itemsPerPage,
          page,
        },
      });

      console.log("API Response:", response.data);

      const newItems = response.data?.data || [];
      if (newItems.length > 0) {
        setItems((prev) => [...prev, ...newItems]);
        setMarkers((prev) => [
          ...prev,
          ...newItems.map((item) => ({
            position: [parseFloat(item.main_location.lat), parseFloat(item.main_location.lng)],
            text: item.title,
            key: item.id,
            images: [item.image],
          })),
        ]);
      }

      if (newItems.length < itemsPerPage) {
        setHasMore(false);
      }

      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError("حدث خطأ أثناء جلب البيانات.");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, filters, itemsPerPage, headers]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 10 && !loading && hasMore) {
        fetchData();
      }
    }
  };

  const applyFilters = () => {
    setPage(1);
    setItems([]);
    setHasMore(true);
    fetchData();
    toggleFilterGroup();
  };

  const toggleFilterGroup = () => {
    setIsFilterGroupVisible(!isFilterGroupVisible);
  };

  useEffect(() => {
    if (!hasFetchedDropdown) {
      fetchDropdownData();
      setHasFetchedDropdown(true);
    }
    if (!hasFetchedData) {
      fetchData();
      setHasFetchedData(true);
    }
  }, [fetchDropdownData, fetchData, hasFetchedDropdown, hasFetchedData]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  const handleButtonClick = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleIconClick = (category) => {
    setSelectedCategory(category);
  };

  const handleContinueClick = () => {
    if (!selectedCategory) {
      alert("حقل نوع التعميم مطلوب.");
      return;
    }

    let targetPath = "";
    let queryParam = "";

    switch (selectedCategory) {
      case "هواتف وأجهزة":
        targetPath = "/deviceDetails";
        queryParam = "taemem_type=2";
        break;
      case "وثائق ومستندات":
        targetPath = "/filesDetails";
        queryParam = "taemem_type=4";
        break;
      case "أشخاص":
        targetPath = "/personDetails";
        queryParam = "taemem_type=1";
        break;
      case "سيارات ومركبات":
        targetPath = "/carsDetails";
        queryParam = "taemem_type=3";
        break;
      case "مصنوعات وأشياء متنوعة":
        targetPath = "/thingsDetails";
        queryParam = "taemem_type=5";
        break;
      default:
        console.error("Invalid category selected");
        return;
    }

    navigate(`${targetPath}?${queryParam}`, { state: { selectedCategory } });
  };

  const handleItemClick = (id) => {
    navigate(`/show-taemem/${id}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDateChange = (date) => {
    setFilters((prev) => ({
      ...prev,
      date,
      page: 1,
    }));
  };

  const CustomPopup = ({ marker, onClose }) => {
    if (!marker) return null;

    return (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -100%)',
          maxWidth: '250px',
          borderRadius: '10px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          backgroundColor: '#fff',
          fontFamily: 'Arial, sans-serif',
          zIndex: 1000,
        }}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={marker.images[0]}
            alt={marker.text}
            style={{ width: '250px', height: '200px', objectFit: 'cover' }}
          />
        </div>
        <div style={{ padding: '10px' }}>
          <h4
            style={{
              margin: '0 0 10px 0',
              fontSize: '16px',
              color: '#333',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {marker.text}
          </h4>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#777' }}>{marker.address}</p>
        </div>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            background: '#fff',
            border: 'none',
            borderRadius: '10%',
            width: '35px',
            height: '35px',
            cursor: 'pointer',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
          }}
        >
          ×
        </button>
      </div>
    );
  };

  if (loadError) return <p>حدث خطأ أثناء تحميل الخريطة</p>;
  if (!isLoaded) return <p>جاري تحميل الخريطة...</p>;

  return (
    <>
      <header className="home" id="home-header">
        <h4 className="title" id="main-title">تعميم</h4>
        <h3 id="subtitle" className="mt-2">منصتك المثلى للعثور على المفقودات والإعلان عن المعثورات</h3>
        <p id="description" className="text-secondary">ساهم في إعادة المفقودات إلى أصحابها</p>

        <button
          className={`add-new-btn ${isPopupVisible ? "active" : ""}`}
          id="add-new-button"
          onClick={handleButtonClick}
        >
          أضف تعميم
          <img
            src={iconSearch}
            alt="Add Icon"
            className="button-icon mx-2"
            id="add-new-icon"
          />
        </button>

        {isPopupVisible && (
          <div className="popup-overlay" id="popup-overlay" onClick={handleClosePopup}>
            <div
              className="popup-content"
              id="popup-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="popup-title">اختر الفئة التي ترغب بالإعلان عنها</h2>
              <p id="popup-subtitle" className="mb-5">
                لمساعدتنا في تقديم إعلانك بشكل أفضل
              </p>

              <div className="popup-icons" id="popup-icons">
                {[
                  { icon: iconMobile, label: "هواتف وأجهزة", id: "1" },
                  { icon: iconFile, label: "وثائق ومستندات", id: "2" },
                  { icon: iconUser, label: "أشخاص", id: "3" },
                  { icon: iconCar, label: "سيارات ومركبات", id: "4" },
                  { icon: iconBox, label: "مصنوعات وأشياء متنوعة", id: "5" },
                ].map(({ icon, label, id }, index) => (
                  <div
                    key={index}
                    id={id}
                    className={`popup-icon-box ${selectedCategory === label ? "selected" : ""}`}
                    onClick={() => handleIconClick(label)}
                  >
                    <img src={icon} alt={`Icon ${index + 1}`} className="icon-img" />
                    <span className="icon-description">{label}</span>
                  </div>
                ))}
              </div>

              <button
                className="follow-button mt-5"
                id="continue-button"
                onClick={handleContinueClick}
                disabled={!selectedCategory}
                style={{
                  backgroundColor: selectedCategory ? "#0000ff" : "#ccc",
                  cursor: selectedCategory ? "pointer" : "not-allowed",
                }}
              >
                متابعة
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="filters-container">
        <h4 className="text-center">استكشف التعميمات</h4>
        <p className="text-center text-secondary">استعرض المفقودات و المعثورات على الخريطة</p>

        <img src={mapFilter} alt="map" onClick={toggleFilterGroup} style={{ cursor: "pointer" }} />

        <div className={`filter-group ${isFilterGroupVisible ? "visible" : ""}`}>
         
          <FontAwesomeIcon icon={faChevronRight} className="filters-mobile" onClick={toggleFilterGroup} style={{marginLeft:"95%"}}/>

          <select name="category" value={filters.category} className="filter-select filter-desc" onChange={handleFilterChange}>
            <option value="">اختر الفئة</option>
            {categories.map((type) => (
              <option key={type.id} value={type.id}>
                {type.title}
              </option>
            ))}
          </select>

          <select name="status" value={filters.status} className="filter-select filter-desc" onChange={handleFilterChange}>
            <option value="">اختر الحالة</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.title}
              </option>
            ))}
          </select>
          <div className="filters-mobile">
            <h4 >الفئة</h4>
            <div className="filter-category">
              {categories.map((type) => (
                <button
                  key={type.id}
                  className={`filters-button ${filters.category === type.id ? "active" : ""}`}
                  onClick={() => handleFilterChange({ target: { name: "category", value: type.id } })}
                >
                  {type.title}
                </button>
              ))}
            </div>

            <h4 >حالة التعميم</h4>
            <div className="filter-status ">
              {statuses.map((status) => (
                <button
                  key={status.id}
                  className={`filters-button ${filters.status === status.id ? "active" : ""}`}
                  onClick={() => handleFilterChange({ target: { name: "status", value: status.id } })}
                  
                >
                  {status.title}
                </button>
              ))}
            </div>
          </div>


          <select name="region" value={filters.region} className="filter-select" onChange={handleFilterChange}>
            <option value="">المنطقة</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>

          <select name="city" value={filters.city} className="filter-select" onChange={handleFilterChange}>
            <option value="">المدينة</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>

          <div className="date-picker-container">
            <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" onClick={() => setIsCalendarOpen(true)} />
            <DatePicker
              selected={filters.date}
              onChange={handleDateChange}
              placeholderText="التاريخ"
              className="filter-select date-picker-input"
              open={isCalendarOpen}
              onClickOutside={() => setIsCalendarOpen(false)}
            />
          </div>

          <button className="filter-button" onClick={applyFilters}>
            ابحث الان
          </button>
        </div>
      </div>

      <div style={{ position: "relative", height: "100vh" }}>
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={center}>
          {markers.map((marker) => (
            <Marker
              key={marker.key}
              position={{ lat: marker.position[0], lng: marker.position[1] }}
              icon={{
                url: roundedImages[marker.key] || marker.images[0],
                scaledSize: new window.google.maps.Size(50, 50),

              }}
              onClick={() => setSelectedMarker(marker)}
            />
          ))}
        </GoogleMap>

        {selectedMarker && (
          <CustomPopup
            marker={selectedMarker}
            onClose={() => setSelectedMarker(null)}
          />
        )}

        <div
          style={{
            position: "absolute",
            top: "6%",
            width: "50px",
            left: showFullList ? "12%" : "",
            display: isMobile ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            cursor: "pointer",
          }}
          className="mobile-toggle-icon"
          onClick={() => setShowFullList(!showFullList)}
        >
          <img
            src={showFullList ? mapArrowClose : mapArrow}
            alt="Toggle List"
          />
        </div>

        <div
          ref={containerRef}
          className="results-list"
          style={{
            position: "absolute",
            top: "10px",
            left:
              window.innerWidth <= 767
                ? showFullList
                  ? "20%"
                  : "96%"
                : "auto",
            width: showFullList ? "80%" : "20%",
            maxHeight: "95%",
            padding: "10px",
            border: "1px solid #ccc",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            zIndex: 1000,
            overflow: "auto",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {items.length > 0 ? (
            items.map((result, idx) => (
              <div
                onClick={() => handleItemClick(result.id)}
                key={idx}
                className={`result-card ${result.taemem_type.name}`}
                style={{
                  position: "relative",
                  display: "flex",
                  overflow: "hidden",
                  alignItems: "center",
                  gap: "10px",
                  padding: "15px",
                  marginBottom: "10px",
                  border: "1px solid rgb(248, 248, 248)",
                  borderRadius: "20px",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 4px #86868633",
                  height: "150px",
                  cursor: "pointer",
                }}
              >
                <span
                  className="ts-ribbon-corner"
                  style={{
                    background:
                      result.taemem_status?.name === "مفقود"
                        ? "green"
                        : result.taemem_status?.name === "معثور"
                          ? "red"
                          : result.taemem_status?.name === "سَرِقة"
                            ? "#004efe"
                            : "gray",
                  }}
                >
                  {result.taemem_status.name}
                </span>
                <img
                  src={result.image || "default-image-url.jpg"}
                  alt={result.title}
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "5px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ flex: "1" }}>
                  <h4
                    style={{
                      fontSize: "14px",
                      margin: "0 0 5px",
                      color: "#333",
                      fontWeight: "bold",
                    }}
                  >
                    {result.title || "No title available"}
                  </h4>
                  <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                    {result.code || "No code available"}
                  </p>
                  <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                    {result.id || "No id available"}
                  </p>
                  <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                    {result.taemem_type.name || "No taemem type available"}
                  </p>
                  <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                    {result.main_location.title || "No location available"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#999" }}>لا توجد نتائج لعرضها</p>
          )}

          {loading && <p>جاري تحميل المزيد...</p>}
          {!hasMore && <p style={{ textAlign: "center", color: "#999" }}>لا يوجد نتائج اخرى</p>}
        </div>
      </div>
    </>
  );
};

export default Home;