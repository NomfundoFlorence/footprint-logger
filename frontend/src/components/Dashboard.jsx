import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState([]);
  const [usersAverage, setUsersAverage] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleLogout() {
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }

  function getUsersAverage() {
    const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
    setLoading(true);
    axios
      .get(`${BACKEND_URI}/users-average`)
      .then((response) => {
        console.log(response.data);
        setUsersAverage(response.data.result);
        setLeaderboard([]);
      })
      .catch((error) => {
        console.error("Failed to fetch users' average", error);
        res.status(500).json({ message: "Failed to fetch leaderboard", error });
      })
      .finally(() => setLoading(false));
  }

  function getLeaderboard() {
    const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
    setLoading(true);
    axios
      .get(`${BACKEND_URI}/leaderboard`)
      .then((response) => {
        console.log(response.data);
        setLeaderboard(response.data.data);
        setUsersAverage([]);
      })
      .catch((error) => {
        console.error("Failed to fetch leaderboard", error);
        res.status(500).json({ message: "Failed to fetch leaderboard", error });
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-green-50 shadow-md z-10 flex flex-col">
        <div className="p-4 text-xl font-bold bg-green-700 text-white">{`Hi, ${localStorage.getItem(
          "firstName"
        )}!`}</div>
        <nav className="flex-1">
          <div className="flex items-center bg-green-50 h-12 p-4 border-b hover:bg-green-100 cursor-pointer">
            <a href="#" className="block text-green-800 hover:text-green-600">
              My summary
            </a>
          </div>
          <div
            onClick={getUsersAverage}
            className="flex items-center bg-green-50 h-12 p-4 hover:bg-green-100 cursor-pointer">
            <a href="#" className="block text-green-800 hover:text-green-600">
              Users average
            </a>
          </div>
          <div
            onClick={getLeaderboard}
            className="flex items-center bg-green-50 h-12 p-4 border-t hover:bg-green-100 cursor-pointer">
            <a href="#" className="block text-green-800 hover:text-green-600">
              Leaderboard
            </a>
          </div>
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 mb-16 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
          Logout
        </button>
      </div>

      <div className="relative flex-1">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635695604201-2b718204bccb?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8A%3D%3D')] bg-cover bg-center filter blur-[4px] md:transform md:scale-x-[-1]"></div>

        <div className="relative p-4 h-screen">
          <h1 className="block text-3xl font-bold text-green-900 mb-5">
            Dashboard
          </h1>

          {loading && <p className="text-white">Loading...</p>}

          <div className="flex justify-center">
            {leaderboard.length > 0 && (
              <div className="bg-white/80 p-4 rounded shadow-md w-full max-w-xl">
                <div className="flex justify-center">
                  <h2 className="text-2xl font-bold text-green-900 mb-4 my-auto text-center">
                    Low-footprint users (Top 10)
                  </h2>
                </div>
                <div className="flex flex-col space-y-2">
                  {leaderboard.map((user, index) => (
                    <div
                      key={user._id}
                      className="flex justify-between items-center bg-green-50 p-2 rounded">
                      <span className="w-6 text-center font-medium">
                        {index + 1}
                      </span>

                      <div className="flex justify-between flex-1 ml-4">
                        <span className="font-medium">{user._id}</span>
                        <span>{user.totalEmissions.toFixed(2)} kg CO₂</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {usersAverage.length > 0 && (
              <div className="bg-white/80 p-4 rounded shadow-md w-full max-w-xl">
                <h2 className="text-2xl font-bold text-green-900 mb-4 my-auto text-center">
                  Average across all users
                </h2>
                <p className="text-xl text-green-700 font-semibold text-center">{`${usersAverage[0].averageEmission} kg CO₂`}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
