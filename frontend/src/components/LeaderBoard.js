import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from '@mui/material';

const users = [
  { id: 1, name: 'Namebrand71', hoursListened: 3.17, profilePic: "https://i.scdn.co/image/ab67757000003b82234a24492ab5c69ea309f565" },
  { id: 2, name: 'baileyferris1212(and Sam 😀)', hoursListened: 2.93, profilePic: "https://i.scdn.co/image/ab67757000003b82acfaf73ed2933bfe374f9205"},
  { id: 3, name: 'james.vs.blorg', hoursListened: 2.55, profilePic: "https://i.scdn.co/image/ab67757000003b827b6332582990a79a561b9bee" },
];

const Leaderboard = () => {
  return (
    <TableContainer component={Paper} style={{ maxWidth: 650, margin: 'auto', marginTop: 20 }}>
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
