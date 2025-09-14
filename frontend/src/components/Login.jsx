import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  function login(event) {
    event.preventDefault();
    const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
    const formData = new FormData(event.target);

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    axios
      .post(`${BACKEND_URI}/login`, data)
      .then((response) => {
        // console.log(response.data);
        // console.log("I got here");

        localStorage.setItem("authToken", response.data.authToken);
        localStorage.setItem("firstName", response.data.firstName);
        localStorage.setItem("userEmail", response.data.userEmail);

        // console.log(localStorage);

        if (response.status === 200) {
          navigate("/logger");
        }
      })
      .catch((err) => {
        if (err.response) {
          console.error("Failed to log in:", err.response.data);
          if (err.response.status === 401 || err.response.status === 404) {
            alert("Invalid credentials");
          }
        } else {
          console.error("Failed to log in:", err.message);
        }
      });
  }

  return (
    <>
      <div className="absolute inset-0 h-screen bg-[url('https://images.unsplash.com/photo-1635695604201-2b718204bccb?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8A%3D%3D')] bg-cover bg-center filter blur-[1.5px]"></div>

      <div className="relative flex w-screen h-screen items-center justify-center xl:justify-end xl:pr-10">
        <form
          onSubmit={login}
          className="relative flex flex-col w-4/5 bg-green-50 pl-8 pr-8 pt-16 pb-16 sm:w-2/3 lg:w-1/2 xl:w-2/5">
          <h1 className="ml-auto mr-auto text-xl text-green-950 font-bold mb-5 sm:text-2xl">
            Welcome back!
          </h1>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="bg-green-200 mb-5 h-9 hover:bg-green-300 border-b border-green-500"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="bg-green-200 mb-5 h-9 hover:bg-green-300 border-b border-green-500"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 w-2/4 ml-auto mr-auto mt-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full sm:w-1/3">
            Log In
          </button>

          <p className="mt-5">
            Don't have an account?{" "}
            <span
              className="text-blue-500 hover:font-semibold cursor-pointer"
              onClick={() => navigate("/signup")}>
              Sign up here
            </span>
          </p>
        </form>
      </div>
    </>
  );
}
