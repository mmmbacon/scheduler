/**
 * Will return all appointments for a given day in an unsorted array
 * @param {object} state The entire state object
 * @param {string} dayName The day for which to get appointments
 * @returns {array} Array containing appointments
 */
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

/**
 * Will return all interviewers for a given day in an unsorted array
 * @param {object} state The entire state object
 * @param {string} dayName The day for which to get interviewers
 * @returns {array} Array containing interviewers
 */
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

/**
 * Returns the interviewer object from the given interview index
 * @param {object} state The entire state object
 * @param {string} interviewItem the interview item index
 * @returns {object} Object containing the individual interviewer
 */
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
