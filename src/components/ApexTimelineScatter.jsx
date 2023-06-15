import React, { Component } from "react";
import Chart from "react-apexcharts";
  
export default function ApexTimelineScatter(){
    const state = {
        series: [
            {
              name: 'Quiz',
              data: [
                [new Date('2023-03-12').getTime(),
                -1]
              ]
            },
            {
              name: 'Assignment',
              data: [
                [new Date('2023-05-12').getTime(),
                -2]
              ]
            },
            {
              name: 'Lecture',
              data: [
                [new Date('2023-03-12').getTime(),
                1]
              ]
            },
            {
              name: 'Exam',
              data: [
                [new Date('2023-07-12').getTime(),
                2]
              ]
            }
      ],
      options:{
        chart: {
        height: 350,
        width: 1200,
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
        forceNiceScale: false
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
        enabled: true
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
                  series={state.series}
                  type="scatter"
                  width="1200"
                  height="200"
                />
            </>
        );
      

}
        