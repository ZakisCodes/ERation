'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  CircularProgress,
  TextField,
} from '@mui/material';
import { ArrowBack, Sms } from '@mui/icons-material';
import { authAPI } from '@/lib/api';

interface OTPVerificationProps {
  rationCardId: string;
  mobileNumber: string;
  onOTPVerified: (token: string) => void;
  onBack: () => void;
}

export default function OTPVerification({
  rationCardId,
  mobileNumber,
  onOTPVerified,
  onBack,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    setError('');
    setLoading(true);

    try {
      const otpString = otp.join('');
      const response = await authAPI.verifyOTP(otpString, rationCardId, mobileNumber);
      onOTPVerified(response.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setLoading(true);
    setCanResend(false);
    setResendTimer(30);

    try {
      await authAPI.sendOTP(rationCardId, mobileNumber);
      // Start timer again
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
      setCanResend(true);
    } finally {
      setLoading(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <Box className="min-h-screen bg-gray-50 p-4">
      <Box className="max-w-md mx-auto">
        {/* Header */}
        <Box className="flex items-center mb-6">
          <Button
            onClick={onBack}
            startIcon={<ArrowBack />}
            className="text-gray-600"
          >
            Back
          </Button>
          <Typography variant="h6" className="ml-4 font-semibold">
            Verify Mobile Number
          </Typography>
        </Box>

        {/* Status Card */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="text-center p-6">
            <Sms className="text-4xl text-green-500 mb-4" />
            <Typography variant="h6" className="font-semibold mb-2">
              OTP Sent!
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              We've sent a 6-digit code to
            </Typography>
            <Typography variant="body1" className="font-medium">
              +91 {mobileNumber}
            </Typography>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {/* OTP Input */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
            <Typography variant="h6" className="mb-4 text-center">
              Enter OTP
            </Typography>
            <Box className="flex justify-center space-x-2 mb-6">
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: 'center', fontSize: '1.5rem' },
                  }}
                  className="w-12 h-12"
                  variant="outlined"
                />
              ))}
            </Box>

            {/* Verify Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={!isOtpComplete || loading}
              onClick={handleVerify}
              className="h-14 text-lg font-semibold mb-4"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>

            {/* Resend Timer */}
            <Box className="text-center">
              {canResend ? (
                <Button
                  onClick={handleResend}
                  disabled={loading}
                  className="text-primary-600"
                >
                  Resend Code
                </Button>
              ) : (
                <Typography variant="body2" className="text-gray-600">
                  Resend OTP in {resendTimer}s
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <Typography variant="h6" className="mb-3">
              Didn't receive OTP?
            </Typography>
            <Box className="space-y-2 text-sm text-gray-600">
              <Typography>• Check your SMS folder</Typography>
              <Typography>• Verify mobile number is correct</Typography>
              <Typography>• Contact support if issue persists</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
