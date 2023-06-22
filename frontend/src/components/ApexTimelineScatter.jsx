import React, { Component } from "react";
import Chart from "react-apexcharts";
import { courseUser } from "../data/coursesMongoose";
import l from '../assets/L.svg';
  
export default function ApexTimelineScatter(props){
  const tasks = props.tasks;
  const milestones = props.milestones;

  // Convert dates from database into values for the chart
  const today = new Date();
  let dataForChart = []
  tasks.map((tasks) => {
    let tasksWithValuesForCharts = [];
    tasks.data.map((taskDate) => {
        if(tasks.type == 'Quiz' && taskDate.getTime()>today.getTime()){
          tasksWithValuesForCharts.push({x: taskDate.getTime(), y: -1, fillColor:'#D3D3D3'});
        }
        if(tasks.type == 'Quiz' && taskDate.getTime()<=today.getTime()){
          tasksWithValuesForCharts.push({x: taskDate.getTime(), y: -1});
        }
        if(tasks.type == 'Assignment' && taskDate.getTime()>today.getTime()){
          tasksWithValuesForCharts.push({x: taskDate.getTime(), y: -2,fillColor:'#D3D3D3' });
        }
        if(tasks.type == 'Assignment' && taskDate.getTime()<=today.getTime()){
          tasksWithValuesForCharts.push({x: taskDate.getTime(), y: -2 });
        }
        
    })
    dataForChart.push({name: tasks.type, id: tasks.id, data: tasksWithValuesForCharts})
  })

  milestones.map((milestone) => {
    let milestonesWithValuesForCharts = [];
    milestone.data.map((milestoneDate) => {
      if(milestone.type == 'Lecture' && milestoneDate.getTime()<=today.getTime()){
        milestonesWithValuesForCharts.push({x: milestoneDate.getTime(), y: 1});
      }
      if(milestone.type == 'Lecture' && milestoneDate.getTime()>today.getTime()){
        milestonesWithValuesForCharts.push({x: milestoneDate.getTime(), y: 1, fillColor:'#D3D3D3'});
      }
      if(milestone.type == 'Exam' && milestoneDate.getTime()>today.getTime()){
        milestonesWithValuesForCharts.push({x: milestoneDate.getTime(), y: 2, fillColor:'#D3D3D3'});
      }
      if(milestone.type == 'Exam' && milestoneDate.getTime()<=today.getTime()){
        milestonesWithValuesForCharts.push({x: milestoneDate.getTime(), y: 2});
      }
      if(milestone.type == 'Exercise' && milestoneDate.getTime()<=today.getTime()){
        milestonesWithValuesForCharts.push({x: milestoneDate.getTime(), y: 3});
      }
      if(milestone.type == 'Exercise' && milestoneDate.getTime()>today.getTime()){
        milestonesWithValuesForCharts.push({x: milestoneDate.getTime(), y: 3, fillColor:'#D3D3D3'});
      }
    })
    dataForChart.push({name: milestone.type, id: milestone.id, data: milestonesWithValuesForCharts});
  })
  // add a point for today to chart
 // dataForChart.push({name: "Today", id: -1, data: [{x: today.getTime(), y: 0, fillColor:'#000000' }]})


    const state = {
      options:{
        chart: {
        type: 'scatter'
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        show: false,
        forceNiceScale: true,
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
        colors: ['#1E90FF', '#FFD700', '#00EE76', '#FF3030', '#8B008B'],
        shape: 'circle',
        size: 10,
        strokeColor: ['#1E90FF', '#FFD700', '#00EE76', '#FF3030', '#8B008B'],
        strokeWidth: 3,
        strokeOpacity: 1,
      },
      legend:{
        markers: {
          fillColors: ['#1E90FF', '#FFD700', '#00EE76', '#FF3030', '#8B008B', 'black']
        }
      },
      /*fill: {
       type: 'image',
       image:{
           src: [l],
           width: 20,
           height: 20
        }
      },
      */
      
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
        