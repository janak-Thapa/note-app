
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Corrected import

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/SignUp/Signup';

const routes = (
  <Router>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
    </Routes>
  </Router>
);

const App = () => {
  return (
    <div>
      {routes}
    </div>
  );
}

export default App;
