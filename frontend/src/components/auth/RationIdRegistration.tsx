'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Phone, CreditCard } from '@mui/icons-material';
import { authAPI } from '@/lib/api';

interface RationIdRegistrationProps {
  onOTPSent: (rationCardId: string, mobileNumber: string) => void;
}

export default function RationIdRegistration({ onOTPSent }: RationIdRegistrationProps) {
  const [rationCardId, setRationCardId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateRationCardId = (id: string) => {
    // 10-digit ration card ID validation
    return /^[A-Z]{2}\d{8}$/.test(id);
  };

  const validateMobileNumber = (number: string) => {
    // Indian mobile number validation
    return /^[6-9]\d{9}$/.test(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!validateRationCardId(rationCardId)) {
        setError('Please enter a valid 10-digit Ration Card ID (e.g., RC12345678)');
        return;
      }

      if (!validateMobileNumber(mobileNumber)) {
        setError('Please enter a valid 10-digit mobile number');
        return;
      }

      if (!agreeToTerms) {
        setError('Please agree to the terms and privacy policy');
        return;
      }

      await authAPI.sendOTP(rationCardId, mobileNumber);
      onOTPSent(rationCardId, mobileNumber);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = rationCardId && mobileNumber && agreeToTerms && !loading;

  return (
    <Box className="min-h-screen bg-gray-50 p-4">
      <Box className="max-w-md mx-auto">
        {/* Header */}
        <Box className="text-center mb-8">
          <Typography variant="h4" className="font-bold text-primary-600 mb-2">
            DigiRation
          </Typography>
          <Typography variant="subtitle1" className="text-gray-600">
            Ration Shop App
          </Typography>
        </Box>

        {/* Welcome Card */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="text-center p-6">
            <Phone className="text-4xl text-primary-500 mb-4" />
            <Typography variant="h6" className="font-semibold mb-2">
              Welcome to DigiRation
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Get started by entering your Ration Card ID
            </Typography>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Registration Form */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Ration Card ID */}
              <TextField
                fullWidth
                label="Ration Card ID"
                placeholder="RC12345678"
                value={rationCardId}
                onChange={(e) => setRationCardId(e.target.value.toUpperCase())}
                required
                InputProps={{
                  startAdornment: <CreditCard className="mr-2 text-gray-400" />,
                }}
                helperText="Enter your 10-digit Ration Card ID"
                className="mb-4"
              />

              {/* Mobile Number */}
              <TextField
                fullWidth
                label="Mobile Number"
                placeholder="9876543210"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                required
                InputProps={{
                  startAdornment: <Phone className="mr-2 text-gray-400" />,
                }}
                helperText="Linked to ration card"
                className="mb-4"
              />

              {/* Terms Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" className="text-sm">
                    I agree to{' '}
                    <a href="#" className="text-primary-600 underline">
                      terms and conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary-600 underline">
                      privacy policy
                    </a>
                  </Typography>
                }
                className="mb-6"
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={!isFormValid}
                className="h-14 text-lg font-semibold"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Help Link */}
        <Box className="text-center mt-6">
          <Typography variant="body2" className="text-gray-600">
            Need help?{' '}
            <a href="#" className="text-primary-600 underline">
              Contact support
            </a>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
