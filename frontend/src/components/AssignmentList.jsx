import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid} from "@mui/material";

function AssignmentList(props){
    // get CourseDates as a prop from GeneralView
    const courseDates = props.courseDates;

    // filter courseDates to have only Assignments and Quizzes in it
    let filteredDates = courseDates.filter((date) => date.type.includes("Quiz") | date.type.includes("Assignment"));
    
    // convert the Dates from a DateObject into a String for the AssignmentList
    let filteredDatesWithConvertedDates = []; 
    filteredDates.map((dates) => {
        let convertedDates = []
        dates.data.map((date) => {
            convertedDates.push(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`);
        })
        filteredDatesWithConvertedDates.push({type: dates.type, id: dates.id, data: convertedDates});
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