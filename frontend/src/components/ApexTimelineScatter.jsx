import React, { Component } from "react";
import Chart from "react-apexcharts";
import { courseUser } from "../data/coursesMongoose";
import l from "../assets/L.svg";

export default function ApexTimelineScatter(props) {
  const tasks = props.tasks;
  const milestones = props.milestones;

  // Convert dates from database into values for the chart
  // First for all tasks
  const today = new Date();
  let dataForChart = [];
  let assignmentDates = [];
  let quizDates = [];
  tasks.map((task) => {
    // convert mongodb data string to date
    let taskTime = new Date(task.data);
    // give marker grey color if date is in future
    if (task.type == "Quiz" && taskTime.getTime() > today.getTime()) {
      quizDates.push({ x: taskTime.getTime(), y: -1, fillColor: "#D3D3D3" });
    }
    if (task.type == "Quiz" && taskTime.getTime() <= today.getTime()) {
      quizDates.push({ x: taskTime.getTime(), y: -1 });
    }
    if (task.type == "Assignment" && taskTime.getTime() > today.getTime()) {
      assignmentDates.push({
        x: taskTime.getTime(),
        y: -2,
        fillColor: "#D3D3D3",
      });
    }
    if (task.type == "Assignment" && taskTime.getTime() <= today.getTime()) {
      assignmentDates.push({ x: taskTime.getTime(), y: -2 });
    }
  });
  dataForChart.push({ name: "Assignment", data: assignmentDates });
  dataForChart.push({ name: "Quiz", data: quizDates });

  // Second for all milestones
  let lectureDates = [];
  let examDates = [];
  let exerciseDates = [];
  milestones.map((milestone) => {
    // convert mongodb data string to date
    let milestoneTime = new Date(milestone.data);
    if (
      milestone.type == "Lecture" &&
      milestoneTime.getTime() <= today.getTime()
    ) {
      lectureDates.push({ x: milestoneTime.getTime(), y: 1 });
    }
    if (
      milestone.type == "Lecture" &&
      milestoneTime.getTime() > today.getTime()
    ) {
      lectureDates.push({
        x: milestoneTime.getTime(),
        y: 1,
        fillColor: "#D3D3D3",
      });
    }
    if (milestone.type == "Exam" && milestoneTime.getTime() > today.getTime()) {
      examDates.push({
        x: milestoneTime.getTime(),
        y: 2,
        fillColor: "#D3D3D3",
      });
    }
    if (
      milestone.type == "Exam" &&
      milestoneTime.getTime() <= today.getTime()
    ) {
      examDates.push({ x: milestoneTime.getTime(), y: 2 });
    }
    if (
      milestone.type == "Exercise" &&
      milestoneTime.getTime() <= today.getTime()
    ) {
      exerciseDates.push({ x: milestoneTime.getTime(), y: 3 });
    }
    if (
      milestone.type == "Exercise" &&
      milestoneTime.getTime() > today.getTime()
    ) {
      exerciseDates.push({
        x: milestoneTime.getTime(),
        y: 3,
        fillColor: "#D3D3D3",
      });
    }
  });
  // push all conveted data to dataForChart Array
  dataForChart.push({ name: "Lecture", data: lectureDates });
  dataForChart.push({ name: "Exercise", data: exerciseDates });
  dataForChart.push({ name: "Exam", data: examDates });
  // add a point for today to chart
  dataForChart.push({
    name: "Today",
    id: -1,
    data: [{ x: today.getTime(), y: 0, fillColor: "#000000" }],
  });

  const state = {
    options: {
      chart: {
        type: "scatter",
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        show: false,
        forceNiceScale: true,
        min: -3,
        max: 3,
      },
      grid: {
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
          max: 4,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
        y: {
          formatter: (y) => "",
          title: {
            formatter: (seriesName) => seriesName,
          },
        },
      },
      annotations: {
        yaxis: [
          {
            y: 0,
          },
        ],
      },
      markers: {
        colors: ["#1E90FF", "#FFD700", "#00EE76", "#FF3030", "#8B008B"],
        shape: "circle",
        size: 8,
        strokeColor: ["#1E90FF", "#FFD700", "#00EE76", "#FF3030", "#8B008B"],
        strokeWidth: 3,
        strokeOpacity: 1,
      },
      legend: {
        markers: {
          fillColors: [
            "#1E90FF",
            "#FFD700",
            "#00EE76",
            "#FF3030",
            "#8B008B",
            "#000000",
          ],
        },
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
    },
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
