import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

function AssignmentList(){
    return (
        <>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Assignment/Quiz
                        </TableCell>
                        <TableCell>
                            Date
                        </TableCell>
                        <TableCell>
                        </TableCell>
                    </TableRow>
                </TableHead>
            </Table>
        </TableContainer>
        </>
    )
}

export default AssignmentList;