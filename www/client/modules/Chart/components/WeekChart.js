import React, { PropTypes, Component } from 'react';
import ChartistGraph from 'react-chartist';

class WeekChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chart: null,
      options: {
        legend: {
          position: 'bottom',
          labels: {
            fontColor: "#DDD"
          }
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                color: "rgba(200, 200, 200, 0.1)",
                zeroLineColor: "rgba(200, 200, 200, 0.25)"
              },
              ticks: {
                max: 55
              },
              scaleLabel: {
                display:true,
                labelString: "BTC amount"
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                color: "rgba(200, 200, 200, 0.1)",
                zeroLineColor: "rgba(200, 200, 200, 0.25)"
              },
              ticks: {
                max: 280
              },
              scaleLabel: {
                display:true,
                labelString: "Feedback count"
              }
            }
          ]
        }
      },
      chartData: {datasets: []}
    };
  }

  componentDidMount() {
    const Bubble = require("react-chartjs-2").Bubble;
    this.setState({chart: <Bubble data={this.state.chartData} options={this.state.options}/>});
  }

  componentWillReceiveProps(nextProps) {

    //console.log(nextProps);
    const Bubble = require("react-chartjs-2").Bubble;
    var color = require("react-chartjs-2").Chart.helpers.color;

    const colorbrew = [
      "#a6cee3",
      "#1f78b4",
      "#b2df8a",
      "#33a02c",
      "#fb9a99",
      "#e31a1c",
      "#fdbf6f"
    ]

    const colors = {
      'Cannabis': color(colorbrew[3]).alpha(0.9).rgbString(),
      'Stimulants': color(colorbrew[4]).alpha(0.9).rgbString(),
      'Ecstasy': color(colorbrew[5]).alpha(0.9).rgbString(),
      'Psychedelics': color(colorbrew[1]).alpha(0.9).rgbString(),
      'Dissociatives': color(colorbrew[6]).alpha(0.9).rgbString(),
      'Prescription': color(colorbrew[0]).alpha(0.9).rgbString(),
      'Opioids': color(colorbrew[2]).alpha(0.9).rgbString(),
    };

    const chartData = {
      datasets: nextProps.chartData.bySubtype.filter( dataRow => {
        return dataRow.type == "Drugs" && dataRow.subtype.length > 0;
      }).sort( (a, b)  => {
        return a.subtype - b.subtype;
      }).map( dataRow => {
        return {
          label: dataRow.id,
          backgroundColor: colors[dataRow.subtype],
          data: [
            {
              x:dataRow.count,
              y:dataRow.amount_btc,
              r:dataRow.vendors.length
            }
          ]
        };
      })
    };

    console.log(chartData);

    this.setState({chart: <Bubble data={chartData}/> });
  }

  render() {
    return (
      <div className="listView">
        {this.state.chart}
      </div>
    );
  }
}

WeekChart.propTypes = {
  chartData: PropTypes.object.isRequired,
};

export default WeekChart;
