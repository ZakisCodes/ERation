'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Fingerprint,
  Face,
  Security,
  CheckCircle,
  Error,
  Info,
} from '@mui/icons-material';

interface BiometricAuthProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface BiometricCapability {
  type: 'fingerprint' | 'face' | 'voice';
  available: boolean;
  enrolled: boolean;
  name: string;
  icon: React.ReactNode;
}

export default function BiometricAuth({ onSuccess, onCancel }: BiometricAuthProps) {
  const [capabilities, setCapabilities] = useState<BiometricCapability[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        setIsSupported(false);
        return;
      }

      // Check available authenticators
      const availableCapabilities: BiometricCapability[] = [
        {
          type: 'fingerprint',
          available: false,
          enrolled: false,
          name: 'Fingerprint',
          icon: <Fingerprint />,
        },
        {
          type: 'face',
          available: false,
          enrolled: false,
          name: 'Face ID',
          icon: <Face />,
        },
      ];

      // Check if platform authenticator is available
      const isPlatformAuthenticatorAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      
      if (isPlatformAuthenticatorAvailable) {
        // Check which types are available
        try {
          const credential = await navigator.credentials.create({
            publicKey: {
              challenge: new Uint8Array(32),
              rp: { name: 'DigiRation' },
              user: {
                id: new Uint8Array(16),
                name: 'user',
                displayName: 'User',
              },
              pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
              authenticatorSelection: {
                authenticatorAttachment: 'platform',
                userVerification: 'required',
              },
              timeout: 60000,
              attestation: 'none',
            },
          });

          if (credential) {
            // Platform authenticator is available
            availableCapabilities.forEach(cap => {
              cap.available = true;
              cap.enrolled = true; // Assume enrolled if we can create
            });
          }
        } catch (err) {
          console.log('Platform authenticator not available:', err);
        }
      }

      setCapabilities(availableCapabilities);
      setIsSupported(availableCapabilities.some(cap => cap.available));
    } catch (error) {
      console.error('Error checking biometric support:', error);
      setIsSupported(false);
    }
  };

  const handleBiometricAuth = async () => {
    if (!selectedMethod) {
      setError('Please select a biometric method');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create credential for authentication
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: { name: 'DigiRation' },
          user: {
            id: new Uint8Array(16),
            name: 'user',
            displayName: 'User',
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 60000,
          attestation: 'none',
        },
      });

      if (credential) {
        // Store the credential for future use
        localStorage.setItem('biometric_credential', JSON.stringify({
          id: credential.id,
          type: credential.type,
        }));
        
        onSuccess();
      } else {
        setError('Biometric authentication failed');
      }
    } catch (error: any) {
      console.error('Biometric authentication error:', error);
      
      if (error.name === 'NotAllowedError') {
        setError('Biometric authentication was cancelled or not allowed');
      } else if (error.name === 'NotSupportedError') {
        setError('Biometric authentication is not supported on this device');
      } else if (error.name === 'SecurityError') {
        setError('Security error occurred during authentication');
      } else {
        setError('Biometric authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExistingAuth = async () => {
    setLoading(true);
    setError('');

    try {
      // Try to authenticate with existing credential
      const storedCredential = localStorage.getItem('biometric_credential');
      if (!storedCredential) {
        setError('No biometric credential found. Please set up biometric authentication first.');
        setLoading(false);
        return;
      }

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          allowCredentials: [JSON.parse(storedCredential)],
          userVerification: 'required',
          timeout: 60000,
        },
      });

      if (credential) {
        onSuccess();
      } else {
        setError('Biometric authentication failed');
      }
    } catch (error: any) {
      console.error('Biometric authentication error:', error);
      
      if (error.name === 'NotAllowedError') {
        setError('Biometric authentication was cancelled');
      } else {
        setError('Biometric authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <CardContent>
          <Error sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Biometric Authentication Not Available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Your device doesn't support biometric authentication or it's not set up.
          </Typography>
          <Button variant="outlined" onClick={onCancel}>
            Continue with Regular Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  const availableMethods = capabilities.filter(cap => cap.available);
  const hasExistingCredential = localStorage.getItem('biometric_credential');

  return (
    <Card sx={{ p: 3 }}>
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Security sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Biometric Authentication
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hasExistingCredential 
              ? 'Use your biometric to authenticate'
              : 'Set up biometric authentication for secure access'
            }
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {hasExistingCredential ? (
          // Existing authentication
          <Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleExistingAuth}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Fingerprint />}
              sx={{ mb: 2 }}
            >
              {loading ? 'Authenticating...' : 'Authenticate with Biometric'}
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
            >
              Use Password Instead
            </Button>
          </Box>
        ) : (
          // Setup new authentication
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Available Methods:
            </Typography>
            
            <List>
              {availableMethods.map((method) => (
                <ListItem key={method.type}>
                  <ListItemIcon>
                    {method.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={method.name}
                    secondary={method.enrolled ? 'Ready to use' : 'Not enrolled'}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={selectedMethod === method.type}
                        onChange={() => setSelectedMethod(method.type)}
                      />
                    }
                    label=""
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleBiometricAuth}
                disabled={!selectedMethod || loading}
                startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
              >
                {loading ? 'Setting up...' : 'Set Up Biometric'}
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
              >
                Skip
              </Button>
            </Box>
          </Box>
        )}

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Note:</strong> Biometric authentication is optional and provides an additional layer of security. 
            Your biometric data is stored securely on your device and never shared.
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
}
