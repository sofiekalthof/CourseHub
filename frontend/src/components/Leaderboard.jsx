import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Alert,
} from "@mui/material";

/**
 * The function creates a sorted list of users with their scores based on the completion status of
 * their tasks.
 * @returns an array of objects, where each object represents a user with their name, id, and score.
 * The array is sorted in descending order based on the score.
 */
function createSortedListWithScore(dataOfAllUsersForThisCourse) {
  let usersWithScore = [];
  dataOfAllUsersForThisCourse.map((user) => {
    let userscore = 0;
    // extract useful information first
    let taskStatusData = user.usertimeline.usertimeline.userTasksStats;
    userscore = determineScoreOfUser(taskStatusData)
    usersWithScore.push({
      name: user.username,
      id: user.subscriber,
      score: userscore,
    });
  });
  usersWithScore.sort((a, b) => b.score - a.score);
  return usersWithScore;
}

/**
 * The function calculates the user's score based on their task status.
 * @returns the total score of the user, which is the number of tasks that have a status of "done".
 */
function determineScoreOfUser(userTaskStatus) {
  let userscore = 0;
  userTaskStatus.map((status) => {
    if (status.userTaskSatus.includes("done")) {
      userscore += 1;
    }
  });
  return userscore;
}

/* The `Leaderboard` function is a React component that displays a leaderboard table. It takes in a
`props` object as a parameter, which contains the `dataOfAllUsersForThisCourse` array. */
function Leaderboard(props) {
  const dataOfAllUsersForThisCourse = props.dataOfAllUsersForThisCourse;
  const usersWithScore = createSortedListWithScore(dataOfAllUsersForThisCourse);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#5CDB95" }}>
                <TableRow>
                  <TableCell>Position</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersWithScore.length == 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Alert severity="info">
                        No scores from other users available
                      </Alert>
                    </TableCell>
                  </TableRow>
                ) : (
                  usersWithScore.map((user, index) => (
                    <TableRow key={user.id}>
                      {user.id == props.user.id ? (
                        <TableCell sx={{ color: "#379683" }}>
                          #{index + 1}
                        </TableCell>
                      ) : (
                        <TableCell>#{index + 1}</TableCell>
                      )}
                      {user.id == props.user.id ? (
                        <TableCell sx={{ color: "#379683" }}>
                          {user.name} (You)
                        </TableCell>
                      ) : (
                        <TableCell>{user.name}</TableCell>
                      )}
                      {user.id == props.user.id ? (
                        <TableCell sx={{ color: "#379683" }}>
                          {user.score}
                        </TableCell>
                      ) : (
                        <TableCell>{user.score}</TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}

export default Leaderboard;
