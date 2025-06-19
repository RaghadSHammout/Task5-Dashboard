import { useState } from 'react';
import { Form, Card, Row, Col, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../log.css";
import MainBtn from '../../../components/AddBtn/MainBtn';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    user_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    profile_image_url: null as File | null,
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'profile_image_url' && files) {
      setFormData({ ...formData, profile_image_url: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      alert('Passwords do not match');
      return;
    }

    const payload = new FormData();
    payload.append('first_name', formData.first_name);
    payload.append('last_name', formData.last_name);
    payload.append('user_name', formData.user_name);
    payload.append('email', formData.email);
    payload.append('password', formData.password);
    payload.append('password_confirmation', formData.password_confirmation);
    if (formData.profile_image_url) {
      payload.append('profile_image', formData.profile_image_url);
    }

    try {
      await axios.post(
        'https://web-production-3ca4c.up.railway.app/api/register',
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        }
      );

      alert('Signed up successfully ✅');

      const loginResponse = await axios.post(
        'https://web-production-3ca4c.up.railway.app/api/login',
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      const { user, token } = loginResponse.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      navigate('/dashboard');

    } catch (error: any) {
      if (error.response?.data?.message) {
        alert(`Registration failed ❌: ${error.response.data.message}`);
      } else {
        alert('Registration failed ❌');
      }
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center px-3 my-container"
      style={{ minHeight: '100vh' }}
    >
      <Card
        className="shadow rounded-4 log-card p-3 w-100"
        style={{
          maxWidth: '476px',
          width: '100%',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div className="text-center my-3">
          <img
            src="/images/focalX-logo.png"
            alt="Focal X"
            style={{ maxHeight: '50px', width: 'auto' }}
          />
        </div>

        <h6 className="text-center fw-bold mb-2">SIGN UP</h6>
        <p className="text-center text-muted mb-3" style={{ fontSize: '13px' }}>
          Fill in the following fields to create an account.
        </p>

        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Form.Label className="text-muted" style={{ fontSize: '14px' }}>Name</Form.Label>
            <Col xs={12} md={6}>
              <Form.Group controlId="firstName" className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="First name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  size="sm"
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="lastName" className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Last name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  size="sm"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-2" controlId="userName">
            <Form.Label className="text-muted" style={{ fontSize: '14px' }}>User Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter user name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              required
              size="sm"
            />
          </Form.Group>

          <Form.Group className="mb-2" controlId="email">
            <Form.Label className="text-muted" style={{ fontSize: '14px' }}>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              size="sm"
            />
          </Form.Group>

          <Row className="mb-2">
            <Form.Label className="text-muted" style={{ fontSize: '14px' }}>Password</Form.Label>
            <Col xs={12} md={6}>
              <Form.Group controlId="password" className="mb-2">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  size="sm"
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="passwordConfirmation" className="mb-2">
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  size="sm"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="text-muted" style={{ fontSize: '14px' }}>Profile Image</Form.Label>
            <div
              className="d-flex justify-content-center align-items-center rounded upload-img"
              style={{ height: '80px', backgroundColor: '#f9f9f9' }}
              onClick={() => document.getElementById('profileImageInput')?.click()}
            >
              <img
                src="/images/upload.png"
                alt="Upload"
                style={{ height: '40px', width: 'auto' }}
              />
            </div>
            <Form.Control
              type="file"
              id="profileImageInput"
              name="profile_image"
              onChange={handleChange}
              className="d-none"
              accept="image/*"
            />
          </Form.Group>

          <MainBtn text="SIGN UP" className="full-width" />
        </Form>

        <div className="text-center mt-3">
          <small className="text-muted">Do you have an account? </small>
          <Link to="/" className="text-warning small">Sign in</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Register;
