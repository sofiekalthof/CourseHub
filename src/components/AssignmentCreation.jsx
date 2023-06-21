import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';



import  { LocalizationProvider, DatePicker }  from '@mui/x-date-pickers';
import  {AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

function AssignmentCreation({ onAssignmentCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [deadline, setDeadline] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  const handleDeleteFile = (file) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  const handleDeadlineChange = (date) => {
    setDeadline(date);
  };

  const handleSubmit = () => {
    const assignment = {
      title,
      description,
      files,
      deadline,
    };
    onAssignmentCreated(assignment);
    setTitle('');
    setDescription('');
    setFiles([]);
    setDeadline(null);
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleDialogOpen}>
        Create Assignment
      </Button>

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Create new Assignment</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <TextField
              label="Title"
              value={title}
              onChange={handleTitleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={description}
              onChange={handleDescriptionChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              style={{ marginBottom: '16px' }}
              multiple
            />
            {files.length > 0 && (
              <List>
                {files.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={file.name} />
                    <IconButton onClick={() => handleDeleteFile(file)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
           <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker label="Basic date picker" />
      </DemoContainer>
    </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AssignmentCreation;
