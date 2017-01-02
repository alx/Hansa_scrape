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
    this.state = { selectedDate: initDate };
    this.dateAdd = this.dateAdd.bind(this);
    this.dateSubtract = this.dateSubtract.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchWeekChart(this.state.selectedDate));
  }

  dateAdd(period) {
    this.setState({selectedDate: moment(this.state.selectedDate).add(period)});
    this.props.dispatch(fetchWeekChart(this.state.selectedDate));
  }

  dateSubtract(period) {
    this.setState({selectedDate: moment(this.state.selectedDate).subtract(period)});
    this.props.dispatch(fetchWeekChart(this.state.selectedDate));
  }

  render() {
    return (
      <div>
        <WeekSelector dateAdd={this.dateAdd} dateSubtract={this.dateSubtract} selectedDate={this.state.selectedDate}/>
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
