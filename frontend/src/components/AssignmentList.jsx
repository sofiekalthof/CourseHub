import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid} from "@mui/material";

function AssignmentList(){
    const tasks = [{
        id: 0, 
        type: "Assignment", 
        date: "June 17"
        },
        {
        id: 1, 
        type: "Quiz", 
        date: "June 18"
        }]

    return (
        <>
        <Grid container>
            <Grid item xs={12}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Due Date
                                </TableCell>
                                <TableCell>
                                    Assignment/Quiz
                                </TableCell>
                                <TableCell>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell>
                                        {task.date}
                                    </TableCell>
                                    <TableCell>
                                        {task.type}
                                    </TableCell>
                                    <TableCell>

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

export default AssignmentList;