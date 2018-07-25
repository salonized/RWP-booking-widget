import request from 'superagent'
import { baseUrl } from '../constants'

export const GET_SERVICES = 'GET_SERVICES'
export const GET_LOCATIONS = 'GET_LOCATIONS'
export const GET_EMPLOYEES = 'GET_EMPLOYEES'
export const GET_TIMES = 'GET_TIMES'
export const GET_DATES = 'GET_DATES'

export const getServices = () => (dispatch) =>
 {
  request 
  .get (`${baseUrl}/services.json`)
  .then (response => {
    // console.log(response.body.services)
    dispatch ({
      type: GET_SERVICES,
      payload: response.body.services
    })
  })
}


export const getLocations = () => (dispatch) =>
 {
  request 
  .get (`${baseUrl}/bookings/locations.json`)
  // .get (`https://codaisseur-booking-widget.salonized.com/bookings/locations.json`)
  .then (response => {
    // console.log(response.body)
    dispatch ({
      type: GET_LOCATIONS,
      payload: response.body.locations
    })
  })
}

export const getEmployees = () => (dispatch) =>
 {
  request 
  .get (`${baseUrl}/bookings/resources.json`)
  .then (response => {
    // console.log(response.body)
    dispatch ({
      type: GET_EMPLOYEES,
      payload: response.body["resources/employees"]    })
  })
}


export const getTimes = (serviceId, date) => (dispatch) =>
 {
  request 
  .get (`https://codaisseur-booking-widget.salonized.com/bookings/timeslots?service_ids=${serviceId}&date=${date}`)
  .then (response => {
    // console.log(response.body)
    dispatch ({
      type: GET_TIMES,
      payload: response.body    })
  })
}

export const getDates = (serviceId, date) => (dispatch) =>
 {
  request 
  .get (`https://codaisseur-booking-widget.salonized.com/bookings/available_days?service_ids=${serviceId}&date=${date}`)
  .then (response => {
    // console.log(response.body)
    dispatch ({
      type: GET_DATES,
      payload: response.body    })
  })
}
