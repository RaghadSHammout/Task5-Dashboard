import { useState, type FormEvent } from 'react';
import axios from 'axios';
import { Form, Card, Alert, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../log.css';
import MainBtn from '../../../components/AddBtn/MainBtn';

const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post(
        'https://web-production-3ca4c.up.railway.app/api/login',
        { email, password },
        { headers: { Accept: 'application/json' } }
      );

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setErrorMsg('');
        navigate('/dashboard');
      } else {
        setErrorMsg('Login failed.');
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || '';
      if (msg.includes('password')) {
        setErrorMsg('Incorrect password.');
      } else if (msg.includes('not found') || msg.includes('email')) {
        setErrorMsg('Email not found.');
      } else {
        setErrorMsg('An error occurred.');
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
        className="shadow rounded-4 w-100 p-4"
        style={{
          maxWidth: '400px',    
        }}
      >
        <div className="text-center mb-4">
          <img
            src="/images/focalX-logo.png"
            alt="Focal X"
            className="img-fluid logo"
            style={{ maxHeight: '40px' }}
          />
        </div>

        <h5 className="text-center fw-bold mb-2">SIGN IN</h5>
        <p className="text-center text-muted mb-3 card-p">
          Enter your credentials to access your account
        </p>

        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        <Form onSubmit={handleSubmit} className="d-flex flex-column">
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label className="text-muted">Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="sm"
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPassword">
            <Form.Label className="text-muted">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="sm"
            />
          </Form.Group>

          <MainBtn text="SIGN IN" className="full-width" type="submit" />
        </Form>

        <div className="text-center mt-3">
          <span className="text-secondary">Don't have an account? </span>
          <Link to="/Register" className="text-warning fw-semibold">
            Create one
          </Link>
        </div>
      </Card>
    </Container>
  );
};

export default SignIn;
