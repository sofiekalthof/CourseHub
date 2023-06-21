import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid} from "@mui/material";

function AssignmentList(props){
    // get CourseDates as a prop from GeneralView
    const tasks = props.tasks;

    // convert the Dates from a DateObject into a String for the AssignmentList
    let filteredDatesWithConvertedDates = []; 
    tasks.map((task) => {
        let convertedDates = []
        task.data.map((taskDate) => {
            convertedDates.push(`${taskDate.getDate()}/${taskDate.getMonth()+1}/${taskDate.getFullYear()}`);
        })
        filteredDatesWithConvertedDates.push({type: task.type, id: task.id, data: convertedDates});
    })

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
                            {filteredDatesWithConvertedDates.map((task) => (
                                task.data.map((date) => (
                                <TableRow key={date}>
                                    <TableCell>
                                        {date}
                                    </TableCell>
                                    <TableCell>
                                        {task.type}
                                    </TableCell>
                                    <TableCell>

                                    </TableCell>
                                </TableRow>
                                ))
                                        
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