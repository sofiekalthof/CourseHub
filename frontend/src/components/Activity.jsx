import * as React from "react";
import Chart from "react-apexcharts";

// Dtermine the taskScore of a user per month
function determineTaskScorePerMonth(tasks, userDataForCourse) {
  let taskScoreList = [];
  let janScore = 0;
  let febScore = 0;
  let marScore = 0;
  let aprScore = 0;
  let mayScore = 0;
  let junScore = 0;
  let julScore = 0;
  let augScore = 0;
  let sepScore = 0;
  let octScore = 0;
  let novScore = 0;
  let decScore = 0;
  tasks.map((task, index) => {
    if (
      task.data.getMonth() + 1 == 1 &&
      userDataForCourse[0].taskStatus[index].includes("done")
    ) {
      janScore += 1;
    }
    if (
      task.data.getMonth() + 1 == 2 &&
      userDataForCourse[0].taskStatus[index].includes("done")
    ) {
      febScore += 1;
    }
    if (
      task.data.getMonth() + 1 == 3 &&
      userDataForCourse[0].taskStatus[index].includes("done")
    ) {
      marScore += 1;
    }
    if (
      task.data.getMonth() + 1 == 4 &&
      userDataForCourse[0].taskStatus[index].includes("done")
    ) {
      aprScore += 1;
    }
    if (
      task.data.getMonth() + 1 == 5 &&
      userDataForCourse[0].taskStatus[index].includes("done")
    ) {
      mayScore += 1;
    }
    if (
      task.data.getMonth() + 1 == 6 &&
      userDataForCourse[0].taskStatus[index].includes("done")
    ) {
      junScore += 1;
    }
    if (
      task.data.getMonth() + 1 == 7 &&
      userDataForCourse[0].taskStatus[index].includes("done")
    ) {
      julScore += 1;
    }
    if (
      task.data.getMonth() + 1 == 8 &&
      userDataForCourse[0].taskStatus[index].includes("done")
    ) {
      augScore += 1;
    }
    if (
      task.data.getMonth() + 1 == 9 &&
      userDataForCourse[0].taskStatus[index].includes("done")
    ) {
      sepScore += 1;
    }
    if (
      task.data.getMonth() + 1 == 10 &&
      userDataForCourse[0].taskStatus[index].includes("done")
    ) {
      octScore += 1;
    }
    if (
      task.data.getMonth() + 1 == 11 &&
      userDataForCourse[0].taskStatus[index].includes("done")
    ) {
      novScore += 1;
    }
    if (
      task.data.getMonth() + 1 == 12 &&
      userDataForCourse[0].taskStatus[index].includes("done")
    ) {
      decScore += 1;
    }
  });
  taskScoreList.push({
    name: "Score",
    data: [
      janScore,
      febScore,
      marScore,
      aprScore,
      mayScore,
      junScore,
      julScore,
      augScore,
      sepScore,
      octScore,
      novScore,
      decScore,
    ],
  });
  return taskScoreList;
}

function Activity(props) {
  const userDataForCourse = props.userDataForCourse;
  const tasks = props.tasks;
  const taskScoreList = determineTaskScorePerMonth(tasks, userDataForCourse);

  const state = {
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      colors: ["#379683"],
    },
  };

  return (
    <>
      <Chart
        options={state.options}
        series={taskScoreList}
        type="line"
        height="200"
      />
    </>
  );
}
export default Activity;
