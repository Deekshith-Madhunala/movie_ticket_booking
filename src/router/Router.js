import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../Navbar';
import {
  Home, MyTickets, News, Login, MovieSchedule, SeatSelection, ConfirmPayment, BookingSuccess,
  CreateMovie, Register, BookingDetails, AddMoviePage, AdminDashboard
} from '../pages';
import ProtectedRoute from './ProtectedRoute';
import Footer from '../components/Footer/Footer';

const AppRouter = () => {

  return (
    <Router>
      <Navbar />
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
            <Route path="/create-schedule" element={<CreateMovie />} />
            <Route path="/booking-details/:movieId" element={<BookingDetails />} />
            <Route path="/add-movie" element={<AddMoviePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
};

export default AppRouter;
