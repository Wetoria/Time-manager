import React from 'react';
import './App.css';

import LifeLog from './views/LifeLog';
import ChartsDemo from './views/ChartsDemo';
import PieChartDemo from './views/PieChartsDemo';
// import Evernote from './views/Evernote';

function App() {
  return (
    <div className="App">
      <LifeLog />
      <div style={{ width: '300px', height: '300px' }}>
        <PieChartDemo />
      </div>
      {/* <Evernote /> */}
    </div>
  );
}

export default App;
