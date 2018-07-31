import Calendar from 'react-calendar';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { selectDate } from '../actions/selections';
import { getTimes } from '../actions/get';
import { getDates } from '../actions/get';
import './DateForm.css';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 350,
  },
});

class DateForm extends React.Component {
  state = {
    date: new Date(),
  };

  // componentWillMount() {
  //   this.props.getDates (518955, new Date().toJSON().slice(0,10).replace(/-/g,'-'))
  // }

  formatDate = date => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  onChange = date => {
    // this.setState({date});
    // console.log(this.state.date)
    // console.log(date,'date')
    // const yyyymmdd = date.toJSON().slice(0,10).replace(/-/g,'-')
    // console.log(yyyymmdd,'yyyymmdd')
    //this.props.selectDate(date.toJSON().slice(0,10).replace(/-/g,'-'))
    this.props.selectDate(this.formatDate(date));
  };

  nowGetDates = () => {
    const date = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '-');
    let serviceId;
    if (this.props.selections.service.length > 0) {
      serviceId = this.props.selections.service[0].id;
    }
    this.props.getDates(serviceId, date);
  };

  // Check whether a given date is a valid date
  // input in ISO format: yyyy-MM-dd
  DatePicker_IsValidDate = input => {
    var bits = input.split('-');
    var d = new Date(bits[0], bits[1] - 1, bits[2]);
    return (
      d.getFullYear() === Number(bits[0]) &&
      d.getMonth() + 1 === Number(bits[1]) &&
      d.getDate() === Number(bits[2])
    );
  };

  // Get the disabled dates array based on the dates
  // that were given by the available days request result
  getDisabledDates = dates => {
    const disabledDates = [];
    // Convert the dates to numbers
    const numberDates = dates.map(date => {
      return Number(date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2));
    });
    // For all the number dates ...
    for (
      let numberDateIx = 0;
      numberDateIx < numberDates.length - 1;
      numberDateIx++
    ) {
      // ... verify whether there is a date gap (more than 1 day)
      if (numberDates[numberDateIx] !== numberDates[numberDateIx + 1] - 1) {
        // For all the gap dates ...
        for (
          let startDate = numberDates[numberDateIx] + 1;
          startDate < numberDates[numberDateIx + 1];
          startDate++
        ) {
          const strDate = startDate.toString();
          const strDateYYYYMMDD =
            strDate.substr(0, 4) +
            '-' +
            strDate.substr(4, 2) +
            '-' +
            strDate.substr(6, 2);
          // ... check whether it is a valid date
          if (this.DatePicker_IsValidDate(strDateYYYYMMDD)) {
            // ... and if so add it to the disabledDates array
            disabledDates.push(
              new Date(
                strDateYYYYMMDD.substr(0, 4),
                strDateYYYYMMDD.substr(5, 2) - 1,
                strDateYYYYMMDD.substr(8, 2),
              ),
            );
          }
        }
      }
    }
    // Return the disableDates array
    return disabledDates;
  };

  render() {
    const { selections, dates } = this.props;

    if (
      !selections.location ||
      !selections.service ||
      !selections.employee ||
      selections.time
    )
      return null;
    // if (this.props.dates===null) this.nowGetDates()
    if (!dates) return null;
    if (dates.length === 0)
      return (
        <div>
          <p>There's no available date for this employee.</p>
          <p>Please try another employee.</p>
        </div>
      );
    const disabledDates = this.getDisabledDates(dates);
    return (
      <div className="calendarFrame">
        <Calendar
          onChange={this.onChange}
          value={this.state.date}
          // Set the calendar dates that are not clickable
          // based on the available days request result
          tileDisabled={({ date, view }) =>
            view === 'month' && // Block day tiles only
            disabledDates.some(
              disabledDate =>
                date.getFullYear() === disabledDate.getFullYear() &&
                date.getMonth() === disabledDate.getMonth() &&
                date.getDate() === disabledDate.getDate(),
            )
          }
          // Set the minimum calendar date that is clickable
          // based on the first day of the available days request result
          minDate={
            new Date(
              dates[0].substr(0, 4),
              dates[0].substr(5, 2) - 1,
              dates[0].substr(8, 2),
            )
          }
          // Set the maximum calendar date that is clickable
          // based on the last day of the available days request result
          maxDate={
            new Date(
              dates[dates.length - 1].substr(0, 4),
              dates[dates.length - 1].substr(5, 2) - 1,
              dates[dates.length - 1].substr(8, 2),
            )
          }
        />
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    times: state.availableTimes,
    dates: state.availableDates,
    selections: state.selections,
  };
};

DateForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { selectDate, getTimes, getDates },
  ),
)(DateForm);
