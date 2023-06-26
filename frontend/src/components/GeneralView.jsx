import * as React from 'react';
import Timeline from './Timeline';
import Typography from '@mui/material/Typography';
import ApexTimeline from "./ApexTimeline";
import ApexTimelineScatter from './ApexTimelineScatter';
import Card from '@mui/material/Card';
import { Grid, Button, Menu, MenuItem, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, FormControl, InputLabel, Select } from '@mui/material';
import AssignmentList from "./AssignmentList";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Function for showing the create new button
function CreateNew({isOwner}){

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Function for showing the dropdown list for creating new task
  const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
  };

  // Function for closing dropdown
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Show Create New button only when user is owner of the course
  if(isOwner){
    return (
      <>
      <Button 
      variant='contained' 
      endIcon={<KeyboardArrowDownIcon />}
      aria-controls={open ? 'basic-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
      onClick={handleClick}>
        Create New
    </Button>
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}>
      <MenuItem onClick={handleClose}>Quiz</MenuItem>
      <MenuItem onClick={handleClose}>Assignment</MenuItem>
    </Menu>
    </>)
  }
}

// Function for Showing the Add Milestone button
function AddMileStone({isOwner}){
  const [open, setOpen] = useState(false);
  const [milestoneType, setMilestoneType] = useState('');
  const [date, setDate] = useState(dayjs())
  
  // Function for opening the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function for canceling the milestone creation
  const handleClickCancel = () => {
    setOpen(false);
    setMilestoneType('');
    setDate(dayjs());
  };
  
  // Function for saving the milestone
  // TODO: Connection to backend
  const handleClickSave = () => {

  }

  // Function for selecting milestone type
  const handleChange = (event) => {
    setMilestoneType(event.target.value);
  };
  
  // Show MileStone Button only when user is owner of course
  if(isOwner){
    return (
      <>
      <Button variant='outlined' onClick={handleClickOpen}>Add Milestone</Button>
      {/* Dialog for adding a new Milestone */}
      <Dialog open={open}>
        <DialogTitle>Add a milestone</DialogTitle>
        <DialogContent>
          {/* Dropdown Menu for selecting the Milestone Type */}
          <FormControl fullWidth>
            <InputLabel>Milestone Type</InputLabel>
            <Select value={milestoneType} label='MileStone Type' onChange={handleChange}>
              <MenuItem value={'Lecture'}>Lecture</MenuItem>
              <MenuItem value={'Exercise'}>Exercise</MenuItem>
              <MenuItem value={'Exam'}>Exam</MenuItem>
            </Select>
          </FormControl>
          {/* DatePicker for Selecting Milestone Date */}
          <FormControl fullWidth>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker value={date} onChange={(date) => setDate(date)}></DatePicker>
          </LocalizationProvider>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickSave}>Save</Button>
          <Button onClick={handleClickCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
      </>
    )
  }
}

function GeneralView(props) {
  const [isOwner, setIsOwner] = useState(props.isOwner);

    return (
        <>
        <Grid container sx={{justifyContent:'center'}} spacing={2}>
          <Grid item xs={10.25}>
            <Typography>
              Timeline
            </Typography>
          </Grid>
          {/* Button for adding a milestone */}
          <Grid item xs={1.75}>
            <AddMileStone isOwner={isOwner}></AddMileStone>
          </Grid>
          {/* Showing timeline */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{justifyContent: 'center'}}> 
              <ApexTimelineScatter tasks={props.selectedCourse.timeline.tasks} milestones={props.selectedCourse.timeline.milestones} user={props.user}></ApexTimelineScatter>
            </Card>
          </Grid> 
          <Grid item xs={10.25}>
            <Typography>
              Assignments and Quizzes
            </Typography>
          </Grid>
          {/* Button for creating a new task */}
          <Grid item xs={1.75}>
            <CreateNew isOwner={isOwner}></CreateNew>
          </Grid>
          {/* Showing Assignmentlist */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{justifyContent: 'center'}}> 
              <AssignmentList tasks={props.selectedCourse.timeline.tasks} user={props.user} userDataForCourse={props.userDataForCourse}/>
            </Card>
          </Grid>
        </Grid>
    
    
    
        </>
      )
}

export default GeneralView;