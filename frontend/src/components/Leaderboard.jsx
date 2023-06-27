import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";

function createSortedListWithScore(dataOfAllUsersForThisCourse) {
  let usersWithScore = [];
  dataOfAllUsersForThisCourse.map((user) => {
    let userscore = 0;
    user.taskStatus.map((status) => {
      if (status.includes("done")) {
        userscore += 1;
      }
    });
    usersWithScore.push({
      name: user.subscriber.username,
      id: user.subscriber.id,
      score: userscore,
    });
  });
  usersWithScore.sort((a, b) => b.score - a.score);
  return usersWithScore;
}

function SetScore({ userTaskStatus }) {
  let userscore = 0;
  userTaskStatus.map((status) => {
    if (status.includes("done")) {
      userscore += 1;
    }
  });
  return userscore;
}

function Leaderboard(props) {
  const dataOfAllUsersForThisCourse = props.dataOfAllUsersForThisCourse;
  const usersWithScore = createSortedListWithScore(dataOfAllUsersForThisCourse);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Position</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersWithScore.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>#{index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}

export default Leaderboard;