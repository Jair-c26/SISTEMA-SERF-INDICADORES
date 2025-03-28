import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

const AddUserDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label="User ID" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="First Name" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Last Name" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Email ID" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Mobile No" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <Select fullWidth displayEmpty defaultValue="">
              <MenuItem value="">Select Role Type</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <TextField label="Username" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Password" type="password" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Confirm Password" type="password" fullWidth />
          </Grid>
        </Grid>
        
        {/* Permissions Table */}
        <Table sx={{ marginTop: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Module Permission</TableCell>
              <TableCell>Read</TableCell>
              <TableCell>Write</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {['Super Admin', 'Admin', 'Employee', 'Lorem Ipsum'].map((role) => (
              <TableRow key={role}>
                <TableCell>{role}</TableCell>
                <TableCell><Checkbox /></TableCell>
                <TableCell><Checkbox /></TableCell>
                <TableCell><Checkbox /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button variant="contained" color="primary">Add User</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
