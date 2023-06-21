import React, { useState } from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material';



function AssignmentList({ assignments, onAssignmentSelected, onAssignmentDelete }) {
  return (
    <div>
      <h2>Assignment List</h2>
      {assignments && assignments.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Assignment Title</TableCell> 
                <TableCell align="center">Actions</TableCell> 
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell component="th" scope="row">
                    {assignment.title} 
                  </TableCell>
                  <TableCell align="center">
                    <Button variant="contained" onClick={() => onAssignmentSelected(assignment)}>
                      Take Assignment 
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => onAssignmentDelete(assignment.id)}>
                      Delete 
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No assignments available.</p>
      )}
    </div>
  );
}

export default AssignmentList;