import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


function ShowTaskStatus({index, userData}) {
    if (userData.length == 0){
        return
    }
    if(userData[0].taskStatus[index].includes('due')){
        return <AccessTimeFilledIcon sx={{fontSize: 15, color: 'orange'}}/>
    }
    if(userData[0].taskStatus[index].includes('done')){
        return <CheckCircleIcon sx={{fontSize: 15, color: 'green'}}/>
    }
    if(userData[0].taskStatus[index].includes('missed')){
        return <CancelIcon sx={{fontSize: 15, color: 'red'}}/>
    }
}

function AssignmentList(props){
    // get CourseDates as a prop from GeneralView
    const tasks = props.tasks;
    const userData = props.userDataForCourse;


    // convert the Dates from a DateObject into a String for the AssignmentList
    let filteredDatesWithConvertedDates = []; 
    tasks.map((task) => {
        let convertedDates = []
        convertedDates.push(`${task.data.getDate()}/${task.data.getMonth()+1}/${task.data.getFullYear()}`);

        filteredDatesWithConvertedDates.push({type: task.type, id: task.id, data: convertedDates, assignmentStatus: task.assignmentStatus, quizstatus: task.quizstatus});
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

                                </TableCell>
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
                            {filteredDatesWithConvertedDates.map((task, index) => (
                                <TableRow key={task.id}>
                                    <TableCell>
                                        <ShowTaskStatus index={index} userData={userData}/>

                                    </TableCell>
                                    <TableCell>
                                        {task.data}
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