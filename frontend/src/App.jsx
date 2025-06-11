import React, { useState } from 'react';
import Whiteboard from './Whiteboard';
import Login from './Login';

const App = () => {
  const [user, setUser] = useState(null);

  return user ? <Whiteboard user={user} /> : <Login onJoin={setUser} />;
};

export default App;
