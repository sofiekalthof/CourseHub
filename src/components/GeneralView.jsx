import Timeline from './Timeline';
import Typography from '@mui/material/Typography';
import ApexTimeline from "./ApexTimeline";
import ApexTimelineScatter from './ApexTimelineScatter';
import Card from '@mui/material/Card';
import { Grid } from '@mui/material';
import AssignmentList from "./AssignmentList"

function GeneralView() {
    return (
        <>
        <Grid container sx={{justifyContent:'center'}} xs={12}>
          <Grid item xs={12}>
            <Typography>
              Timeline
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Card variant="outlined" sx={{justifyContent: 'center'}}> 
              <ApexTimelineScatter></ApexTimelineScatter>
            </Card>
          </Grid> 
          <Grid item xs={12}>
            <Typography>
              Assignments and Quizzes
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Card variant="outlined" sx={{justifyContent: 'center'}}> 
              <AssignmentList/>
            </Card>
          </Grid>
        </Grid>
    
    
    
        </>
      )
}

export default GeneralView;