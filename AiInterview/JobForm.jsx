import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { setLoading, } from "../../redux/authSlice";
import { setAIquestions } from "../../redux/interviewSlice";
import { useDispatch, useSelector } from "react-redux";
import { RotatingLines } from "react-loader-spinner";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function JobForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loading = useSelector((state) => state.auth.loading);
  const getAIquestions = useSelector((state)=>state.interview?.AIquestions)

  console.log("getQuestions from Redux : ",getAIquestions);
  

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const onSubmit = async(data) => {
    console.log("Form Data Submitted:", data);
    try {
      setLoading(true);
      const respose = await axios.post(`${API_BASE_URL}/api/v1/AiInterview/create`,
        data,
        {withCredentials: true}
      )
      dispatch(setAIquestions(respose.data.newInterview));
      navigate(`/AI-Interivew/${respose?.data?.newInterview._id}`);

    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div>
        <Link to={"/InterviewDashBord"}>
          <button className=" bg-blue-300 text-black hover:text-white duration-200 hover:scale-105 rounded-lg px-2 m-4">
            back
          </button>
        </Link>
      </div>
      <div className="min-h-screen flex items-center justify-center  p-4">
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold text-center mb-4">Job Form</h2>

          <label className="block mb-2 font-medium">Job Role</label>
          <input
            type="text"
            {...register("jobRole", { required: "Job role is required" })}
            placeholder="Enter job role"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.jobRole && (
            <p className="text-red-500 text-sm">{errors.jobRole.message}</p>
          )}

          <label className="block mt-4 mb-2 font-medium">Job Description</label>
          <textarea
            {...register("jobDescription", {
              required: "Job description is required",
            })}
            placeholder="Enter job description"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.jobDescription && (
            <p className="text-red-500 text-sm">
              {errors.jobDescription.message}
            </p>
          )}

          <label className="block mt-4 mb-2 font-medium">
            Experience Level
          </label>
          <input
            type="number"
            {...register("experienceLevel", {
              required: "Experience level is required",
              min: { value: 1, message: "Minimum experience should be 1 year" },
            })}
            placeholder="Enter experience level"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.experienceLevel && (
            <p className="text-red-500 text-sm">
              {errors.experienceLevel.message}
            </p>
          )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded  hover:bg-indigo-700"
            >
              {loading ? (
                <>
                  <div className="flex justify-center ">
                    <RotatingLines
                      strokeColor="white"
                      strokeWidth="5"
                      animationDuration="0.75"
                      width="30"
                      visible={true}
                    />
                  </div>
                </>
              ) : (
                <>Submit</>
              )}
            </button>
         
        </motion.form>
      </div>
    </>
  );
}
