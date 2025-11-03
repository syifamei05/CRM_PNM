import { useState } from 'react';
import './App.css';
import { Mainpage } from './pages/mainpage/home';
import { Routes, Route } from 'react-router-dom';
function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<Mainpage />} />
    </Routes>
  );
}

export default App;
