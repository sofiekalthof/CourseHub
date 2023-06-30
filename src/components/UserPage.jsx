import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Paper, Tab, Tabs, Tooltip } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

export default function UserPage() {
  const [userInfo, setUserInfo] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    faculity: 'Angewandte Informatik',
    isEditing: false,
    newPassword: '',
    currentPassword: '',
    originalUserInfo: null,
  });

  const [activeTab, setActiveTab] = useState(0);

  const handleEditClick = () => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      isEditing: true,
      originalUserInfo: { ...prevUserInfo },
    }));
  };

  const handleSaveClick = () => {
    // Perform the save operation here, e.g., send updated user info to the server
    // After successful save, update the state and set isEditing to false
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      isEditing: false,
      originalUserInfo: null,
    }));
  };
  const handleCancelClick = () => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      isEditing: false,
      firstName: prevUserInfo.originalUserInfo.firstName,
      lastName: prevUserInfo.originalUserInfo.lastName,
      email: prevUserInfo.originalUserInfo.email,
      facility: prevUserInfo.originalUserInfo.facility,
      originalUserInfo: null,
    }));
  };


  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
  };

  const handlePhotoChange = () => {
    // Handle the logic to change the user's photo here
    // This is just a placeholder function
    console.log('Change Photo');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box sx={{ width: '25%', bgcolor: '#f5f5f5', p: '1rem' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <Box sx={{ position: 'relative', width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden' }}>
            <img src="./userprofile.png" alt="Profile Pic" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <Tooltip title="Change Photo" placement="left">
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '5px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  opacity: 0.3,
                  transition: 'opacity 0.3s',
                  '&:hover': { opacity: 1 },
                }}
                onClick={handlePhotoChange}
              >
                <CameraAltIcon fontSize="large" color="primary" />
              </Box>
            </Tooltip>
          </Box>
          <Typography variant="h6" sx={{ mt: '1rem' }}>
            {userInfo.firstName} {userInfo.lastName}
          </Typography>
        </Box>
        <Box sx={{ mt: '2rem' }}>
          <Tabs value={activeTab} onChange={handleTabChange} orientation="vertical" variant="fullWidth">
            <Tab label="Profile Info" />
            <Tab label="Settings" />
          </Tabs>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ width: '75%', p: '1rem' }}>
        {activeTab === 0 && (
          <Paper sx={{ p: '1rem' }}>
            <Typography variant="h6">User Info</Typography>
            <TextField
              label="First Name"
              name="firstName"
              value={userInfo.firstName}
              onChange={handleInputChange}
              disabled={!userInfo.isEditing}
              fullWidth
              sx={{ mt: '1rem' }}
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={userInfo.lastName}
              onChange={handleInputChange}
              disabled={!userInfo.isEditing}
              fullWidth
              sx={{ mt: '1rem' }}
            />
            <TextField
              label="Email"
              name="email"
              value={userInfo.email}
              onChange={handleInputChange}
              disabled={!userInfo.isEditing}
              fullWidth
              sx={{ mt: '1rem' }}
            />
            <TextField
              label="Faculity"
              name="faculity"
              value={userInfo.faculity}
              onChange={handleInputChange}
              disabled={!userInfo.isEditing}
              fullWidth
              sx={{ mt: '1rem' }}
            />
            {!userInfo.isEditing && (
                  <Button variant="outlined" onClick={handleEditClick} sx={{ mt: '1rem', mr: '1rem' }}>
                    Edit
                  </Button>
                )}
                {userInfo.isEditing && (
                  <>
                    <Button variant="outlined" onClick={handleSaveClick} sx={{ mt: '1rem', mr: '1rem' }}>
                      Save
                    </Button>
                    <Button variant="outlined" onClick={handleCancelClick} sx={{ mt: '1rem' }}>
                      Cancel
                    </Button>
                  </>
                )}
          </Paper>
        )}
        {activeTab === 1 && (
          <Paper sx={{ p: '1rem' }}>
            <Typography variant="h6">Settings</Typography>
            <TextField
              label="Current Password"
              type="password"
              name="currentPassword"
              value={userInfo.currentPassword}
              onChange={handleInputChange}
              fullWidth
              sx={{ mt: '1rem' }}
            />
            <TextField
              label="New Password"
              type="password"
              name="newPassword"
              value={userInfo.newPassword}
              onChange={handleInputChange}
              fullWidth
              sx={{ mt: '1rem' }}
            />
            <Button variant="outlined" sx={{ mt: '1rem' }}>
              Submit
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
