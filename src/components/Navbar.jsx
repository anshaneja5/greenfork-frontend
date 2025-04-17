import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiShoppingBag, FiPieChart, FiStar, FiHome } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-green-400 to-blue-500 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">🌿 GreenFork</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <NavLink to="/dashboard" icon={<FiHome />} text="Dashboard" />
                <NavLink to="/orders" icon={<FiShoppingBag />} text="Orders" />
                <NavLink to="/insights" icon={<FiPieChart />} text="Insights" />
                <NavLink to="/suggestions" icon={<FiStar />} text="Suggestions" />
                <NavLink to="/profile" icon={<FiUser />} text="Profile" />
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-300 flex items-center"
                  aria-label="Logout"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-green-200 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-green-500 px-4 py-2 rounded-full hover:bg-green-100 transition-colors duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-green-200 transition-colors duration-300"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <MobileNavLink to="/dashboard" icon={<FiHome />} text="Dashboard" />
                <MobileNavLink to="/orders" icon={<FiShoppingBag />} text="Orders" />
                <MobileNavLink to="/insights" icon={<FiPieChart />} text="Insights" />
                <MobileNavLink to="/suggestions" icon={<FiStar />} text="Suggestions" />
                <MobileNavLink to="/profile" icon={<FiUser />} text="Profile" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600 transition-colors duration-300"
                >
                  <FiLogOut className="inline mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" text="Login" />
                <MobileNavLink to="/register" text="Register" />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="text-white hover:text-green-200 transition-colors duration-300 flex items-center"
  >
    {icon && <span className="mr-1">{icon}</span>}
    {text}
  </Link>
);

const MobileNavLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-green-200 hover:bg-green-700 transition-colors duration-300"
  >
    {icon && <span className="mr-2">{icon}</span>}
    {text}
  </Link>
);

export default Navbar;
