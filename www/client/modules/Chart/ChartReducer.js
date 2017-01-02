import { ADD_CHART } from './ChartActions';

// Initial State
const initialState = { chartData: [] };

const ChartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CHART :
      return action.chartData;

    default:
      return state;
  }
};

/* Selectors */

// Get all posts
export const getWeekChart = state => state.chartData;

// Export Reducer
export default ChartReducer;
