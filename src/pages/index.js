import React from 'react';

const Home = React.lazy(() => import('../components/Home/Home'));
const MyTickets = React.lazy(() => import('../components/Tickets/MyTickets'));
const News = React.lazy(() => import('../components/News/News'));
const Login = React.lazy(() => import('../components/Login/Login'));
const MovieSchedule = React.lazy(() => import('../components/MovieSchedule/MovieSchedule'));

export { Home, MyTickets, News, Login, MovieSchedule };
