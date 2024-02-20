import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KYC from './component/kyc';
import Dashboard from './component/dashboars';
import RegistrationForm from './component/register';
import LoginForm from './component/Login';

function App() {
  return (
    <Router>
      <Routes>
      <Route exact path="/" element={<RegistrationForm />} />
      <Route exact path="/login" element={<LoginForm />} />

        <Route exact path="/kyc" element={<KYC />} />
        <Route exact path = "/dashboard" element={<Dashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;
