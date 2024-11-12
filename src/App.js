import './App.css';
import AppRouter from './router/Router.js';
import { SnackbarProvider } from './components/snackBar/SnackbarContext.js'; // Import the SnackbarProvider

function App() {
  return (
    <div className="App">
      <SnackbarProvider> {/* Wrap your AppRouter with SnackbarProvider */}
        <AppRouter />
      </SnackbarProvider>
    </div>
  );
}

export default App;
