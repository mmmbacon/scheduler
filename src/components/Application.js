import React, { useState, useEffect } from "react";

import axios from "axios";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "../helpers/selectors";

import "components/Application.scss";

import DayList from "components/DayList";
import Appointment from "components/Appointments";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    Promise.all([
      //Fetch days
      axios
        .get("/api/days")
        .then((res) => res.data)
        .catch((err) => console.log(err)),
      //Fetch appointments
      axios
        .get("/api/appointments")
        .then((res) => res.data)
        .catch((err) => console.log(err)),
      //Fetch interviewers
      axios
        .get("/api/interviewers")
        .then((res) => res.data)
        .catch((err) => console.log(err)),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0],
        appointments: all[1],
        interviewers: all[2],
      }));
    });
  }, []);

  const bookInterview = function (id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .put(`/api/appointments/${id}`, {
        interview,
      })
      .then((res) => {
        setState({ ...state, appointments });
        return res;
      })
      .catch((err) => console.log(err));
  };

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const appointmentList = dailyAppointments.map((item) => {
    const interview = getInterview(state, item.interview);

    return (
      <Appointment
        key={item.id}
        {...item}
        interviewers={getInterviewersForDay(state, state.day)}
        interview={interview}
        bookInterview={bookInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={(day) => setState({ ...state, day: day })}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentList}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
