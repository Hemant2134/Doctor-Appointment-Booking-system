import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signupImg from "../assets/images/signup.gif";
import avatar from "../assets/images/doctor-img01.png";
import uploadImageToCloudinary from "../utils/uploadCloudinary";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";
import { BASE_URL } from "../config";
const Signup = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [loading,setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: "selectedFile",
    gender: "",
    role: "patient",
  });
  const navigate =useNavigate()

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const data = await uploadImageToCloudinary(file);
    console.log(data);
    setPreviewURL(data.url)
    setSelectedFile(data.url)
    setFormData({...formData,photo:data.url})
// later we will use cloudinary  to upload images

  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/register`,{
        method:'post',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify(formData)
      })
      const{message} =await res.json()
      if(!res.ok){
        throw new Error(message)
      }
      setLoading(false)
      toast.success(message)
      navigate('/login')
    } catch (err) {
      toast.error(err.message)
      setLoading(false)
    }
  };

  return (
    <section className="px-5 xl:px-0">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Box */}
          <div className="hidden lg:block bg-primaryColor rounded-l-lg overflow-hidden">
            <img
              src={signupImg}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/* Sign Up Form */}
          <div className="bg-white rounded-lg lg:pl-16 py-10">
            <h3 className="text-headingColor text-2xl font-bold mb-8">
              Create an <span className="text-primaryColor">Account</span>
            </h3>

            <form onSubmit={submitHandler}>
              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Full name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-b border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base text-headingColor placeholder-text-textColor rounded-md"
                  required
                />
              </div>

              {/* <div className="mb-5">
                <input
                  type="number"
                  placeholder="Mobile number:"
                  name="mobile no"
                  value={formData.mnumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-b border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base text-headingColor placeholder-text-textColor rounded-md"
                  required
                />
              </div> */}

              <div className="mb-5">
                <input
                  type="email"
                  placeholder="Enter your email"
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
                  className="w-full px-4 py-3 border-b border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base text-headingColor placeholder-text-textColor rounded-md"
                  required
                />
              </div>

              <div className="mb-5 flex items-center justify-between">
                <label className="text-headingColor font-bold text-base leading-7">
                  Are you a:
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="text-textColor font-semibold text-base leading-7 px-4 py-3 focus:outline-none"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </label>
                
                {/* <b>Your Age:</b><input
                  type="text"
                  placeholder=""
                  name="Your Age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="text-headingColor font-bold text-base leading-4 W-12 "
                  required
                /> */}

                <label className="text-headingColor font-bold text-base leading-7">
                  Gender:
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="text-textColor font-semibold text-base leading-7 px-4 py-3 focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>

              <div className="mb-5 flex items-center gap-3">
                { selectedFile && (<figure className="w-16 h-16 rounded-full border-2 border-solid border-primaryColor overflow-hidden">
                  <img
                    src={previewURL}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </figure>)}

                <div className="relative w-[160px] h-[50px]">
                  <input
                    type="file"
                    name="photo"
                    id="customFile"
                    onChange={handleInputChange}
                    accept=".jpg,.png"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <label
                    htmlFor="customFile"
                    className="absolute top-0 left-0 w-full h-full flex items-center px-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                  >
                    + Upload Photo
                  </label>
                </div>
              </div>

              <div className="mt-7">
                <button
                disabled = {loading && true}
                  type="submit"
                  className="w-full bg-primaryColor text-white text-lg leading-7 rounded-lg px-4 py-3 hover:bg-blue-700 transition"
                >
                  {loading ?( <HashLoader size={35} color="#ffffff"/>) :(  'Sign Up')}
                </button>
              </div>

              <p className="mt-5 text-textColor text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-primaryColor font-medium">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;