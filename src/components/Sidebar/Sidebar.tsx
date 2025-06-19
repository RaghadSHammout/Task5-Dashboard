import { useEffect, useState } from 'react';
import { Image, Nav } from 'react-bootstrap';
import { BoxSeam, BoxArrowRight, Bookmark } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  first_name: string;
  last_name: string;
  profile_image_url: string;
}

export default function Sidebar() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.warn('You are not logged in. Please log in first.');
      return;
    }

    try {
      await axios.post(
        'https://web-production-3ca4c.up.railway.app/api/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      localStorage.removeItem('user');
      localStorage.removeItem('token');

      toast.success('You are logged out');

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed');
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center p-4 " style={{ width: '250px', minHeight: '100%', backgroundColor:"#F2EAE1" }}>
      
      <div className=" my-4 ps-3" style={{ borderLeft: '4px solid #F8D442' }}>
        <Image
          src="/images/focalX-logo.png"
          alt="logo"
          width={120}
        />
      </div>

      <Image
        src={user?.profile_image_url || "/images/blank-profile-picture-973460_1280.webp"}
        roundedCircle
        className="my-4"
        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/images/blank-profile-picture-973460_1280.webp";
        }}
      />
      <h6 className="fw-bold mb-4">
        {user ? `${user.first_name} ${user.last_name}` : 'User'}
      </h6>

      <Nav className="flex-column gap-4 mt-5">
        <Nav.Item className="d-flex justify-content-center align-item-center px-4 ">
          <Nav.Link
            eventKey="products"
            className="d-flex align-items-center gap-2 px-5 py-2 fw-medium text-dark bg-warning rounded "
            active
          >
            <BoxSeam size={18} />
            Products
          </Nav.Link>
        </Nav.Item>

        <Nav.Item className="d-flex justify-content-center align-item-center px-4 ">
          <Nav.Link
            eventKey="favorites"
            className="d-flex align-items-center gap-2 px-4 py-2 fw-medium text-dark rounded "
          >
            <Bookmark size={18} />
            Favorites
          </Nav.Link>
        </Nav.Item>

        <Nav.Item className="d-flex justify-content-center align-item-center px-4 ">
          <Nav.Link
            eventKey="orders"
            className="d-flex align-items-center gap-2 px-4 py-2 fw-medium text-dark rounded "
          >
            <i className="bi bi-card-checklist"></i>
                        <Bookmark size={18} />

            Order list
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="mt-auto ">
        <Nav.Link
          onClick={handleLogout}
          className="d-flex align-items-center gap-2 px-3 py-2 fw-medium text-dark "
        >
          <BoxArrowRight size={18} />
          Logout
        </Nav.Link>
      </div>

      <ToastContainer />
    </div>
  );
}
