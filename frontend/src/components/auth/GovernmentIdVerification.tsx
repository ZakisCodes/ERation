'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  TextField,
  Alert,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import { ArrowBack, QrCodeScanner, CreditCard, Person, HowToVote, DriveEta } from '@mui/icons-material';
import { authAPI } from '@/lib/api';
import { FamilyMember } from '@/types/auth';

interface GovernmentIdVerificationProps {
  member: FamilyMember;
  onVerificationComplete: () => void;
  onBack: () => void;
}

const idTypes = [
  {
    value: 'aadhaar',
    label: 'Aadhaar Card',
    icon: <CreditCard />,
    placeholder: '1234 5678 9012',
    pattern: /^\d{4}\s?\d{4}\s?\d{4}$/,
  },
  {
    value: 'pan',
    label: 'PAN Card',
    icon: <CreditCard />,
    placeholder: 'ABCDE1234F',
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  },
  {
    value: 'voter_id',
    label: 'Voter ID',
    icon: <HowToVote />,
    placeholder: 'ABC1234567',
    pattern: /^[A-Z]{3}[0-9]{7}$/,
  },
  {
    value: 'driving_license',
    label: 'Driver\'s License',
    icon: <DriveEta />,
    placeholder: 'DL1234567890123',
    pattern: /^DL\d{13}$/,
  },
];

export default function GovernmentIdVerification({
  member,
  onVerificationComplete,
  onBack,
}: GovernmentIdVerificationProps) {
  const [selectedIdType, setSelectedIdType] = useState('aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'manual' | 'qr'>('manual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedIdConfig = idTypes.find(type => type.value === selectedIdType);

  const handleIdTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIdType(event.target.value);
    setIdNumber('');
    setError('');
  };

  const handleIdNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.toUpperCase();
    
    // Format based on ID type
    if (selectedIdType === 'aadhaar') {
      value = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    
    setIdNumber(value);
    setError('');
  };

  const validateIdNumber = () => {
    if (!selectedIdConfig) return false;
    return selectedIdConfig.pattern.test(idNumber.replace(/\s/g, ''));
  };

  const handleScanQR = () => {
    // For demo purposes, we'll simulate QR scanning
    setVerificationMethod('qr');
    // In a real app, this would open the camera
    alert('QR Scanner would open here. For demo, please use manual entry.');
  };

  const handleVerify = async () => {
    setError('');
    setLoading(true);

    try {
      if (!validateIdNumber()) {
        setError(`Please enter a valid ${selectedIdConfig?.label} number`);
        return;
      }

      await authAPI.verifyGovernmentID(member.id, selectedIdType, idNumber.replace(/\s/g, ''));
      await authAPI.completeVerification(member.id);
      onVerificationComplete();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = validateIdNumber() && !loading;

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
            Verify Your Identity
          </Typography>
        </Box>

        {/* Header Card */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="text-center p-6">
            <CreditCard className="text-4xl text-primary-500 mb-4" />
            <Typography variant="h6" className="font-semibold mb-2">
              Identity Verification
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Please verify your identity using a government ID
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-2">
              Verifying: {member.name}
            </Typography>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {/* ID Type Selection */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
            <FormControl component="fieldset" className="w-full">
              <FormLabel component="legend" className="mb-4 font-semibold">
                Select Government ID Type
              </FormLabel>
              <RadioGroup
                value={selectedIdType}
                onChange={handleIdTypeChange}
                className="space-y-3"
              >
                {idTypes.map((idType) => (
                  <Card
                    key={idType.value}
                    className={`cursor-pointer transition-all ${
                      selectedIdType === idType.value
                        ? 'ring-2 ring-primary-500 bg-primary-50'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedIdType(idType.value)}
                  >
                    <CardContent className="p-4">
                      <FormControlLabel
                        value={idType.value}
                        control={<Radio />}
                        label={
                          <Box className="flex items-center">
                            {idType.icon}
                            <Typography className="ml-2 font-medium">
                              {idType.label}
                            </Typography>
                          </Box>
                        }
                        className="w-full"
                      />
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        {/* Verification Method */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
            <Typography variant="h6" className="mb-4 font-semibold">
              Verification Method
            </Typography>
            
            <Box className="space-y-4">
              {/* QR Scan Option */}
              <Card
                className={`cursor-pointer transition-all ${
                  verificationMethod === 'qr'
                    ? 'ring-2 ring-primary-500 bg-primary-50'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setVerificationMethod('qr')}
              >
                <CardContent className="p-4">
                  <Box className="flex items-center">
                    <QrCodeScanner className="text-2xl text-primary-500 mr-3" />
                    <Box>
                      <Typography variant="h6" className="font-medium">
                        Scan QR Code
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Use camera to scan QR code on your ID
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Manual Entry Option */}
              <Card
                className={`cursor-pointer transition-all ${
                  verificationMethod === 'manual'
                    ? 'ring-2 ring-primary-500 bg-primary-50'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setVerificationMethod('manual')}
              >
                <CardContent className="p-4">
                  <Box className="flex items-center">
                    <CreditCard className="text-2xl text-primary-500 mr-3" />
                    <Box>
                      <Typography variant="h6" className="font-medium">
                        Enter ID Number
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Manually enter your ID number
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Manual Entry Form */}
            {verificationMethod === 'manual' && (
              <Box className="mt-6">
                <TextField
                  fullWidth
                  label={`${selectedIdConfig?.label} Number`}
                  placeholder={selectedIdConfig?.placeholder}
                  value={idNumber}
                  onChange={handleIdNumberChange}
                  InputProps={{
                    startAdornment: selectedIdConfig?.icon,
                  }}
                  helperText={`Enter your ${selectedIdConfig?.label} number`}
                  className="mb-4"
                />
              </Box>
            )}

            {/* QR Scan Button */}
            {verificationMethod === 'qr' && (
              <Box className="mt-6">
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<QrCodeScanner />}
                  onClick={handleScanQR}
                  className="h-14 text-lg"
                >
                  Open QR Scanner
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Verify Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={!isFormValid}
          onClick={handleVerify}
          className="h-14 text-lg font-semibold"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Verifying...' : 'Complete Verification'}
        </Button>

        {/* Help Text */}
        <Box className="text-center mt-4">
          <Typography variant="body2" className="text-gray-600">
            Your information is secure and encrypted
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
