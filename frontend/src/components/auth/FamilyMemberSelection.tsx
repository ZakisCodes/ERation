'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, Person, CheckCircle, Warning, Cancel } from '@mui/icons-material';
import { authAPI } from '@/lib/api';
import { FamilyMember } from '@/types/auth';

interface FamilyMemberSelectionProps {
  rationCardId: string;
  onMemberSelected: (member: FamilyMember) => void;
  onBack: () => void;
}

export default function FamilyMemberSelection({
  rationCardId,
  onMemberSelected,
  onBack,
}: FamilyMemberSelectionProps) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFamilyMembers();
  }, [rationCardId]);

  const fetchFamilyMembers = async () => {
    try {
      const response = await authAPI.getFamilyMembers(rationCardId);
      setMembers(response.members);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load family members');
    } finally {
      setLoading(false);
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="text-green-500" />;
      case 'pending':
        return <Warning className="text-yellow-500" />;
      default:
        return <Cancel className="text-red-500" />;
    }
  };

  const getVerificationChip = (status: string) => {
    switch (status) {
      case 'verified':
        return <Chip label="Verified" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      default:
        return <Chip label="Not Verified" color="error" size="small" />;
    }
  };

  const handleMemberSelect = (member: FamilyMember) => {
    setSelectedMember(member);
  };

  const handleContinue = () => {
    if (selectedMember) {
      onMemberSelected(selectedMember);
    }
  };

  if (loading) {
    return (
      <Box className="min-h-screen bg-gray-50 flex items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

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
            Select Your Profile
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Family Header */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-4">
            <Box className="flex items-center">
              <Person className="text-2xl text-primary-500 mr-3" />
              <Box>
                <Typography variant="h6" className="font-semibold">
                  Kumar Family
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Ration Card: {rationCardId}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {members.length} family members
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Family Members */}
        <Box className="space-y-4 mb-6">
          {members.map((member) => (
            <Card
              key={member.id}
              className={`shadow-lg cursor-pointer transition-all ${
                selectedMember?.id === member.id
                  ? 'ring-2 ring-primary-500 bg-primary-50'
                  : 'hover:shadow-xl'
              }`}
              onClick={() => handleMemberSelect(member)}
            >
              <CardContent className="p-4">
                <Box className="flex items-center justify-between">
                  <Box className="flex items-center">
                    <Avatar className="w-12 h-12 mr-4 bg-primary-100">
                      {member.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" className="font-semibold">
                        {member.name}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        {member.age} years, {member.gender === 'M' ? 'Male' : 'Female'}
                      </Typography>
                      <Typography variant="body2" className="text-gray-500">
                        {member.relation}
                      </Typography>
                    </Box>
                  </Box>
                  <Box className="text-right">
                    {getVerificationIcon(member.verificationStatus)}
                    <Box className="mt-2">
                      {getVerificationChip(member.verificationStatus)}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Continue Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={!selectedMember}
          onClick={handleContinue}
          className="h-14 text-lg font-semibold"
        >
          Continue to Verification
        </Button>

        {/* Help Text */}
        <Box className="text-center mt-4">
          <Typography variant="body2" className="text-gray-600">
            Select the family member you are to continue with verification
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
