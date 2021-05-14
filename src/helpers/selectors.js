export function getAppointmentsForDay(state, dayName) {
  const appointments = [];

  for (const day of state.days) {
    if (day.name === dayName) {
      for (const appointment of day.appointments) {
        if (state.appointments[appointment.toString()]) {
          appointments.push(state.appointments[appointment.toString()]);
        }
      }
    }
  }
  return appointments;
}

export function getInterviewersForDay(state, dayName) {
  const interviewers = [];

  for (const day of state.days) {
    if (day.name === dayName) {
      for (const interviewer of day.interviewers) {
        if (state.interviewers[interviewer]) {
          interviewers.push(state.interviewers[interviewer]);
        }
      }
    }
  }
  return interviewers;
}

export const getInterview = function (state, interviewItem) {
  let interview = null;

  if (interviewItem) {
    interview = state.interviewers[interviewItem.interviewer];
    return {
      student: interviewItem.student,
      interviewer: interview,
    };
  }

  return interview;
};
