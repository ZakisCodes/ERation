'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  Person,
  Phone,
  Email,
  Home,
  Notifications,
  DarkMode,
  Info,
  Edit,
  Logout,
  CheckCircle,
  Warning,
  Language,
  Security,
  Share,
} from '@mui/icons-material';
import { useTheme } from '@/lib/theme';
import { useTranslation } from '@/lib/i18n';

interface ProfileScreenProps {
  user: {
    rationCardId: string;
    familyName: string;
    selectedMember: {
      id: string;
      name: string;
      age: number;
      gender: string;
      relation: string;
      verificationStatus: string;
    };
  };
  onLogout: () => void;
}

export default function ProfileScreen({ user, onLogout }: ProfileScreenProps) {
  const { mode, toggleTheme } = useTheme();
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.selectedMember.name,
    phone: '9876543210',
    email: 'rajesh@email.com',
    address: '123 Main Street, Mumbai, Maharashtra',
  });

  const handleEditProfile = () => {
    setEditDialogOpen(true);
  };

  const handleSaveProfile = () => {
    // In a real app, you would save to the backend
    console.log('Saving profile:', editForm);
    setEditDialogOpen(false);
  };

  const getVerificationChip = (status: string) => {
    switch (status) {
      case 'verified':
        return <Chip label="Verified" color="success" size="small" icon={<CheckCircle />} />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" icon={<Warning />} />;
      default:
        return <Chip label="Not Verified" color="error" size="small" />;
    }
  };

  return (
    <Box sx={{ pb: 8 }}>
      {/* Profile Header */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: 'white' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)', mr: 3, fontSize: 24 }}>
              {user.selectedMember.name.charAt(0)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                {user.selectedMember.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                {user.selectedMember.relation} • {user.selectedMember.age} years
              </Typography>
              {getVerificationChip(user.selectedMember.verificationStatus)}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Phone sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2">
              +91 98765 43210
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Email sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2">
              rajesh@email.com
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Home sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2">
              123 Main Street, Mumbai, Maharashtra
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Account Settings
            </Typography>
          </Box>
          
          <List sx={{ p: 0 }}>
            <ListItem sx={{ px: 3, py: 2 }}>
              <ListItemIcon>
                <Edit />
              </ListItemIcon>
              <ListItemText
                primary="Edit Personal Details"
                secondary="Update your contact information"
              />
              <Button variant="outlined" size="small" onClick={handleEditProfile}>
                Edit
              </Button>
            </ListItem>
            
            <Divider />
            
            <ListItem sx={{ px: 3, py: 2 }}>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText
                primary="Transaction Alerts"
                secondary="Get notified about transaction updates"
              />
              <Switch
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                color="primary"
              />
            </ListItem>
            
            <Divider />
            
            <ListItem sx={{ px: 3, py: 2 }}>
              <ListItemIcon>
                <DarkMode />
              </ListItemIcon>
              <ListItemText
                primary="Dark Mode"
                secondary="Switch to dark theme"
              />
              <Switch
                checked={mode === 'dark'}
                onChange={toggleTheme}
                color="primary"
              />
            </ListItem>
            
            <Divider />
            
            <ListItem 
              sx={{ px: 3, py: 2, cursor: 'pointer' }}
              onClick={() => setLanguageDialogOpen(true)}
            >
              <ListItemIcon>
                <Language />
              </ListItemIcon>
              <ListItemText
                primary="Language"
                secondary={availableLanguages.find(lang => lang.code === language)?.nativeName || 'English'}
              />
            </ListItem>
            
            <Divider />
            
            <ListItem sx={{ px: 3, py: 2 }}>
              <ListItemIcon>
                <Security />
              </ListItemIcon>
              <ListItemText
                primary="Biometric Authentication"
                secondary="Use fingerprint or face ID"
              />
              <Button variant="outlined" size="small">
                Setup
              </Button>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              App Information
            </Typography>
          </Box>
          
          <List sx={{ p: 0 }}>
            <ListItem sx={{ px: 3, py: 2 }}>
              <ListItemIcon>
                <Info />
              </ListItemIcon>
              <ListItemText
                primary="About App"
                secondary="Version 1.0.0"
              />
            </ListItem>
            
            <Divider />
            
            <ListItem sx={{ px: 3, py: 2 }}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText
                primary="Ration Card ID"
                secondary={user.rationCardId}
              />
            </ListItem>
            
            <Divider />
            
            <ListItem sx={{ px: 3, py: 2 }}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText
                primary="Family Name"
                secondary={user.familyName}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <List sx={{ p: 0 }}>
            <ListItem 
              sx={{ px: 3, py: 2, cursor: 'pointer' }}
              onClick={onLogout}
            >
              <ListItemIcon>
                <Logout color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                secondary="Sign out of your account"
                primaryTypographyProps={{ color: 'error' }}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Personal Details</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Phone Number"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={3}
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Language Selection Dialog */}
      <Dialog open={languageDialogOpen} onClose={() => setLanguageDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Language</DialogTitle>
        <DialogContent>
          <List>
            {availableLanguages.map((lang) => (
              <ListItem
                key={lang.code}
                button
                onClick={() => {
                  setLanguage(lang.code);
                  setLanguageDialogOpen(false);
                }}
                selected={language === lang.code}
              >
                <ListItemText
                  primary={lang.nativeName}
                  secondary={lang.name}
                />
                {language === lang.code && <CheckCircle color="primary" />}
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLanguageDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
