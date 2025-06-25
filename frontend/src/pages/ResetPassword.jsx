import React, {  useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').slice(0, 6);
    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post('/api/auth/send-reset-otp', { email });
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpString = inputRefs.current.map((ref) => ref.value).join('');
    if (otpString.length < 6) return toast.error("Please enter full 6-digit OTP");

    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    const otp = inputRefs.current.map((ref) => ref.value).join('');
    try {
      const { data } = await axiosInstance.post('/api/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt=''
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      {/* Step 1: Email Input */}
      {!isEmailSent && (
        <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={onSubmitEmail}>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your registered email address</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} className='w-3 h-3' />
            <input
              type='email'
              placeholder='Email id'
              className='bg-transparent outline-none text-white'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-300 text-white rounded-full mt-3 cursor-pointer'>
            Submit
          </button>
        </form>
      )}

      {/* Step 2: OTP Input */}
      {!isOtpSubmitted && isEmailSent && (
        <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={onSubmitOTP}>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email.</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type='text'
                  maxLength='1'
                  required
                  ref={(el) => (inputRefs.current[index] = el)}
                  className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer'>
            Submit
          </button>
        </form>
      )}

      {/* Step 3: New Password */}
      {isOtpSubmitted && isEmailSent && (
        <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={onSubmitNewPassword}>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your new password below</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} className='w-3 h-3' />
            <input
              type='password'
              placeholder='Password'
              className='bg-transparent outline-none text-white'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-300 text-white rounded-full mt-3 cursor-pointer'>
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
