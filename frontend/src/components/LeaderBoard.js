import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from '@mui/material';

// MOCK DATA
const users = [
  {
    id: 1,
    name: 'User 1',
    hoursListened: 120,
    profilePic: 'https://via.placeholder.com/40',
  },
  {
    id: 2,
    name: 'User 2',
    hoursListened: 110,
    profilePic: 'https://via.placeholder.com/40',
  },
  {
    id: 3,
    name: 'User 3',
    hoursListened: 105,
    profilePic: 'https://via.placeholder.com/40',
  },
];

const Leaderboard = () => {
  return (
    <TableContainer
      component={Paper}
      style={{
        marginTop: 20,
        marginBottom: '40px',
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Profile</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Hours Listened</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Avatar alt={user.name} src={user.profilePic} />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.hoursListened}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Leaderboard;
