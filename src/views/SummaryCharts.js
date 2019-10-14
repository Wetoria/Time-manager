import React, { Component } from 'react';
import PieChartDemo from './PieChartsDemo';

import fs from 'fs';

const baseRecordsPath = './records';


class SummaryCharts extends Component {
  state = {
    recordSummaries: [],
  }

  getAllRecordsSummaryFilePath = () => {
    fs.readdir(baseRecordsPath, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        this.readAllRecordsSummary(files);
      }
    });
  }

  readAllRecordsSummary = (paths) => {
    const results = [];
    paths.forEach((path) => {
      if (path.endsWith('统计.json')) {
        const record = JSON.parse(fs.readFileSync(baseRecordsPath + "/" + path));
        results.push(record);
      }
    });
    console.log(results);
    results.sort((dayA, dayB) => {
      const dayATimestamp = new Date(`${dayA.date} 00:00:00`).getTime();
      const dayBTimestamp = new Date(`${dayB.date} 00:00:00`).getTime();
      return dayBTimestamp - dayATimestamp;
    })
    this.setState({
      recordSummaries: results,
    });
  }

  componentDidMount = () => {
    console.log('did mounted');
    this.getAllRecordsSummaryFilePath();
  }

  render() {
    const { recordSummaries } = this.state;
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {
          recordSummaries.map(item => (
            <div
              style={{
                width: '400px',
                height: '450px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              key={item.date}
            >
              <PieChartDemo summary={item} />
              <span>{ `${item.date}记录` }</span>
            </div>
          ))
        }
      </div>
    );
  }
}

export default SummaryCharts;
