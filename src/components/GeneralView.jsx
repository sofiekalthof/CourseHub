import Timeline from './Timeline';
import Typography from '@mui/material/Typography';
import ApexTimeline from "./ApexTimeline";
import ApexTimelineScatter from './ApexTimelineScatter';
import Card from '@mui/material/Card';
import { Grid } from '@mui/material';

function GeneralView() {
    return (
        <>
        <Grid container sx={{justifyContent:'center'}}>
          <Grid item >
            <Typography>
              Timeline
            </Typography>
          <Card variant="outlined" sx={{justifyContent: 'center', display: 'flex', width:1200}}> 
            <ApexTimelineScatter></ApexTimelineScatter>
          </Card>
          </Grid>
        </Grid>
    
    
    
        </>
      )
}

export default GeneralView;