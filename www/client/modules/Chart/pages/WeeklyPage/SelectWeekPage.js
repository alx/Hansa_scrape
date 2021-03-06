import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

// Import Components
import WeekChart from '../../components/WeekChart';
import WeekSelector from '../../components/WeekSelector';

// Import Actions
import { fetchWeekChart } from '../../ChartActions';

// Import Selectors
import { getWeekChart } from '../../ChartReducer';

const initDate = moment("2016-10", "YYYY-MM");

class SelectWeekChart extends Component {

  constructor(props) {
    super(props);
    this.dateAdd = this.dateAdd.bind(this);
    this.dateSubtract = this.dateSubtract.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchWeekChart(moment("2016-10", "YYYY-MM")));
  }

  dateAdd(period) {
    this.props.dispatch(fetchWeekChart(moment(this.props.chartData.date, "YYYY-MM").add(period)));
  }

  dateSubtract(period) {
    this.props.dispatch(fetchWeekChart(moment(this.props.chartData.date, "YYYY-MM").subtract(period)));
  }

  render() {
    return (
      <div>
        <WeekSelector dateAdd={this.dateAdd} dateSubtract={this.dateSubtract} selectedDate={moment(this.props.chartData.date, "YYYY-MM")}/>
        <WeekChart chartData={this.props.chartData}/>
      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
SelectWeekChart.need = [() => { return fetchWeekChart(moment("2016-10", "YYYY-MM")); }];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    chartData: getWeekChart(state),
  };
}

SelectWeekChart.propTypes = {
  chartData: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

SelectWeekChart.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(mapStateToProps)(SelectWeekChart);
