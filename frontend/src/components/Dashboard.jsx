import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Home, Users, Trophy, NotebookPen, LogOut, Goal } from "lucide-react";
import { io } from "socket.io-client";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("summary");
  const [leaderboard, setLeaderboard] = useState([]);
  const [usersAverage, setUsersAverage] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [weeklyGoal, setWeeklyGoal] = useState(null);
  const [goalStatus, setGoalStatus] = useState("");
  const [latestGoal, setLatestGoal] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
  const token = localStorage.getItem("authToken");
  const headers = {
    headers: { Authorization: token ? `Bearer ${token}` : null },
  };

  const socket = io(BACKEND_URI, { auth: { token } });

  function getUserLogs() {
    setActiveTab("summary");
    setLoading(true);

    axios
      .get(`${BACKEND_URI}/user-logs`, headers)
      .then((response) => {
        const logs = response.data.result;
        setUserLogs(logs);
        setLeaderboard([]);
        setUsersAverage([]);
        setWeeklyGoal(null);

        const categoryTotals = logs.reduce((acc, log) => {
          const emission = parseFloat(log.emission) || 0;
          acc[log.category] = (acc[log.category] || 0) + emission;
          return acc;
        }, {});

        setChartData({
          labels: Object.keys(categoryTotals),
          datasets: [
            {
              label: "Emissions by category",
              data: Object.values(categoryTotals),
              backgroundColor: ["#4A90E2", "#E67E22", "#2E8B57", "#8E44AD"],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((err) => console.error("Failed to fetch user's logs", err))
      .finally(() => setLoading(false));
  }

  function getLeaderboard() {
    setActiveTab("leaderboard");
    setLoading(true);

    axios
      .get(`${BACKEND_URI}/leaderboard`)
      .then((response) => {
        setLeaderboard(response.data.data);
        setUserLogs([]);
        setUsersAverage([]);
        setWeeklyGoal(null);
      })
      .catch((err) => console.error("Failed to fetch leaderboard", err))
      .finally(() => setLoading(false));
  }

  function getUsersAverage() {
    setActiveTab("average");
    setLoading(true);

    axios
      .get(`${BACKEND_URI}/users-average`)
      .then((response) => {
        setUsersAverage(response.data.result);
        setUserLogs([]);
        setLeaderboard([]);
        setWeeklyGoal(null);
      })
      .catch((err) => console.error("Failed to fetch users' average", err))
      .finally(() => setLoading(false));
  }

  function getWeeklyGoals() {
    setActiveTab("weeklyGoals");
    setLoading(true);

    socket.emit("getWeeklyGoals");

    socket.once("weeklyGoalsData", (data) => {
      setWeeklyGoal(data);
      setUserLogs([]);
      setLeaderboard([]);
      setUsersAverage([]);
      setLoading(false);
    });
  }

  function fetchLatestGoal() {
    axios
      .get(`${BACKEND_URI}/weekly-goals`, headers)
      .then((response) => {
        setLatestGoal(response.data.goal);
      })
      .catch((err) => console.error("Failed to fetch user's goals", err));
  }

  function setGoal(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = {
      category: formData.get("weekly-category"),
      goal: Number(formData.get("weekly-goal")),
    };

    axios
      .post(`${BACKEND_URI}/weekly-goals`, data, headers)
      .then(() => {
        setGoalStatus("Weekly goal set successfully!");
        fetchLatestGoal();
        setShowForm(false);

        setTimeout(() => {
          setGoalStatus("");
          event.target.reset();
        }, 1200);
      })
      .catch((err) => {
        if (err.response && err.response.status === 403) {
          setGoalStatus(err.response.data.message);
        } else {
          setGoalStatus("Failed to set goal.");
        }
        setTimeout(() => setGoalStatus(""), 2000);
      });
  }

  function handleLogout() {
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  }

  useEffect(() => {
    getUserLogs();
    fetchLatestGoal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-16 md:w-64 max-w-64 bg-green-50 shadow-md z-10 flex flex-col">
        <div className="p-4 bg-green-700 text-white text-center md:text-left">
          <span className="hidden md:inline text-xl font-bold">
            Hi, {localStorage.getItem("firstName") || "User"}!
          </span>
          <span className="inline md:hidden font-bold">Hi!</span>
        </div>

        <nav className="flex-1">
          <div
            onClick={getUserLogs}
            className={`flex items-center h-12 p-4 border-b cursor-pointer hover:bg-green-100 ${
              activeTab === "summary" ? "bg-green-200" : "bg-green-50"
            }`}>
            <Home className="text-green-800" />
            <span className="ml-3 hidden md:inline text-green-800">
              My summary
            </span>
          </div>

          <div
            onClick={getWeeklyGoals}
            className={`flex items-center h-12 p-4 border-b cursor-pointer hover:bg-green-100 ${
              activeTab === "weeklyGoals" ? "bg-green-200" : "bg-green-50"
            }`}>
            <Goal className="text-green-800" />
            <span className="ml-3 hidden md:inline text-green-800">
              Weekly Goals
            </span>
          </div>

          <div
            onClick={getUsersAverage}
            className={`flex items-center h-12 p-4 cursor-pointer hover:bg-green-100 ${
              activeTab === "average" ? "bg-green-200" : "bg-green-50"
            }`}>
            <Users className="text-green-800" />
            <span className="ml-3 hidden md:inline text-green-800">
              Users average
            </span>
          </div>

          <div
            onClick={getLeaderboard}
            className={`flex items-center h-12 p-4 border-t cursor-pointer hover:bg-green-100 ${
              activeTab === "leaderboard" ? "bg-green-200" : "bg-green-50"
            }`}>
            <Trophy className="text-green-800" />
            <span className="ml-3 hidden md:inline text-green-800">
              Leaderboard
            </span>
          </div>

          <div
            onClick={() => navigate("/logger")}
            className="flex items-center h-12 p-4 border-t cursor-pointer hover:bg-green-100">
            <NotebookPen className="text-green-800" />
            <span className="ml-3 hidden md:inline text-green-800">
              Return to Logger
            </span>
          </div>
        </nav>

        <button
          onClick={handleLogout}
          className="m-4 mb-16 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
          <LogOut className="text-white" />
          <span className="ml-2 hidden md:inline">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 p-4 overflow-y-auto">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635695604201-2b718204bccb?q=80&w=1171&auto=format&fit=crop')] bg-cover bg-center filter blur-[4px] md:transform md:scale-x-[-1]"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-green-900 mb-5">Dashboard</h1>
          {loading && <p className="text-white">Loading...</p>}

          {activeTab === "summary" && (
            <div className="bg-white/80 p-4 rounded shadow-md">
              <h1 className="flex text-3xl font-bold text-green-900 mb-4 justify-center">
                My Emissions
              </h1>
              <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 bg-white/80 p-4 rounded shadow-md">
                  <h2 className="text-xl font-bold text-green-900 mb-4 text-center">
                    My Logs
                  </h2>
                  <p className="text-green-700 font-semibold text-center mb-4">
                    Total Emissions:{" "}
                    {userLogs
                      .reduce(
                        (sum, log) => sum + parseFloat(log.emission || 0),
                        0
                      )
                      .toFixed(2)}{" "}
                    kg CO₂
                  </p>
                  <div className="flex flex-col space-y-2 border-y h-[375px] overflow-y-auto">
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

                {chartData && (
                  <div className="flex-1 flex items-center justify-center bg-white/80 p-4 rounded shadow-md">
                    <div className="w-full h-96">
                      <Pie
                        data={chartData}
                        options={{
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "left",
                              labels: { color: "#14532d" },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "leaderboard" && (
            <div className="bg-white/80 p-4 rounded shadow-md w-full max-w-xl mx-auto">
              <h2 className="text-2xl font-bold text-green-900 mb-4 text-center">
                Low-footprint users (Top 10)
              </h2>
              <div className="flex flex-col space-y-2">
                {leaderboard.map((user, index) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center bg-green-50 p-2 rounded">
                    <span className="w-6 text-center font-medium">
                      {index + 1}
                    </span>
                    <div className="flex justify-between flex-1 ml-4">
                      <span className="font-medium">{user.name}</span>
                      <span>{user.totalEmissions.toFixed(2)} kg CO₂</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "average" && (
            <div className="bg-white/80 p-4 rounded shadow-md w-full max-w-xl mx-auto">
              <h2 className="text-2xl font-bold text-green-900 mb-4 text-center">
                Average across all users
              </h2>
              {usersAverage.length > 0 && (
                <p className="text-xl text-green-700 font-semibold text-center">
                  {usersAverage[0].averageEmission.toFixed(2)} kg CO₂
                </p>
              )}
            </div>
          )}

          {activeTab === "weeklyGoals" && (
            <div>
              {/* Weekly Tip */}
              {weeklyGoal && (
                <div className="bg-white/80 p-4 rounded shadow-md w-full max-w-xl mx-auto">
                  <h2 className="text-2xl font-bold text-green-900 mb-4 text-center">
                    Weekly Tip
                  </h2>
                  <p className="text-lg text-green-700 text-center mb-2">
                    Your highest emission comes from{" "}
                    <b>{weeklyGoal.category}</b> (
                    {weeklyGoal.totalEmissions.toFixed(2)} kg CO₂).
                  </p>
                  <p className="text-md text-green-800 text-center font-semibold">
                    💡 {weeklyGoal.tip}
                  </p>
                </div>
              )}

              {/* Current Goal */}
              {latestGoal ? (
                <div className="bg-white/80 p-4 rounded shadow-md w-full max-w-xl mx-auto mt-2">
                  <h2 className="text-2xl font-bold text-green-900 mb-4 text-center">
                    Your Current Weekly Goal
                  </h2>
                  <p className="text-lg text-green-700 text-center">
                    <strong>Category:</strong> {latestGoal.category}
                  </p>
                  <p className="text-lg text-green-700 text-center">
                    <strong>Goal:</strong> {latestGoal.goal} kg CO₂
                  </p>
                  <p className="text-sm text-gray-600 text-center">
                    Set on {new Date(latestGoal.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="bg-white/80 p-4 rounded shadow-md w-full max-w-xl mx-auto mt-2 text-center">
                  <p className="text-gray-500">No weekly goal set yet.</p>
                </div>
              )}

              {/* Button to open form */}
              <div className="w-full max-w-xl mx-auto mt-4 text-center">
                <button
                  onClick={() => setShowForm(!showForm)}
                  disabled={!!latestGoal}
                  className={`px-4 py-2 rounded font-bold ${
                    latestGoal
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-700 text-white"
                  }`}>
                  {latestGoal ? "Goal already set" : "Set Weekly Goal"}
                </button>
              </div>

              {/* Goal Form */}
              {showForm && !latestGoal && (
                <div className="bg-white/80 p-4 rounded shadow-md w-full max-w-xl mx-auto mt-2">
                  <h1 className="text-2xl font-bold text-green-900 mb-4 text-center">
                    CO₂ Reduction Goal
                  </h1>
                  <form onSubmit={setGoal} className="flex flex-col">
                    <label htmlFor="weekly-category">Category:</label>
                    <select
                      id="weekly-category"
                      name="weekly-category"
                      className="bg-green-200 mb-5 h-9 hover:bg-green-300 border-b border-green-500"
                      required>
                      <option value="" disabled selected hidden>
                        -- select --
                      </option>
                      <option value="energy-use">Energy Use</option>
                      <option value="transportation">Transportation</option>
                      <option value="food-consumption">Food Consumption</option>
                      <option value="other">Other</option>
                    </select>

                    <label htmlFor="weekly-goal">Goal (kg CO₂):</label>
                    <input
                      id="weekly-goal"
                      name="weekly-goal"
                      type="number"
                      min={1}
                      className="bg-green-200 mb-5 h-9 hover:bg-green-300 border-b border-green-500"
                      required
                    />

                    {goalStatus && (
                      <p className="text-red-500 text-center">{goalStatus}</p>
                    )}

                    <button className="bg-blue-500 w-2/4 mx-auto mt-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded sm:w-1/3">
                      Set Goal
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
