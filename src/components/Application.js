import React from "react";

import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "../helpers/selectors";

import useApplicationData from "hooks/useApplicationData";

import "components/Application.scss";

import DayList from "components/DayList";
import Appointment from "components/Appointments";

export default function Application(props) {
  const { state, setDay, bookInterview, cancelInterview } = useApplicationData({
    day: "Monday",
    appointments: [],
    interviews: {},
    days: [],
  });

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
        cancelInterview={cancelInterview}
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
          <DayList days={state.days} day={state.day} setDay={setDay} />
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
