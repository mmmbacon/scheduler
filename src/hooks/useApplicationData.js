import { useState, useEffect } from "react";
import axios from "axios";

import { getSpotsForDay, getDayIndex } from "../helpers/selectors";

export default function useApplicationData(initial) {
  const [state, setState] = useState(initial);

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
      setState((prev) => ({
        ...prev,
        days: all[0],
        appointments: all[1],
        interviewers: all[2],
      }));
    });
  }, []);

  const setDay = function (day) {
    setState({ ...state, day: day });
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
        setState({ ...state, appointments, days });
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
      setState({ ...state, appointments, days });
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
