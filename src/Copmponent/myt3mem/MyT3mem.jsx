import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCalendarAlt, faTags, faCircle ,faSearch} from "@fortawesome/free-solid-svg-icons";
import emptyImage from "../images/Illstrations/Empty-pana 1.svg";
import "react-datepicker/dist/react-datepicker.css";
import "./myT3mem.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

const MyT3mem = () => {
  const [statuses, setStatuses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ category: "", status: "", date: null });
  const [taemems, setTaemems] = useState([]);
  const [displayedCount, setDisplayedCount] = useState(9);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const typesResponse = await axios.get(`${API_BASE_URL}/api/v1/taemem-types`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
          password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
          lang: "en",
        },
      });
      const statusesResponse = await axios.get(`${API_BASE_URL}/api/v1/taemem-status`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
          password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
          lang: "en",
        },
      });

      setCategories(typesResponse.data.data || []);
      setStatuses(statusesResponse.data.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Failed to fetch data");
      console.error("Error fetching data:", error);
    }
  };

  const fetchTaemems = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        limit: 15,
        page: page,
        city_id: filters.city_id || undefined,
        region_id: filters.region_id || undefined,
        ...(filters.category && { type: filters.category }),
        ...(filters.status && { status: filters.status }),
        ...(filters.date && { date: filters.date.toISOString().split("T")[0] }),
      };

      const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null));

      const taememsResponse = await axios.get(`${API_BASE_URL}/api/v1/taemems/my`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
          password: "$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
          lang: "en",
        },
        params: cleanParams,
      });

      if (taememsResponse.data && taememsResponse.data.is_success) {
        setTaemems((prevTaemems) => [
          ...prevTaemems,
          ...taememsResponse.data.data || [],
        ]);
      } else {
        setError("No results found or invalid filters.");
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Failed to fetch taemems");
      console.error("Error fetching taemems:", error);
    }
  };

  const handleItemClick = (id) => {
    navigate(`/show-taemem/${id}`);
  };
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleDateChange = (date) => {
    setFilters((prevFilters) => ({ ...prevFilters, date: date }));
  };

  const applyFilters = () => {
    setTaemems([]);
    setDisplayedCount(9);
    setCurrentPage(1);
    fetchTaemems(1);
  };

  const loadMore = () => {
    setCurrentPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchTaemems(nextPage);
      return nextPage;
    });
    setDisplayedCount((prevCount) => prevCount + 9);
  };

  useEffect(() => {
    fetchData();
    fetchTaemems();
  }, []);

  return (
    <div>
      <h2 className="text-center mt-5">تعميماتي</h2>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {taemems.length > 0 && (
        <div className="filters-container" style={{ boxShadow: "none" }}>
          <div className="filter-group">
            <select
              name="category"
              value={filters.category}
              className="filter-select"
              onChange={handleFilterChange}
            >
              <option value="">اختر الفئة</option>
              {categories.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.title}
                </option>
              ))}
            </select>

            <select
              name="status"
              className="filter-select"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">اختر الحالة</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.title}
                </option>
              ))}
            </select>

            <div className="date-picker-container">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="calendar-icon"
                onClick={() => setIsCalendarOpen(true)}
              />
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
      )}

      <div className="taemem-list">
        {taemems.length > 0 ? (
          <div>
            <div className="taemem-grid mb-5">
              {taemems.slice(0, displayedCount).map((taemem) => (
                <div
                  key={taemem.id}
                  className="taemem-card"
                  onClick={() => handleItemClick(taemem.id)}
                  style={{ cursor: "pointer" }} 
                >
                  <div className="image">
                    <img src={taemem.image} alt={taemem.title} className="taemem-card-image" />
                  </div>
                  <div className="taemem-card-details">
                    {/* <p>{taemem.id}</p> */}
                    <p className="taemem-title">
                    <FontAwesomeIcon icon={faSearch} className="icon" />{" "}
                      {taemem.title}</p>
                    <p className="taemem-location">
                      <FontAwesomeIcon icon={faLocationDot} className="icon" />{" "}
                      {taemem.main_location?.city?.name}, {taemem.main_location?.region?.name}
                    </p>
                    <p className="taemem-date">
                      <FontAwesomeIcon icon={faCalendarAlt} className="icon" />{" "}
                      {new Date(taemem.main_location?.created_at).toLocaleDateString()}
                    </p>
                    <p className="taemem-type">
                      <FontAwesomeIcon icon={faTags} className="icon" />{" "}
                      {taemem.taemem_type?.name}
                    </p>
                    <p
                      className={`taemem-status status-${taemem.taemem_status?.name?.toLowerCase()}`}
                      style={{
                        color:
                          taemem.taemem_status?.name === "مفقود"
                            ? "green"
                            : taemem.taemem_status?.name === "معثور"
                            ? "red"
                            : taemem.taemem_status?.name === "سَرِقة"
                            ? "blue"
                            : "gray",
                      }}
                    >
                      <FontAwesomeIcon icon={faCircle} className="icon" /> الحالة:{" "}
                      {taemem.taemem_status?.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {displayedCount < taemems.length && (
              <button className="load-more-btn filter-button" onClick={loadMore}>
                المزيد
              </button>
            )}
          </div>
        ) : (
          <div className="image-empty text-center">
            <h2 className="text-secondary mt-3">لا يوجد تعميمات</h2>
            <img src={emptyImage} alt="No records" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyT3mem;
