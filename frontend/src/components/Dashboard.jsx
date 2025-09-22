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

  const [loading, setLoading] = useState(false);

  const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
  const token = localStorage.getItem("authToken");
  const headers = {
    headers: { Authorization: token ? `Bearer ${token}` : null },
  };

  const socket = io(BACKEND_URI);

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

  function handleLogout() {
    setTimeout(() => {
      navigate("/login");
    }, 1000);
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

  useEffect(() => {
    getUserLogs();
  }, []);

  return (
    <div className="flex h-screen">
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
            <span className="ml-3 text-green-800 hover:text-green-600 hidden md:inline">
              My summary
            </span>
          </div>

          <div
            onClick={getWeeklyGoals}
            className={`flex items-center h-12 p-4 border-t cursor-pointer hover:bg-green-100 ${
              activeTab === "weeklyGoals" ? "bg-green-200" : "bg-green-50"
            }`}>
            <Goal className="text-green-800" />
            <span className="ml-3 text-green-800 hover:text-green-600 hidden md:inline">
              Weekly Goals
            </span>
          </div>

          <div
            onClick={getUsersAverage}
            className={`flex items-center h-12 p-4 cursor-pointer hover:bg-green-100 ${
              activeTab === "average" ? "bg-green-200" : "bg-green-50"
            }`}>
            <Users className="text-green-800" />
            <span className="ml-3 text-green-800 hover:text-green-600 hidden md:inline">
              Users average
            </span>
          </div>

          <div
            onClick={getLeaderboard}
            className={`flex items-center h-12 p-4 border-t cursor-pointer hover:bg-green-100 ${
              activeTab === "leaderboard" ? "bg-green-200" : "bg-green-50"
            }`}>
            <Trophy className="text-green-800" />
            <span className="ml-3 text-green-800 hover:text-green-600 hidden md:inline">
              Leaderboard
            </span>
          </div>

          <div
            onClick={() => navigate("/logger")}
            className="flex items-center h-12 p-4 border-t cursor-pointer hover:bg-green-100">
            <NotebookPen className="text-green-800" />
            <span className="ml-3 text-green-800 hover:text-green-600 hidden md:inline">
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

      <div className="relative flex-1 p-4 overflow-y-auto">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635695604201-2b718204bccb?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8A%3D%3D')] 
          bg-cover bg-center filter blur-[4px] md:transform md:scale-x-[-1]"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-green-900 mb-5">Dashboard</h1>
          {loading && <p className="text-white">Loading...</p>}

          {userLogs.length > 0 && (
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

          {usersAverage.length > 0 && (
            <div className="bg-white/80 p-4 rounded shadow-md w-full max-w-xl mx-auto">
              <h2 className="text-2xl font-bold text-green-900 mb-4 text-center">
                Average across all users
              </h2>
              <p className="text-xl text-green-700 font-semibold text-center">
                {usersAverage[0].averageEmission.toFixed(2)} kg CO₂
              </p>
            </div>
          )}

          {leaderboard.length > 0 && (
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

          {weeklyGoal && (
            <div className="bg-white/80 p-4 rounded shadow-md w-full max-w-xl mx-auto">
              <h2 className="text-2xl font-bold text-green-900 mb-4 text-center">
                Weekly Goal
              </h2>
              <p className="text-lg text-green-700 text-center mb-2">
                Your highest emission comes from <b>{weeklyGoal.category}</b> (
                {weeklyGoal.totalEmissions.toFixed(2)} kg CO₂).
              </p>
              <p className="text-md text-green-800 text-center font-semibold">
                💡 {weeklyGoal.tip}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
