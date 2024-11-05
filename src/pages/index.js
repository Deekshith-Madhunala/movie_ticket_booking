import React from 'react';

const Home = React.lazy(() => import('../components/Home/Home'));
const MyTickets = React.lazy(() => import('../components/Tickets/MyTickets'));
const News = React.lazy(() => import('../components/News/News'));
const Login = React.lazy(() => import('../components/Login/Login'));
const MovieSchedule = React.lazy(() => import('../components/MovieSchedule/MovieSchedule'));
const SeatSelection = React.lazy(() => import('../components/SeatSelection/SeatSelection'));
const ConfirmPayment = React.lazy(() => import('../components/ConfirmPayment/ConfirmPayment'));
const BookingSuccess = React.lazy(() => import('../components/BookingSuccess/BookingSuccess'));
const CreateMovie = React.lazy(() => import('../components/Manager/CreateMovie'));
const Register = React.lazy(() => import('../components/Register/Register'));

export { Home, MyTickets, News, Login, MovieSchedule, SeatSelection, ConfirmPayment, BookingSuccess, CreateMovie, Register };
