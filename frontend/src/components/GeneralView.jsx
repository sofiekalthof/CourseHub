import * as React from 'react';
import Timeline from './Timeline';
import Typography from '@mui/material/Typography';
import ApexTimeline from "./ApexTimeline";
import ApexTimelineScatter from './ApexTimelineScatter';
import Card from '@mui/material/Card';
import { Grid, Button, Menu, MenuItem } from '@mui/material';
import AssignmentList from "./AssignmentList";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';

function CreateNew({isOwner}){
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  if(isOwner){
    return (<><Button 
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
    }}
  >
    <MenuItem onClick={handleClose}>Quiz</MenuItem>
    <MenuItem onClick={handleClose}>Assignment</MenuItem>
  </Menu></>)
  }
}

function AddMileStone({isOwner}){
  if(isOwner){
    return <Button variant='outlined'>Add Milestone</Button>
  }
}

function GeneralView(props) {
  const [isOwner, setIsOwner] = useState(props.isOwner);

  console.log(props.selectedCourse.timeline.tasks);

    return (
        <>
        <Grid container sx={{justifyContent:'center'}} spacing={2}>
          <Grid item xs={10.25}>
            <Typography>
              Timeline
            </Typography>
          </Grid>
          <Grid item xs={1.75}>
            <AddMileStone isOwner={isOwner}></AddMileStone>
          </Grid>
          <Grid item xs={12}>
            <Card variant="outlined" sx={{justifyContent: 'center'}}> 
              <ApexTimelineScatter tasks={props.selectedCourse.timeline.tasks} milestones={props.selectedCourse.timeline.milestones}></ApexTimelineScatter>
            </Card>
          </Grid> 
          <Grid item xs={10.25}>
            <Typography>
              Assignments and Quizzes
            </Typography>
          </Grid>
          <Grid item xs={1.75}>
            <CreateNew isOwner={isOwner}></CreateNew>
          </Grid>
          <Grid item xs={12}>
            <Card variant="outlined" sx={{justifyContent: 'center'}}> 
              <AssignmentList tasks={props.selectedCourse.timeline.tasks}/>
            </Card>
          </Grid>
        </Grid>
    
    
    
        </>
      )
}

export default GeneralView;