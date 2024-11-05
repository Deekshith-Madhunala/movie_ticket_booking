import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../Navbar'; 
import { Home, MyTickets, News, Login, MovieSchedule, SeatSelection, ConfirmPayment, BookingSuccess, CreateMovie, Register } from '../pages';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../auth/AuthContext';

const AppRouter = () => {

  const { user, logout } = useAuth(); // Use authentication context

  return (
    <Router>
      {user && <Navbar />}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/news" element={<News />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes wrapper */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/movie-schedule/:movieId" element={<MovieSchedule />} />
            <Route path="/seat-selection" element={<SeatSelection />} />
            <Route path="/confirm-payment" element={<ConfirmPayment />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/create-movie" element={<CreateMovie />} />
          </Route>

          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
