import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    const payload = {
      email,
      password,
    };
  
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
  
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.detail || 'Failed to register');
      }
  
      navigate('/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <form className="bg-white p-8 shadow-lg rounded-lg relative" onSubmit={handleRegister}>
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          className="block w-full p-2 mb-4 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="block w-full p-2 mb-4 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          type="submit"
          disabled={loading} 
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div
          onClick={() => navigate('/login')}
          className="mt-4 text-center text-blue-500 hover:text-blue-700 cursor-pointer py-2 rounded-lg transition"
          style={{ display: 'inline-block', width: '100%' }}
        >
          Hesabınız var mı? Giriş yapın
        </div>
      </form>
    </div>
  );
};

export default Register;
