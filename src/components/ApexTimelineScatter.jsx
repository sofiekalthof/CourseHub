import React, { Component } from "react";
import Chart from "react-apexcharts";
  
export default function ApexTimelineScatter(){
    const state = {
        series: [
            {
              name: 'Quiz',
              data: [
                [new Date('2023-03-12').getTime(),
                2]
              ]
            },
            {
              name: 'Lecture',
              data: [
                [new Date('2023-05-12').getTime(),
                3]
              ]
            },
            {
              name: 'Assignment',
              data: [
                [new Date('2023-03-12').getTime(),
                4]
              ]
            },
            {
              name: 'Exam',
              data: [
                [new Date('2023-04-12').getTime(),
                5]
              ]
            }
      ],
      options:{
        chart: {
        height: 350,
        width: 1200,
        type: 'scatter'
      },
      plotOptions: {
        
      },
      xaxis: {
        type: 'datetime',
        tickAmount: 5,
        max: new Date('2023-06-01').getTime(),
        min: new Date('2023-03-01').getTime(),
      },
      yaxis: {
        show: false,
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
            }
        },  
      },
      tooltip: {
        enabled: true
      }
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
        