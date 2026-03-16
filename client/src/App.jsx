import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Layout from "./pages/Layout/Layout";
import DashBoard from "./pages/DashBoard/DashBoard";
import ResumeBuilder from "./pages/ResumeBuilder/ResumeBuilder";
import Preview from "./pages/Preview/Preview";
import Login from "./pages/Login/Login";
import { useDispatch } from "react-redux";
import axios from "axios";
import api from "./configs/api";
import { login, setLoading } from "./app/features/authSlice";
import {Toaster} from 'react-hot-toast'
import InterviewReport from "./pages/InterviewReport";

const App = () => {
  const dispatch = useDispatch();

  const getUserData = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        const { data } = await api.get("/api/users/data", {
          headers: { Authorization: token },
        });

        if (data.user) {
          dispatch(login({ token, user: data.user }));
        }
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <>
    <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="app" element={<Layout />}>
          <Route index element={<DashBoard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>
        <Route path="view/:resumeId" element={<Preview />} />
        <Route path="login" element={<Login />} />
        <Route path="app/interview-report/:id" element={<InterviewReport />} />
      </Routes>
    </>
  );
};

export default App;
