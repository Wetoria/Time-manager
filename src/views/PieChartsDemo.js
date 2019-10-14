import React from "react";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";

const testObj = {
  "固": {
    "timestamp": 44371,
    "formatString": "12小时 19分 31秒"
  },
  "玩": {
    "timestamp": 11153,
    "formatString": "3小时 5分 53秒"
  },
  "闲": {
    "timestamp": 8491,
    "formatString": "2小时 21分 31秒"
  },
  "工作": {
    "timestamp": 18188,
    "formatString": "5小时 3分 8秒"
  },
  "学": {
    "timestamp": 2637,
    "formatString": "0小时 43分 57秒"
  },
  "total": {
    "timestamp": 84840,
    "formatString": "23小时 34分 0秒"
  },
  "lastRecordTime": "23:34:00",
  "correct": true
};

const totalTimestampOfDay = 24 * 60 * 60;

class PieChartDemo extends React.Component {

  transformSummary(summary) {
    const results = [];
    for (let key in summary) {
      if (!['total', 'lastRecordTime', 'correct'].includes(key)) {
        const { timestamp } = summary[key];
        results.push({
          item: key,
          timestamp,
          percent: timestamp / totalTimestampOfDay,
        })
      }
    }
    const restTime = totalTimestampOfDay - summary.total.timestamp;
    if (restTime) {
      results.push({
        item: '未记录',
        timestamp: restTime,
        percent: restTime / totalTimestampOfDay,
      });
    }
    return results;
  }

  render() {
    const data = this.transformSummary(testObj);
    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + "%";
          return val;
        }
      }
    };
    return (
      <div>
        <Chart
          data={data}
          scale={cols}
          padding={0}
          width={300}
          height={300}
        >
          <Coord type="theta" radius={0.55} innerRadius={0.55} />
          <Axis name="percent" />
          <Geom
            type="intervalStack"
            position="percent"
            color={['item', (item) => {
              const colorMap = {
                '未记录': '#F4F6F6',
                '闲': '#F39C12',
                '玩': '#E74C3C',
                '学': '#2ECC71',
                '工作': '#1ABC9C',
                '固': '#3498DB',
              };
              return colorMap[item];
            }]}
            tooltip={[
              "item*percent",
              (item, percent) => {
                percent = percent * 100 + "%";
                return {
                  name: item,
                  value: percent
                };
              }
            ]}
            style={{
              lineWidth: 1,
              stroke: "#fff"
            }}
          >
            <Label
              content="percent"
              formatter={(val, item) => {
                const percent = item.point.percent * 100;
                const type = item.point.item;
                return  `${type}: ${percent.toFixed(0)}%`;
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}

export default PieChartDemo;
