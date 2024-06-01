import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/SignUp/Signup';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path={`/login`} element={<Login />} />
          <Route path={`/register`} element={<Signup />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
