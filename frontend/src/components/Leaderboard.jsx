import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid} from "@mui/material";

function SetScore({userTaskStatus}) {
    let userscore = 0;
    userTaskStatus.map((status) => {
        if(status.includes('done')){
            userscore += 1
        }
    })
    return userscore
}

function Leaderboard(props){
    const dataOfAllUsersForThisCourse = props.dataOfAllUsersForThisCourse;
    

    return (
        <>
        <Grid container>
            <Grid item xs={12}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>

                                </TableCell>
                                <TableCell>
                                    User
                                </TableCell>
                                <TableCell>
                                    Score
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataOfAllUsersForThisCourse.map((user) => (
                                <TableRow key={user.subscriber.id}>
                                    <TableCell>

                                    </TableCell>
                                    <TableCell>
                                        {user.subscriber.username}
                                    </TableCell>
                                    <TableCell>
                                        <SetScore userTaskStatus={user.taskStatus}></SetScore>
                                    </TableCell>
                                </TableRow>
                            ))}
                            
                        </TableBody>
                    </Table>
                </TableContainer>

            </Grid>
        </Grid>
        </>
    )
}

export default Leaderboard;