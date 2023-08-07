import React, { Component } from "react";
import Chart from "react-apexcharts";

/**
 * The function `convertTaskDates` takes in an array of tasks and today's date, and converts the task
 * dates to a specific format for rendering in a chart.
 * @returns an array of objects. Each object represents a type of task (either "Assignment" or "Quiz")
 * and contains an array of task dates. Each task date is represented by an object with properties "x"
 * (the date in milliseconds), "y" (a marker value), and "fillColor" (optional, used to set the color
 * of the marker).
 */
function convertTaskDates(tasks, today) {
  let taskDates = [];
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
  taskDates.push({ name: "Assignment", data: assignmentDates });
  taskDates.push({ name: "Quiz", data: quizDates });
  return taskDates;
}

/**
 * The function `convertMilestoneDates` takes in an array of milestones and today's date, and converts
 * the milestone dates into a format suitable for rendering in a chart.
 * @returns an array of milestone dates. Each milestone date is an object with a name and data
 * property. The data property contains an array of lecture dates and exam dates. Each lecture date and
 * exam date is an object with x and y properties. The x property represents the date in milliseconds
 * since January 1, 1970, and the y property represents the type of milestone.
 */
function convertMilestoneDates(milestones, today) {
  let milestoneDates = [];
  let lectureDates = [];
  let examDates = [];
  //let exerciseDates = [];
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
  });
  milestoneDates.push({ name: "Lecture", data: lectureDates });
  milestoneDates.push({ name: "Exam", data: examDates });
  return milestoneDates;
}
/**
 * The function `Timeline` takes in tasks and milestones as props, converts the dates from
 * the database into values for the chart, and renders a scatter chart using the ApexCharts library.
 * @returns a JSX element that renders a Chart component. The Chart component is configured with
 * options and series data, and it is of type "scatter". The height of the chart is set to 200.
 */
export default function Timeline(props) {
  const tasks = props.tasks;
  const milestones = props.milestones;

  // Convert dates from database into values for the chart
  // First for all tasks
  const today = new Date();
  const taskDates = convertTaskDates(tasks, today);
  const milestoneDates = convertMilestoneDates(milestones, today);

  const dataForChart = taskDates.concat(milestoneDates);

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
        colors: ["#1E90FF", "#00e4f0", "#f000d0", "#fa5502"],
        shape: "circle",
        size: 8,
        strokeColor: ["#1E90FF", "#00e4f0", "#f000d0", "#fa5502"],
        strokeWidth: 3,
        strokeOpacity: 1,
      },
      legend: {
        markers: {
          fillColors: ["#1E90FF", "#00e4f0", "#f000d0", "#fa5502", "#000000"],
        },
      },
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
