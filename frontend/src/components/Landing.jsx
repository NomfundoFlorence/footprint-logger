import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <div className="absolute inset-0 h-screen bg-[url('https://images.unsplash.com/photo-1635695604201-2b718204bccb?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8A%3D%3D')] bg-cover bg-center filter blur-[4px] md:blur-[6px]"></div>

      <div className="relative flex flex-col items-center justify-center h-screen w-full md:w-3/5 lg:w-1/2 ml-auto px-4 md:px-8 text-center md:text-left">
        <p className="w-full md:w-4/5 mb-6 text-green-600 text-center sm:text-lg md:text-xl">
          <span className="text-green-700 font-semibold">
            “Your Choices Matter”
          </span>
          Every action releases CO₂ into the atmosphere — from driving to using
          electricity. The impact may seem small, but together, it drives
          climate change. Track your carbon footprint today and take control.
          Small steps now can make a big difference for tomorrow.
        </p>

        <h1 className="text-green-600 text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
          <span className="text-green-800">Welcome to the</span> Carbon
          Footprint Logger
        </h1>

        <div className="flex flex-col sm:flex-row w-full sm:w-2/3 md:w-1/2 gap-4 justify-center sm:justify-evenly">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full sm:w-30"
            onClick={() => {
              navigate("/login");
            }}>
            Log In
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full sm:w-30"
            onClick={() => {
              navigate("/signup");
            }}>
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
}
