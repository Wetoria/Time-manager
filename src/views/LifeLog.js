import React, { Component } from 'react';
import {
  Input,
  Button,
} from 'antd';

const { TextArea } = Input;
const fs = window.require('electron').remote.require('fs');
const exec = require('child_process').exec;


class LifeLog extends Component {
  state = {
    record: '',
  };

  onChange = ({ target: { value }}) => {
    this.setState({
      record: value,
    });
  }

  getNotes = () => {
    const path = './scripts/evernote.scpt';
    exec('osascript ' + path, (err, stdout) => {
      if (err) {
        console.log(err);
      } else {
        const result = stdout;
        const recordStrList = result.split('memo:').filter(item => item.length);
        console.log(recordStrList);
        const recordObjList = recordStrList.map((recordStr) => {
          const temp = recordStr.split('§');
          const title = temp[0];
          const content = temp[1].replace(/(<\/div>)|(<br\/>)/g, '\n').replace(/(<div id="en-note">)|(<div>)/g, '');
          return {
            title,
            content,
          };
        });
        console.log(recordObjList);
        recordObjList.forEach((record) => {
          const {
            title,
            content,
          } = record;
          const fileContent = this.handleRecords(content);
          this.writeToFile(`${title}.json`, JSON.stringify(fileContent, null, 2));
          const timeCostStatistics = this.calculateTypeTimeCost(fileContent);
          for (let key in timeCostStatistics) {
            timeCostStatistics[key] = this.timeFormat(timeCostStatistics[key]);
          }
          this.writeToFile(`${title}-统计.json`, JSON.stringify(timeCostStatistics, null, 2));
        });
      }
    });
  }

  calculateTypeTimeCost = (records) => {
    const resultMap = {};
    records.forEach((record) => {
      const {
        type,
      } = record;
      resultMap[type] = resultMap[type] ? resultMap[type] + record.timeCost : record.timeCost;
    });
    console.log(resultMap);
    return resultMap;
  }

  handleRecords = (record) => {
    let [memoStr, reminderStr] = record.split('============');
    console.log(memoStr, reminderStr);
    memoStr = this.removeBlockTitle(memoStr);
    reminderStr = this.removeBlockTitle(reminderStr);
    // console.log(memoStr, reminderStr);
    const results = this.handleMemoStr(this.trim(memoStr));
    this.calculateTimeCost(results);
    return results;
  }

  handleMemoStr = (memoStr) => {
    const oneMemoStrList = memoStr.split('———').filter(item => item.length);
    // console.log(oneMemoStrList);
    const oneMemoObjList = oneMemoStrList.map((oneMemoStr) => {
      return this.handleEachMemoStr(this.trim(oneMemoStr));
    });
    return oneMemoObjList;
  }

  calculateTimeCost = (records) => {
    records.forEach((record) => {
      record.time = new Date(`${record.date} ${record.lastUpdateTime}`).getTime();
    });
    records.forEach((record, index) => {
      const lastRecord = records[index - 1];
      const lastRecordTime = lastRecord ? lastRecord.time : new Date(`${record.date} 00:00:00`).getTime();
      record.timeCost = (record.time - lastRecordTime) / 1000;
      record.formatTimeCost = this.timeFormat(record.timeCost);
    })
  }

  timeFormat = (time) => {
    const hour = parseInt(time / 3600);
    const minute = parseInt((time % 3600) / 60);
    const second = time % 60;
    return `${hour}小时 ${minute}分 ${second}秒`;
  }

  trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  }

  handleEachMemoStr(str) {
    const firstLineBreak = str.indexOf('\n');
    let memoInfo = '';
    let content = '';
    if (firstLineBreak !== -1) {
      memoInfo = str.substr(0, firstLineBreak);
      content = str.substr(firstLineBreak + 1);
    } else {
      memoInfo = str;
    }
    let lastUpdateTime;
    let createTime;
    let date;
    let title;
    let type = '';
    const info = memoInfo.split(' - ');
    lastUpdateTime = info[0];
    title = info[2];
    const temp = info[1].split(' ');
    date = temp[0];
    createTime = temp[1];
    if (title.indexOf('：') !== -1) {
      type = title.split('：')[0];
    }
    return {
      date,
      createTime,
      lastUpdateTime,
      title,
      type,
      content,
    };
  }

  writeToFile(fileName, str) {
    fs.writeFile(`./records/${fileName}`, str, (err) => {
      if (err) {
        console.log(err);
      }
      console.log('done');
    });
  }

  removeBlockTitle = (str) => {
    return str.split('———————')[1];
  }

  render() {
    const { record } = this.state;

    return (
      <div style={{ width: '300px', height: '400px' }}>
        <Button onClick={this.getNotes}>获取记录</Button>
        <TextArea
          value={record}
          onChange={this.onChange}
          placeholder=""
          autosize={true}
        />
        <Button onClick={() => this.handleRecords(this.state.record)}>处理</Button>
      </div>
    );
  };
}

export default LifeLog;
