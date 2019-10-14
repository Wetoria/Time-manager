import React from "react";
import {
  Chart,
  Geom,
  Axis,
  Coord,
  Label,
  Tooltip,
} from "bizcharts";


const totalTimestampOfDay = 24 * 60 * 60;

class PieChartDemo extends React.Component {

  transformSummary(summary) {
    if (!summary && !summary.correct) return summary;
    const results = [];
    for (let key in summary) {
      if (!['total', 'lastRecordTime', 'correct'].includes(key)) {
        const { timestamp, formatString } = summary[key];
        results.push({
          item: key,
          timestamp,
          formatString,
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

  getChart(data) {
    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + "%";
          return val;
        }
      }
    };
    if (data && this.props.summary.correct) {
      return (
        <div>
          <Chart
            data={data}
            scale={cols}
            padding={0}
            width={400}
            height={400}
          >
            <Coord type="theta" radius={0.55} innerRadius={0.55} />
            <Axis name="percent" />
            <Tooltip
              showTitle={false}
              itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}<br />{formatString}</li>"
            />
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
                "item*percent*formatString",
                (item, percent, formatString) => {
                  percent = (percent * 100).toFixed(0) + "%";
                  return {
                    name: item,
                    value: percent,
                    formatString,
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
                  const desc = item.point.formatString;
                  return `${type}: ${percent.toFixed(0)}%`;
                }}
              />
            </Geom>
          </Chart>
        </div>
      );
    }
    return (
      <div style={{ width: '400px', height: '400px' }}></div>
    );
  }

  render() {
    const data = this.transformSummary(this.props.summary);
    return (
      this.getChart(data)
    );
  }
}

export default PieChartDemo;
