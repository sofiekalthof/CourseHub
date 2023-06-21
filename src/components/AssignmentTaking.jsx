import React, { useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Modal,
  Backdrop,
  Fade,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';

function AssignmentTaking({ assignment, onBackToAssignmentList }) {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFinishAssignment = () => {
    // Do something with the description and file, e.g., upload the file to a server
    setShowSummary(true);
  };

  const handleBackToAssignmentList = () => {
    onBackToAssignmentList();
  };

  const renderAssignmentSummary = () => {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Assignment Submitted
        </Typography>
        <Typography variant="body1" gutterBottom>
          Description: {description}
        </Typography>
        <Typography variant="body1" gutterBottom>
          File: {file && file.name}
        </Typography>
        <Box mt={2}>
          <Button variant="contained" onClick={handleBackToAssignmentList}>
            Back to Assignment List
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <div>
      <Modal
        open={true}
        onClose={handleBackToAssignmentList}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={true}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              maxWidth: 600,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 2,
              outline: 'none',
            }}
          >
            {showSummary ? (
              renderAssignmentSummary()
            ) : (
              <Box sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Assignment Details
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Deadline: {assignment.deadline}
                </Typography>
                {assignment.file && (
                  <Box mb={2}>
                    <Typography variant="body1" gutterBottom>
                      Uploaded File:
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText primary={assignment.file.name} secondary={assignment.file.type} />
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                      </ListItem>
                    </List>
                  </Box>
                )}
                <Typography variant="body1" gutterBottom>
                  Description:
                </Typography>
                <TextField
                  value={description}
                  onChange={handleDescriptionChange}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
                <input
                  type="file"
                  accept="*"
                  onChange={handleFileChange}
                  style={{ marginBottom: '10px' }}
                />
                <Button variant="contained" onClick={handleFinishAssignment}>
                  Finish Assignment
                </Button>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default AssignmentTaking;
