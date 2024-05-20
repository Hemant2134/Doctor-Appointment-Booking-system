import React, { useState ,useContext } from "react";
import { Link ,useNavigate} from "react-router-dom"; 
import { BASE_URL } from "../config";
import { toast } from "react-toastify";
import { authContext } from "../context/AuthContext";
import HashLoader from 'react-spinners/HashLoader';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading,setLoading]= useState(false);
  const navigate = useNavigate()
  const {dispatch} = useContext(authContext)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/login`,{
        method:'post',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify(formData)
      })
      const result =await res.json()
      if(!res.ok){
        throw new Error(result.message)
      }
      dispatch({
        type:'LOGIN_SUCCESS',
        payload:{
          user:result.data,
          token:result.token,
          role:result.role,
        },
      });
      console.log(result,'login data')
      setLoading(false)
      toast.success(result.message)
      navigate('/')
    } catch (err) {
      toast.error(err.message)
      setLoading(false)
    }
  };
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Add your login logic here
  // };

  return (
    <section className="px-5 lg:px-0">
      <div className="w-full max-w-[370px] mx-auto rounded-lg shadow-md p-6 md:p-10 bg-white">
        <h3 className="text-headingColor text-2xl font-bold mb-6">
          Hello! <span className="text-primaryColor">Welcome</span> Back
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-b border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base text-headingColor placeholder-text-textColor rounded-md"
              required
            />
          </div>

          <div className="mb-5">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full py-3 border-b border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base text-headingColor placeholder-text-textColor"
              required
            />
          </div>

          <div className="mt-7">
            <button
              type="submit"
              className="w-full bg-primaryColor text-white text-lg leading-7 rounded-lg px-4 py-3 hover:bg-blue-700 transition"
            >
              {loading ? <HashLoader size={25} color='#fff'/> : "Login" }
            </button>
          </div>

          <p className="mt-5 text-textColor text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-primaryColor font-medium">
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
