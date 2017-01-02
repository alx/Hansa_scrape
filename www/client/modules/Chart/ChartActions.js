import callApi from '../../util/apiCaller';
import moment from 'moment';

// Export Constants
export const ADD_CHART = 'ADD_CHART';

// Export Actions
export function addChart(chartData) {
  return {
    type: ADD_CHART,
    chartData,
  };
}

export function fetchWeekChart(date) {
  return (dispatch) => {
    return callApi(`charts/weekly/${moment(date).format('YYYY-MM')}`).then(res => {
      console.log(res);
      dispatch(addChart(res.chartData));
    });
  };
}
