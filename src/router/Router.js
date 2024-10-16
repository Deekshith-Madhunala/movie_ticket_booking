import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../Navbar'; 
import { Home, MyTickets, News, Login, MovieSchedule } from '../pages';

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/news" element={<News />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movie-schedule/:movieId" element={<MovieSchedule />} />
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
