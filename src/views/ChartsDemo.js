import React, { Component } from 'react';

import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';

// 数据源
const data = [
  { genre: 'Sports', sold: 275, income: 2300 },
  { genre: 'Strategy', sold: 115, income: 667 },
  { genre: 'Action', sold: 120, income: 982 },
  { genre: 'Shooter', sold: 350, income: 5271 },
  { genre: 'Other', sold: 150, income: 3710 }
];

// 定义度量
const cols = {
  sold: { alias: '销售量' },
  genre: { alias: '游戏种类' }
};

class ChartsDemo extends Component {
  render() {
    return (
      <Chart width={600} height={400} data={data} scale={cols}>
        <Axis name="genre" title />
        <Axis name="sold" title />
        <Tooltip />
        <Geom type="interval" position="genre*sold" color="genre" />
      </Chart>
    );
  }
}

export default ChartsDemo;
