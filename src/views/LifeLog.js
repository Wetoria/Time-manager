import React, { Component, memo } from 'react';
import {
  Input,
  Button,
} from 'antd';

const { TextArea } = Input;

class LifeLog extends Component {
  state = {
    record: '',
  };

  onChange = ({ target: { value }}) => {
    this.setState({
      record: value,
    });
  }

  handleRecords = () => {
    const { record } = this.state;
    let [memoStr, reminderStr] = record.split('============');
    console.log(memoStr, reminderStr);
    memoStr = this.removeBlockTitle(memoStr);
    reminderStr = this.removeBlockTitle(reminderStr);
    console.log(memoStr, reminderStr);
    this.handleMemoStr(memoStr);
  }

  handleMemoStr = (memoStr) => {
    const oneMemoStrList = memoStr.split('———').map((item) => item.trim()).filter(item => item.length);
    console.log(oneMemoStrList);
    const oneMemoObjList = oneMemoStrList.map((oneMemoStr) => {
      const firstLineBreak = oneMemoStr.indexOf('\n');
      let memoInfo = '';
      let content = '';
      if (firstLineBreak !== -1) {
        memoInfo = oneMemoStr.substr(0, firstLineBreak);
        content = oneMemoStr.substr(firstLineBreak + 1);
      } else {
        memoInfo = oneMemoStr;
      }
      let lastUpdateTime;
      let createTime;
      let date;
      let title;
      const info = memoInfo.split(' - ');
      lastUpdateTime = info[0];
      title = info[2];
      const temp = info[1].split(' ');
      date = temp[0];
      createTime = temp[1];
      console.log(lastUpdateTime, date, createTime, title);
      return {
        date,
        createTime,
        lastUpdateTime,
        title,
        content,
      };
    });
    console.log(oneMemoObjList);
  }

  removeBlockTitle = (str) => {
    return str.split('———————')[1];
  }

  render() {
    const { record } = this.state;

    return (
      <div style={{ width: '300px', height: '400px' }}>
        <TextArea
          value={record}
          onChange={this.onChange}
          placeholder=""
          autosize={{ minRows: 3, maxRows: 5 }}
        />
        <Button onClick={this.handleRecords}>处理</Button>
      </div>
    );
  };
}

export default LifeLog;
