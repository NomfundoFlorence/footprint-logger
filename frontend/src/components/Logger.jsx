import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";

export default function Logger() {
  const activitiesData = {
    "energy-use": [
      "1.5-Electricity Consumption",
      "2-Gas Consumption",
      "1.8-Water Heating",
      "0.09-Watching TV",
      "0.1-Computer use",
      "0.06-Lights on",
      "0.7-Washing laundry",
      "0.5-Dish washer",
      "2.2-Heaters and/or Air conditioners",
      "1-Cooking",
    ],
    transportation: [
      "0.21-Traveling by car",
      "0.22-Traveling by taxi",
      "0.05-Traveling by train",
      "0.1-Traveling by bus",
      "0.285-Traveling by flight",
    ],
    "food-consumption": [
      "5-Red meat",
      "2-Dairy products",
      "1.5-Vegetarian meals",
      "0.9-Vegan meals",
    ],
    other: ["1.5-Waste Management", "0.2-Gardening", "2-Shopping Habits"],
  };

  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [userLogs, setUserLogs] = useState([]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedActivity("");
  };

  const handleActivityChange = (event) => {
    setSelectedActivity(event.target.value);
  };

  function handleSubmit(event) {
    event.preventDefault();
    const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
    if (!selectedCategory || !selectedActivity) {
      alert("Please select a category and an activity before submitting.");
      return;
    }

    const token = localStorage.getItem("authToken");

    const formData = new FormData(event.target);
    const categoryValue = formData.get("group");
    const activityValue = formData.get("activity");

    const activityLabel = activities
      .find((a) => a.startsWith(activityValue + "-"))
      .split("-")[1];

    const data = {
      email: localStorage.getItem("userEmail"),
      category: categoryValue,
      activity: activityLabel,
      emission: activityValue,
    };

    axios
      .post(`${BACKEND_URI}/logger`, data, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "Bearer",
        },
      })
      .then((response) => {
        setUserLogs((prev) => [response.data.postedLog, ...prev]);

        setTimeout(() => {
          setSelectedCategory("");
          setSelectedActivity("");
        }, 1000);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          alert("Log in to use the application.");
          navigate("/login");
        } else {
          alert("Server Error", err);
        }
      });
  }

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("firstName");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }

  function dashboardNavigation() {
    navigate("/dashboard");
  }

  const token = localStorage.getItem("authToken");
  const headers = {
    headers: { Authorization: token ? `Bearer ${token}` : null },
  };

  useEffect(() => {
    getUserLogs();
  }, []);

  function getUserLogs() {
    const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

    axios
      .get(`${BACKEND_URI}/user-logs`, headers)
      .then((response) => setUserLogs(response.data.result))
      .catch((err) => console.error("Failed to fetch user's logs", err));
  }

  const activities = selectedCategory ? activitiesData[selectedCategory] : [];

  return (
    <div className="flex flex-col h-screen">
      <div className="h-14 bg-green-700 shadow flex items-center justify-between px-4">
        <span className="text-lg font-bold text-white">{`Hi, ${localStorage.getItem(
          "firstName"
        )}!`}</span>
        <nav className="flex">
          <div
            onClick={dashboardNavigation}
            className="flex items-center h-full p-4 cursor-pointer hover:bg-green-600 justify-center md:justify-start border-l border-green-600">
            <LayoutDashboard className="text-green-50" />
            <span className="ml-3 text-green-50 hidden md:inline">
              Dashboard
            </span>
          </div>
          <div
            onClick={handleLogout}
            className="flex items-center h-full p-4 cursor-pointer hover:bg-green-600 justify-center md:justify-start border-l border-green-600">
            <LogOut className="text-green-50" />
            <span className="ml-3 text-green-50 hidden md:inline">Logout</span>
          </div>
        </nav>
      </div>

      <div className="relative flex-1 flex flex-col lg:flex-row sm:h-4/5 items-start justify-center gap-8 p-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635695604201-2b718204bccb?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8A%3D%3D')] bg-cover bg-center"></div>

        <form
          id="activity-form"
          onSubmit={handleSubmit}
          className="relative flex flex-col justify-between bg-white/90 p-4 shadow-md w-full max-w-lg max-h-[600px] sm:h-[98%] rounded-[10px] z-10">
          <fieldset className="flex flex-col p-4">
            <legend className="text-xl text-green-950 font-bold mb-2 text-center sm:text-2xl">
              Select category
            </legend>
            {Object.keys(activitiesData).map((key) => (
              <div className="radio-label mb-2" key={key}>
                <input
                  type="radio"
                  name="group"
                  id={key}
                  value={key}
                  checked={selectedCategory === key}
                  onChange={handleCategoryChange}
                />
                <label htmlFor={key} className="ml-2">
                  {key
                    .replace("-", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </label>
              </div>
            ))}
          </fieldset>

          <div className="flex flex-col border-t-2 border-gray-300 pt-4 mt-4">
            <label
              htmlFor="activity"
              className="text-xl text-green-950 font-bold mb-2 text-center sm:text-2xl">
              Select activity
            </label>
            <select
              name="activity"
              value={selectedActivity}
              onChange={handleActivityChange}
              disabled={!selectedCategory}
              className="bg-green-200 mb-5 h-9 hover:bg-green-300 border-b border-green-500">
              <option value="">-- select --</option>
              {activities.map((activity) => {
                const [value, label] = activity.split("-");
                return (
                  <option key={label} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2 mx-auto mt-3 sm:w-1/3">
            Submit activity
          </button>
        </form>

        {userLogs.length > 0 && (
          <div className="relative flex-1 bg-blue/80 p-4 rounded shadow-md w-full max-w-lg max-h-[600px] sm:h-[98%] overflow-hidden z-10">
            <h2 className="text-xl font-bold text-green-900 mb-2 text-center">
              My Logs
            </h2>
            <p className="text-green-700 font-semibold text-center mb-2">
              Total Emissions:{" "}
              {userLogs
                .reduce((sum, log) => sum + parseFloat(log.emission || 0), 0)
                .toFixed(2)}{" "}
              kg CO₂
            </p>

            <div className="border-y h-[480px] overflow-y-auto flex flex-col space-y-2">
              {userLogs.map((log, index) => (
                <div
                  key={log._id}
                  className="flex justify-between items-center bg-green-50 p-2 rounded">
                  <span className="w-6 text-center font-medium">
                    {index + 1}
                  </span>
                  <div className="flex justify-between flex-1 ml-4">
                    <span className="font-medium">{log.category}</span>
                    <span className="font-medium">{log.activity}</span>
                    <span>{log.emission} kg CO₂</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
