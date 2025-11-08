import "./App.css";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";
import Etiquette from "./pages/Etiquette";
import ChefPage from "./pages/chef";
import Menu from "./pages/menu";
import Contact from "./pages/contact";
import Login from "./auth/login";
import Register from "./auth/register";
import Reservation from "./pages/reservation";
import Services from "./pages/services";
import Helps from "./pages/help";
import ProfilePage from "./pages/profile";
import Checkout from "./pages/checkout";
import ProtectedRoute from "./components/ProtectedRoute";
import AboutUs from "./pages/aboutUs";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/services/:service" element={<Services />} />
          <Route path="/helps/:help" element={<Helps />} />
          <Route path="/Etiquette" element={<Etiquette />} />
          <Route path="/our-chefs" element={<ChefPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/about-us" element={<AboutUs />} />
          <Route
            path="*"
            element={"Page Not Found"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
