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
        <Grid container sx={{justifyContent:'center', width:1200}}>
          <Grid item >
            <Typography>
              Timeline
            </Typography>
          <Card variant="outlined" sx={{justifyContent: 'center', display: 'flex'}}> 
            <ApexTimelineScatter></ApexTimelineScatter>
          </Card>
          </Grid>
          <Grid item>
            <Typography>
              Assignments and Quizzes
            </Typography>
            <Card variant="outlined" sx={{justifyContent: 'center', display: 'flex', width:1200}}> 
            <AssignmentList/>
            </Card>
          </Grid>
        </Grid>
    
    
    
        </>
      )
}

export default GeneralView;