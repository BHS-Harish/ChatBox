import React from "react";
import Profile from "../components/SettingsComponents/Profile";
import InputName from "../components/SettingsComponents/InputName";
import InputEmail from "../components/SettingsComponents/InputEmail";
import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { setUser } from '../services/Actions/User/actions'
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const PasswordRequirements = ({ password }) => {
  const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
  const numberRegex = /[0-9]/;
  const uppercaseRegex = /[A-Z]/;

  const boxStyle = {
    border: '1px solid #ccc',
    padding: '8px',
    borderRadius: '4px',
    marginTop: '8px',
    backgroundColor: '#f9f9f9',
    width: "40%"
  };

  return (
    <div style={boxStyle}>
      <ul>
        <li style={{ color: password.length >= 8 && password.length <= 12 ? 'green' : 'red' }}>
          {password.length >= 8 && password.length <= 12 ? <CheckCircleIcon /> : <CancelIcon />} 8-12 characters
        </li>
        <li style={{ color: numberRegex.test(password) ? 'green' : 'red' }}>
          {numberRegex.test(password) ? <CheckCircleIcon /> : <CancelIcon />} At least one number
        </li>
        <li style={{ color: uppercaseRegex.test(password) ? 'green' : 'red' }}>
          {uppercaseRegex.test(password) ? <CheckCircleIcon /> : <CancelIcon />} At least one uppercase letter
        </li>
        <li style={{ color: specialCharacterRegex.test(password) ? 'green' : 'red' }}>
          {specialCharacterRegex.test(password) ? <CheckCircleIcon /> : <CancelIcon />} At least one special character
        </li>
      </ul>
    </div>
  );
};

export default function Settings() {

  const dispatch = useDispatch();
  const storedData = JSON.parse(localStorage.getItem("info"));
  const [name, setName] = useState(storedData.name);
  const [email, setEmail] = useState(storedData.email);
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const resetData = () => {
    setName(storedData.name);
    setEmail(storedData.email);
  };
  const resetPassword = () => {
    setPassword("")
    setConfirmPassword("")
  }
  const notify = (value) => {
    if (value === "error")
      return toast.error("Someting went wrong!", {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

    return toast.success("Successfuly updated!", {
      position: "top-center",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const updatePasswordHandler = async () => {
    setShowPasswordRequirements(true)
    if (password != confirmPassword) {
      toast.error("Password and Confirm password not matched");
    }
    else {
      const cookie = localStorage.getItem("jwt");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/users/updatepassword`,
        {
          method: "post",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
          body: JSON.stringify({password}),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        toast.success("Password updated!")
        resetPassword()
        setShowPasswordRequirements(false)
      }

      else toast.error("Error");
    }
  }
  const updateHandler = () => {
    const dataSent = {
      name,
      email,
    };
    const updateData = async () => {
      const cookie = localStorage.getItem("jwt");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/users/updateMe`,
        {
          method: "post",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
          body: JSON.stringify(dataSent),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        notify("success");
        dispatch(setUser(data.updatedUser));
      }

      else notify("error");
    };
    updateData();
  };

  return (
    <div className="grid w-[80vw] relative grid-rows-[1fr,7fr] max-h-[100vh] overflow-y-scroll">
      <div className="border-[1px] border-[#f5f5f5]">
        <ToastContainer></ToastContainer>
        <div className="px-[5%] py-[2%]">
          <div className="font-Poppins max-[1024px]:text-xl font-semibold text-2xl">
            Public profile
          </div>
          <div className="flex items-center mt-2">
            <InfoIcon fontSize='10' color="info"></InfoIcon>
            <div className="font-Poppins  text-xs">To update your profile picture, select an image and upload it.</div>
          </div>
          <Profile></Profile>
          <div className="mt-[3%] flex flex-col gap-8">
            <InputName name={name} setName={setName}></InputName>
            <InputEmail email={email} setEmail={setEmail}></InputEmail>
          </div>
          <div className="flex flex-row mt-[2%] gap-2">
            <div
              onClick={updateHandler}
              className=" bg-[#202142] hover:bg-[#202162] text-white font-medium  cursor-pointer border-[#000000]  px-4 py-2 max-[1024px]:px-2 max-[1024px]:py-1 max-[1024px]:text-sm rounded-md font-Roboto tracking-tight"
            >
              Update
            </div>
            <div
              onClick={resetData}
              className=" bg-[#C6CED1] text-white font-medium  cursor-pointer border-[#000000]  px-4 py-2 rounded-md font-Roboto tracking-tight max-[1024px]:px-2 max-[1024px]:py-1 max-[1024px]:text-sm"
            >
              Reset
            </div>
          </div>
        </div>
        <div className="px-[5%] py-[2%]">
          <div className="font-Poppins max-[1024px]:text-xl font-semibold text-2xl">
            Update Password
          </div>
          <div className="mt-[3%] flex flex-col gap-8">
            <TextField
              id="outlined-read-only-input"
              label="Password"
              onChange={(e) => { setPassword(e.target.value) }}
              value={password}
              style={{ width: '40%' }}
            />
            {showPasswordRequirements && <PasswordRequirements password={password} />}
            <TextField
              id="outlined-read-only-input"
              label="Confirm Password"
              onChange={(e) => { setConfirmPassword(e.target.value) }}
              value={confirmPassword}
              style={{ width: '40%' }}
            />
          </div>
          <div className="flex flex-row mt-[2%] gap-2">
            <div
              onClick={updatePasswordHandler}
              className=" bg-[#202142] hover:bg-[#202162] text-white font-medium  cursor-pointer border-[#000000]  px-4 py-2 max-[1024px]:px-2 max-[1024px]:py-1 max-[1024px]:text-sm rounded-md font-Roboto tracking-tight"
            >
              Update
            </div>
            <div
              onClick={resetPassword}
              className=" bg-[#C6CED1] text-white font-medium  cursor-pointer border-[#000000]  px-4 py-2 rounded-md font-Roboto tracking-tight max-[1024px]:px-2 max-[1024px]:py-1 max-[1024px]:text-sm"
            >
              Reset
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
