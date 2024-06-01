/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar"
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axios";
import axios, { AxiosError } from "axios";


const Signup = () => {
    const [name,setName] = useState<string>("")
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();


    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!name){
            setError("Please enter the name");
            return
        } else{
            setError(null);

        }

        if (!validateEmail(email) ) {
            setError("Please enter a valid email address.");
            return;
          } else {
            setError(null);
            // Add your login logic here
          }
          if(!password){
              setError("Please enter the password")
          }else {
              setError(null);
        }

        try {
          const response = await axiosInstance.post('/register', {
            fullName:name,
            email,
            password,
          });
    
          if (response.data && response.data.error) {
            
           setError(response.data.message)
           return
          }
          if(response.data && response.data.accessToken){
            localStorage.setItem("token",response.data.accessToken)
            navigate("/")
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
  
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const axiosError = error as AxiosError<any>; // Specify the type as AxiosError<any>
            if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
              setError(axiosError.response.data.message);
            } else if (axiosError.message) {
              setError(axiosError.message); // Use the error message from AxiosError
            } else {
              setError("An unexpected error occurred. Please try again.");
            }
          } else {
            setError("An unexpected error occurred. Please try again.");
          }
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
      };
    
     
    
    return (
    <>

    {/* // eslint-disable-next-line @typescript-eslint/no-unused-vars */}
    <Navbar userInfo={undefined} onSearchNote={function (_searchQuery: string): void {
          throw new Error("Function not implemented.");
        } } handleClearSearch={function (): void {
          throw new Error("Function not implemented.");
        } } />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl mb-7 flex items-center justify-center">
              SignUp
            </h4>
            <input
              type="text"
              placeholder="name"
              className="w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

<input
              type="text"
              placeholder="Email"
              className="w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

                <PasswordInput
              value={password}
              onChange={handlePasswordChange}
              placeholder={"password"}
            />
             {error && (
              <p className="text-red-500 text-xs pb-1">{error}</p>
            )}
            <button
              type="submit"
              className="w-full text-sm bg-primary text-white p-2 rounded my-1 hover:bg-blue-400"
            >
              Create an Account
            </button>
            <p className="text-sm text-center mt-4">
             Already have an account?{' '}
              <Link to={"/login"} className="font-medium text-primary underline">
               Login
              </Link>
            </p>
            </form>
            </div>
            </div>
    </>
  )
}

export default Signup
