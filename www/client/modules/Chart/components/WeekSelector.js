import React, { PropTypes, Component } from 'react';
import moment from 'moment';

import styles from './WeekSelector.css';

class WeekSelector extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.weekSelector}>
        <a href="#" onClick={this.props.dateSubtract.bind(this, {month: 1})}>&laquo;</a>
        {moment(this.props.selectedDate).format('MMM YYYY')}
        <a href="#" onClick={this.props.dateAdd.bind(this, {month: 1})}>&raquo;</a>
      </div>
    );
  }
}

WeekSelector.propTypes = {
  selectedDate: PropTypes.object.isRequired,
};

export default WeekSelector;
