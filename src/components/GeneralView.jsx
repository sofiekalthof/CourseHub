import Timeline from './Timeline';
import Typography from '@mui/material/Typography';
import ApexTimeline from "./ApexTimeline";
import ApexTimelineScatter from './ApexTimelineScatter';
import Card from '@mui/material/Card';

function GeneralView() {
    return (
        <>
          Timeline
          <Card variant="outlined" sx={{justifyContent: 'center', display: 'flex', width:1200}}> 
            <Timeline></Timeline>
          </Card>
    
    
    
        </>
      )
}

export default GeneralView;