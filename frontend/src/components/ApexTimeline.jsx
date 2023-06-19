import React, { Component } from "react";
import Chart from "react-apexcharts";
  
export default function ApexTimeline(){
    const state = {
        series: [
        {
          data: [
            {
              x: 'Quiz',
              y: [
                new Date('2019-03-12').getTime(),
                new Date('2019-03-12').getTime()
              ]
            },
            {
              x: 'Lecture',
              y: [
                new Date('2019-03-12').getTime(),
                new Date('2019-03-12').getTime()
              ]
            },
            {
              x: 'Assignment',
              y: [
                new Date('2023-03-12').getTime(),
                new Date('2023-03-12').getTime()
              ]
            },
            {
              x: 'Exam',
              y: [
                new Date('2019-03-12').getTime(),
                new Date('2019-03-12').getTime()
              ]
            }
          ]
        }
      ],
      options:{
        chart: {
        height: 350,
        type: 'rangeBar'
      },
      plotOptions: {
        bar: {
          horizontal: true,
          isDumbbell: true
        }
      },
      xaxis: {
        type: 'datetime'
      }
    }
    };


        return (
            <>
                <Chart
                  options={state.options}
                  series={state.series}
                  type="rangeBar"
                  width="500"
                />
            </>
        );
      

}
        