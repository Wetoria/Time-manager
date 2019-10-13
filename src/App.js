import React from 'react';
import './App.css';

import LifeLog from './views/LifeLog';
import ChartsDemo from './views/ChartsDemo';
// import Evernote from './views/Evernote';

function App() {
  return (
    <div className="App">
      <LifeLog />
      <ChartsDemo />
      {/* <Evernote /> */}
    </div>
  );
}

export default App;
