import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import CrearFactura from './Pages/CrearFactura';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path='/' element={<CrearFactura/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
