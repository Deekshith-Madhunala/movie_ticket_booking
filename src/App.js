import logo from './logo.svg';
import './App.css';
import MultipleItemsSlider from './MultipleItemsSlider.jsx';
import SimpleSlider from './SimpleSlider.jsx';
import NewsCards from './NewsCards.jsx';
import Navbar from './Navbar.jsx';
import AppRouter from './router/Router.js';


function App() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;