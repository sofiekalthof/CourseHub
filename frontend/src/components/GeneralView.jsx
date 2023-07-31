import * as React from "react";
import ApexTimelineScatter from "./ApexTimelineScatter";
import AssignmentList from "./AssignmentList";
import CreateTask from "./CreateTask";
import CreateMileStone from "./CreateMilestone";
import {
  Grid,
  Button,
  Typography,
  Card,
} from "@mui/material";
import { useState } from "react";


/**
 * The GeneralView component renders a timeline and a list of assignments and quizzes, with the ability
 * to add milestones and tasks if the user is the owner.
 * @returns The GeneralView component is returning a JSX structure that includes a Grid container with
 * multiple Grid items. Inside each Grid item, there are various components being rendered, such as
 * Typography, CreateMileStone, ApexTimelineScatter, CreateTask, and AssignmentList.
 */
function GeneralView(props) {
  const [isOwner, setIsOwner] = useState(props.isOwner);

  return (
    <>
      <Grid container sx={{ justifyContent: "center" }} spacing={2}>
        <Grid item xs={6.25} sm={9} md={9.85} lg={10.25}>
          <Typography variant="h6">Timeline</Typography>
        </Grid>
        {/* Button for adding a milestone */}
        <Grid item xs={5.75} sm={3} md={2.15} lg={1.75}>
          <CreateMileStone
            selectedCourseTimelineId={props.selectedCourse.timeline._id}
            subscriberTimelines={props.subscriberTimelines}
            createAndSaveMilestone={props.createAndSaveMilestone}
            coursePageRerenderValue={props.coursePageRerenderValue}
            coursePageRerender={props.coursePageRerender}
            isOwner={isOwner}
          ></CreateMileStone>
        </Grid>
        {/* Showing timeline */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ justifyContent: "center" }}>
            <ApexTimelineScatter
              tasks={props.selectedCourse.timeline.tasks}
              milestones={props.selectedCourse.timeline.milestones}
              user={props.user}
            ></ApexTimelineScatter>
          </Card>
        </Grid>
        <Grid item xs={6.25} sm={9} md={9.85} lg={10.25}>
          <Typography variant="h6">Assignments and Quizzes</Typography>
        </Grid>
        {/* Button for creating a new task */}
        <Grid item xs={5.75} sm={3} md={2.15} lg={1.75}>
          <CreateTask
            dataOfAllUsersForThisCourse={props.dataOfAllUsersForThisCourse}
            selectedCourseTimelineId={props.selectedCourse.timeline._id}
            subscriberTimelines={props.subscriberTimelines}
            createAndSaveTask={props.createAndSaveTask}
            coursePageRerenderValue={props.coursePageRerenderValue}
            coursePageRerender={props.coursePageRerender}
            isOwner={isOwner}
          ></CreateTask>
        </Grid>
        {/* Showing Assignmentlist */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ justifyContent: "center" }}>
            <AssignmentList
              dataOfAllUsersForThisCourse={props.dataOfAllUsersForThisCourse}
              tasks={props.selectedCourse.timeline.tasks}
              user={props.user}
              userDataForCourse={props.userDataForCourse}
              coursePageRerenderValue={props.coursePageRerenderValue}
              coursePageRerender={props.coursePageRerender}
              selectedCourseTimelineId={props.selectedCourse.timeline._id}
              takeTask={props.takeTask}
              isOwner={isOwner}
            />
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default GeneralView;
