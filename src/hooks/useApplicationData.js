import { useReducer, useEffect } from "react";
import axios from "axios";

import { getSpotsForDay, getDayIndex } from "../helpers/selectors";

const reducer = function (state, action) {
  switch (action.type) {
    case "SET_DAY":
      return { ...state, day: action.value };
    case "SET_APPLICATION_DATA":
      return {
        ...state,
        appointments: action.value.appointments,
        days: action.value.days,
        interviewers: action.value.interviewers,
      };
    case "SET_INTERVIEW":
      return {
        ...state,
        appointments: action.value.appointments,
        days: action.value.days,
      };
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
};

export default function useApplicationData(initial) {
  const [state, dispatch] = useReducer(reducer, initial);

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  useEffect(() => {
    Promise.all([
      //Fetch days
      axios
        .get("/api/days")
        .then((res) => res.data)
        .catch((err) => err),
      //Fetch appointments
      axios
        .get("/api/appointments")
        .then((res) => res.data)
        .catch((err) => err),
      //Fetch interviewers
      axios
        .get("/api/interviewers")
        .then((res) => res.data)
        .catch((err) => err),
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        value: { days: all[0], appointments: all[1], interviewers: all[2] },
      });
    });
  }, [state]);

  const setDay = function (day) {
    dispatch({ type: SET_DAY, value: day });
  };

  const bookInterview = function (id, interview) {
    const dayIndex = getDayIndex(state, state.day);
    const spots = getSpotsForDay(state, state.day);

    //Update Appointment
    //Create copy of selected appointment by ID
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    //Update Days
    //Create copy of selected day by index
    const day = {
      ...state.days[dayIndex],
      spots: spots - 1,
    };
    //Create copy of days and insert new day
    const days = [...state.days];
    days[dayIndex] = day;

    return axios
      .put(`/api/appointments/${id}`, {
        interview,
      })
      .then((res) => {
        dispatch({
          type: SET_INTERVIEW,
          value: { appointments: appointments, days: days },
        });
        //setState({ ...state, appointments, days });
        return res;
      });
  };

  const cancelInterview = function (id, interview) {
    const dayIndex = getDayIndex(state, state.day);
    const spots = getSpotsForDay(state, state.day);

    //Update Appointment
    //Create copy of selected appointment by ID
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    //Update Days
    //Create copy of selected day by index
    const day = {
      ...state.days[dayIndex],
      spots: spots + 1,
    };
    //Creata copy of days and insert new day
    const days = [...state.days];
    days[dayIndex] = day;

    return axios.delete(`/api/appointments/${id}`).then((res) => {
      dispatch({
        type: SET_INTERVIEW,
        value: { appointments: appointments, days: days },
      });
      //setState({ ...state, appointments, days });
      return res;
    });
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    getSpotsForDay,
  };
}
