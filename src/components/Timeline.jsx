import React from "react"
import { Chrono } from "react-chrono";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

export default function Timeline() {
    const items = [{
      title: "5th June",
      cardTitle: "Quiz 1"
    }, 
    {
      title: "4th July",
      cardTitle: "Quiz 2"
    },
    {
      title: "3rd August",
      cardTitle: "Exam"
    }
    ];

    return (
      <Grid>
        <div style={{ display:'flex', justifyContent:'center' }} >
        <Card variant="outlined"> 
          <div style={{ width: "800px", height: "400px", justifyContent:'center' }}>
          <Chrono mode="HORIZONTAL" items={items} hideControls={true} cardHeight={100} lineWidth={10} borderLessCards={true} timelinePointShape="circle" timelinePointDimension={50} cardPositionHorizontal="Bottom">
            <div className="chrono-icons">
              <img src="Quiz.png" alt="quiz" />
              <img src="Quiz.png" alt="quiz" />
            </div>
          </Chrono>
          </div>
        </Card>
        </div>
      </Grid>
      
    )
  }