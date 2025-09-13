'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  QrCodeScanner,
  FlashOn,
  FlashOff,
  CameraAlt,
  Close,
  CheckCircle,
} from '@mui/icons-material';
import QrScanner from 'qr-scanner';
import { rationAPI } from '@/lib/api';

interface QRScannerProps {
  open: boolean;
  onClose: () => void;
  onTransactionInitiated: (transactionId: string) => void;
  user: {
    selectedMember: {
      id: string;
      name: string;
    };
  };
}

export default function QRScanner({ open, onClose, onTransactionInitiated, user }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [open]);

  const startCamera = async () => {
    try {
      setError('');
      
      if (!videoRef.current) return;

      // Check if QR scanner is supported
      if (!QrScanner.hasCamera()) {
        setError('No camera found on this device.');
        return;
      }

      // Create QR scanner instance
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code detected:', result.data);
          processQRCode(result.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment', // Use back camera
        }
      );

      await qrScannerRef.current.start();
      setScanning(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied. Please allow camera permissions and try again.');
    }
  };

  const stopCamera = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setScanning(false);
  };

  const toggleFlash = async () => {
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.toggleFlash();
        setFlashOn(!flashOn);
      } catch (err) {
        console.error('Flash toggle error:', err);
      }
    }
  };

  const handleManualEntry = () => {
    const qrCode = prompt('Enter QR code manually:');
    if (qrCode) {
      processQRCode(qrCode);
    }
  };

  const processQRCode = async (qrCode: string) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await rationAPI.initiateTransaction(user.selectedMember.id, qrCode);
      setSuccess('Transaction initiated successfully!');
      onTransactionInitiated(response.transactionId);
      
      // Close scanner after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initiate transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: 'black',
          color: 'white',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Scan QR Code</Typography>
        <IconButton onClick={handleClose} color="inherit">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, position: 'relative', flex: 1 }}>
        {/* Camera View */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {scanning ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <QrCodeScanner sx={{ fontSize: 64, color: '#666', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Camera not available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please allow camera permissions to scan QR codes
              </Typography>
            </Box>
          )}

          {/* Scanning Overlay */}
          {scanning && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 250,
                height: 250,
                border: '2px solid #0ea5e9',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
              }}
            >
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 1,
                  position: 'relative',
                }}
              >
                {/* Corner indicators */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    width: 20,
                    height: 20,
                    borderTop: '3px solid #0ea5e9',
                    borderLeft: '3px solid #0ea5e9',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 20,
                    height: 20,
                    borderTop: '3px solid #0ea5e9',
                    borderRight: '3px solid #0ea5e9',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -2,
                    left: -2,
                    width: 20,
                    height: 20,
                    borderBottom: '3px solid #0ea5e9',
                    borderLeft: '3px solid #0ea5e9',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    width: 20,
                    height: 20,
                    borderBottom: '3px solid #0ea5e9',
                    borderRight: '3px solid #0ea5e9',
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Instructions */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 100,
              left: 20,
              right: 20,
              textAlign: 'center',
            }}
          >
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
              Point camera at QR code on dealer's machine
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Make sure the QR code is within the frame
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          {/* Flash Toggle */}
          <Button
            variant="outlined"
            startIcon={flashOn ? <FlashOff /> : <FlashOn />}
            onClick={toggleFlash}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            {flashOn ? 'Flash Off' : 'Flash On'}
          </Button>

          {/* Manual Entry */}
          <Button
            variant="outlined"
            startIcon={<CameraAlt />}
            onClick={handleManualEntry}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Manual Entry
          </Button>
        </Box>
      </DialogActions>

      {/* Error/Success Messages */}
      {error && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {success && (
        <Box sx={{ p: 2 }}>
          <Alert 
            severity="success" 
            icon={<CheckCircle />}
          >
            {success}
          </Alert>
        </Box>
      )}

      {loading && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <CircularProgress color="primary" />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Processing transaction...
          </Typography>
        </Box>
      )}
    </Dialog>
  );
}
