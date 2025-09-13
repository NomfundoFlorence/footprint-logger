import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-green-50 shadow-md z-10 flex flex-col">
        <div className="p-4 text-xl font-bold bg-green-700 text-white">{`Hi, ${localStorage.getItem(
          "firstName"
        )}!`}</div>
        <nav className="flex-1">
          <div className="flex items-center bg-green-50 h-12 p-4 border-b hover:bg-green-100">
            <a href="#" className="block text-green-800 hover:text-green-600">
              My summary
            </a>
          </div>
          <div className="flex items-center bg-green-50 h-12 p-4 hover:bg-green-100">
            <a href="#" className="block text-green-800 hover:text-green-600">
              Users average
            </a>
          </div>
          <div className="flex items-center bg-green-50 h-12 p-4 border-t hover:bg-green-100">
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
          <h1 className="block bg-red-100 text-3xl font-bold text-green-900">Dashboard</h1>
        </div>
      </div>
    </div>
  );
}
