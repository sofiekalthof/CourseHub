import React, { useState } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

function AssignmentCreation({ onAssignmentCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [deadline, setDeadline] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
  
    // Check the file conditions before adding to the state
    const validFiles = uploadedFiles.filter((file) => {
      // Check the file type
      const fileType = file.type;
      const allowedFileTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"];
      if (!allowedFileTypes.includes(fileType)) {
        console.log(`Invalid file type: ${fileType}`);
        return false;
      }
  
      // Check the file size (in bytes)
      const fileSize = file.size;
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      if (fileSize > maxFileSize) {
        console.log(`File size exceeds the limit: ${fileSize}`);
        return false;
      }
  
      return true; // File meets the conditions
    });
  
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };
  

  const handleDeleteFile = (file) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  const handleDeadlineChange = (date) => {
    setDeadline(date);
  };

  const handleSubmit = () => {
    if (title.trim() === "") {
      setError("Please enter a title");
      return;
    }

    if (description.trim() === "") {
      setError("Please enter a description");
      return;
    }

    if (deadline === null) {
      setError("Please select a deadline");
      return;
    }
    

    const assignment = {
      title,
      description,
      files,
      deadline,
    };
    onAssignmentCreated(assignment);
    setTitle("");
    setDescription("");
    setFiles([]);
    setDeadline(null);
    setIsDialogOpen(false);
    setError(""); // Clear the error after successful submission
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setError(""); // Clear the error when closing the dialog
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
              style={{ marginBottom: "16px" }}
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
              <DemoItem label="DateTimePicker">
                <DateTimePicker
                  value={deadline}
                  onChange={handleDeadlineChange}
                  disablePast
                  views={["year", "month", "day", "hours", "minutes"]}
                />
              </DemoItem>
            </LocalizationProvider>
            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
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
