import React from 'react';
import ProfilePage from './Components/ProfilePage'; // Import the ProfilePage component
import SideBar from './Components/Sidebar';

function App() {
  return (
    <div className="App">
      <SideBar></SideBar>
      <ProfilePage />
    </div>
  );
}

export default App;
