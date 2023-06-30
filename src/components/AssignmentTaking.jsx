import React, { useState } from "react";
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
  Divider,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import GetAppIcon from "@mui/icons-material/GetApp";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

function AssignmentTaking({ assignment, onBackToAssignmentList }) {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [answerFile, setAnswerFile] = useState(null);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFinishAssignment = () => {
    setShowSummary(true);
  };

  const handleBackToAssignmentList = () => {
    onBackToAssignmentList();
  };
  
  const handleAnswerFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setAnswerFile(uploadedFile);
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
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: 1000,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              outline: "none",
              
            }}
          >
            {showSummary ? (
              renderAssignmentSummary()
            ) : (
              <Box sx={{
                p: 2,
                mb: 2,
                mt:2,
                maxHeight: "900px",
               
                overflow: "auto",
              }}>
                <Typography variant="h5" gutterBottom>
                  Assignment Details
                </Typography>
                <Divider sx={{ my: 2 }} /> {/* Line separating sections */}
                <Typography variant="body1" gutterBottom>
                  Title: {assignment.title}
                </Typography>
                <Divider sx={{ my: 2 }} /> {/* Line separating sections */}
                <Typography variant="body1" gutterBottom>
                  Deadline: {dayjs(assignment.deadline).format("LLL")}
                </Typography>
                
                <Divider sx={{ my: 2 }} /> {/* Line separating sections */}

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    Description:
                  </Typography>
                  
                  <Typography variant="body1" gutterBottom>
                    {assignment.description}
                  </Typography>
                  <Divider sx={{ my: 2 }} /> {/* Line separating sections */}
                </Box>

                {assignment.files && (
                  <Box mb={2}>
                    <Typography variant="body1" gutterBottom>
                      Uploaded Files:
                    </Typography>
                    <List>
                      {assignment.files.map((file, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <DescriptionIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={file.name}
                            secondary={file.type}
                          />
                          <IconButton href={file.url} download>
                            <GetAppIcon />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    Answer Description:
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
                </Box>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleAnswerFileChange}
                  style={{ display: "none" }}
                  id="upload-answer"
                />
                <label htmlFor="upload-answer">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Answer
                  </Button>
                </label>
                {answerFile && (
                  <Typography variant="body1" gutterBottom>
                    Selected Answer File: {answerFile.name}
                  </Typography>
                )}

                <Box mt={2}>
                  <Button variant="contained" onClick={handleFinishAssignment}>
                    Finish Assignment
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default AssignmentTaking;
