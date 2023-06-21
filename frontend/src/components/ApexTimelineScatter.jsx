import React, { Component } from "react";
import Chart from "react-apexcharts";
  
export default function ApexTimelineScatter(props){
  const tasks = props.tasks;
  const milestones = props.milestones;
  console.log(tasks);
  console.log(milestones);

    // Convert dates from database into values for the chart
  let dataForChart = []
  tasks.map((tasks) => {
    let tasksWithValuesForCharts = [];
    tasks.data.map((taskDate) => {
        if(tasks.type == 'Quiz'){
          tasksWithValuesForCharts.push([taskDate.getTime(), -1]);
        }
        if(tasks.type == 'Assignment'){
          tasksWithValuesForCharts.push([taskDate.getTime(), -2]);
        }
        
    })
    dataForChart.push({name: tasks.type, id: tasks.id, data: tasksWithValuesForCharts})
  })

  milestones.map((milestone) => {
    console.log(milestone)
    let milestonesWithValuesForCharts = [];
    milestone.data.map((milestoneDate) => {
      if(milestone.type == 'Lecture'){
        milestonesWithValuesForCharts.push([milestoneDate.getTime(), 1]);
      }
      if(milestone.type == 'Exam'){
        milestonesWithValuesForCharts.push([milestoneDate.getTime(), 2]);
      }
      if(milestone.type == 'Exercise'){
        milestonesWithValuesForCharts.push([milestoneDate.getTime(), 3]);
      }
    })
    dataForChart.push({name: milestone.type, id: milestone.id, data: milestonesWithValuesForCharts});
  })
  console.log(dataForChart)


    const state = {
      options:{
        chart: {
        type: 'scatter'
      },
      xaxis: {
        type: 'datetime',
        tickAmount: 5,
        max: new Date('2023-08-01').getTime(),
        min: new Date('2023-03-01').getTime(),
      },
      yaxis: {
        show: false,
        forceNiceScale: false,
        min: -3,
        max: 3
      },
      grid:{
        xaxis: {
            lines: {
                show: true
            },
        },   
        yaxis: {
            lines: {
                show: false
            },
            max: 4
        },  
      },
      tooltip: {
        enabled: true,
        x:{
          show: false
        },
        y: {
          formatter: (y) => "",
          title:{
            formatter: (seriesName) => seriesName
          }
        }
      },
      annotations:{
        yaxis: [{
          y: 0
        }]
      },
      markers:{
        shape: 'circle',
        size: 10,
        colors: []
      },
      legend:{
        markers: {
          fillColors: []
        }
      },
      fill: {
      //  type: 'image',
      //  opacity: 1,
        //image:{
            //src: ['../src/assets/Quiz.png', '../src/assets/Assignment.png', '../src/assets/Lecture.jpg', '../src/assets/Exam.png'],
          //  width: 17.5,
           // height: 17.5
        //}
      },
      
    }
    };


        return (
            <>
                <Chart
                  options={state.options}
                  series={dataForChart}
                  type="scatter"
                  height="200"
                />
            </>
        );
      

}
        