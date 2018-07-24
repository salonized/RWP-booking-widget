import { connect } from 'react-redux'
import compose from 'recompose/compose';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {selectServices} from '../actions/selections'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 350,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class ServiceForm extends React.Component {

  handleChange = event => {
    this.props.selectServices(event.target.value)
  };

  render() {

    const { classes, services, service } = this.props;

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="service-form">Pick a service!</InputLabel>
          <Select
            value={service}
            onChange={this.handleChange}
            input={<Input name="service" id="service" />}
          >
            {services.map(ser=>
              (<MenuItem key={ser} value={ser}>{ser}</MenuItem>)
            )}
          </Select>
        </FormControl>
      </form>
    );
  }
}

const mapStateToProps = function (state) {
  return {
    services: state.services,
    service: state.selections.service
  }
}

ServiceForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles), connect(mapStateToProps, {selectServices}))(ServiceForm);
