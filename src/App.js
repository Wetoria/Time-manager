import React from 'react';
import './App.css';

import LifeLog from './views/LifeLog';
import SummaryCharts from './views/SummaryCharts'
// import Evernote from './views/Evernote';



function App() {

  return (
    <div className="App">
      <LifeLog />
      <SummaryCharts />

      {/* <Evernote /> */}
    </div>
  );
}

export default App;
