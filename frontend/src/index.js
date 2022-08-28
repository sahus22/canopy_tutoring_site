import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

// import App from './App';
// import reportWebVitals from './reportWebVitals';

import Main from './components/homepage/Main';
import FindTutors from './components/find-tutors/FindTutors';
import MyAppointments from './components/appointments/MyAppointments';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Register from './components/authentication/Register';
import Login from './components/authentication/Login';
import Profile from './components/profile/Profile'

ReactDOM.render(
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Main />}/>
      <Route path="/tutors" element={<FindTutors />}/>
      <Route path="/appointments" element={<MyAppointments />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/profile" element={<Profile />}/>
    </Routes>
    <Footer />
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
