import logo from './logo.svg';
import Navbar from './Component/Navbar';
import Login from'./Component/Login';
import Signup from './Component/Signup';
import Footer from './Component/Footer';
import ParkingSpace from './Component/ParkingSpace';
//import './App.css';

function App() {
  return (
    <div className='App'>
      <Navbar />
      <Login />
      <Signup />  
      <ParkingSpace /> 
      <Footer />
    </div>
  );
}

export default App;