import React, { Component } from "react";
import Chart from "react-apexcharts";
  
export default function ApexTimelineScatter(props){
  const courseDates = props.courseDates;

    // Convert dates from database into values for the chart
  let dataForChart = []
  courseDates.map((dates) => {
    let datesWithValuesForCharts = [];
    dates.data.map((date) => {
        if(dates.type == 'Quiz'){
          datesWithValuesForCharts.push([date.getTime(), -1]);
        }
        if(dates.type == 'Assignment'){
          datesWithValuesForCharts.push([date.getTime(), -2]);
        }
        if(dates.type == 'Lecture'){
          datesWithValuesForCharts.push([date.getTime(), 1]);
        }
        if(dates.type == 'Exam'){
          datesWithValuesForCharts.push([date.getTime(), 2]);
        }
        
    })
    dataForChart.push({name: dates.type, id: dates.id, data: datesWithValuesForCharts})
  })
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
        size: 10
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
        