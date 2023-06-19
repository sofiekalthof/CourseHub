import React from "react"
import { Chrono } from "react-chrono";
import Grid from '@mui/material/Grid';

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
    },
    {
      title: "4th July",
      cardTitle: "Quiz 2"
    },
    {
      title: "3rd August",
      cardTitle: "Exam"
    }, {
      title: "4th July",
      cardTitle: "Quiz 2"
    },
    {
      title: "3rd August",
      cardTitle: "Exam"
    }
    ];

    return (
      <Grid container>
        <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
            <Chrono mode="HORIZONTAL" focusActiveItemOnLoad={true} items={items} allowDynamicUpdate disableClickOnCircle lineWidth={10} borderLessCards={true} timelinePointShape="circle" timelinePointDimension={50} cardPositionHorizontal="Bottom" cardLess>
              <div className="chrono-icons">
                <img src="Quiz.png" alt="quiz" />
                <img src="Quiz.png" alt="quiz" />
              </div>
            </Chrono>
        </Grid>
      </Grid>
      
    )
  }