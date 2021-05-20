import { useReducer, useEffect, useRef } from "react";
import axios from "axios";

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
        days: getDays(state, state.day, action.value.appointments),
      };
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
};

function getDays(state, day, appointments) {
  return state.days.map((item) => {
    let count = 0;

    for (const app of item.appointments) {
      if (appointments[app].interview === null) {
        count++;
      }
    }

    return {
      ...item,
      spots: count,
    };
  });
}

export default function useApplicationData(initial) {
  const [state, dispatch] = useReducer(reducer, initial);

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const ws = useRef(null);

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
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    ws.current.onopen = () => {};

    return () => {
      ws.current.close();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!ws.current) return;
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "SET_INTERVIEW") {
        //Update Appointment
        //Create copy of selected appointment by ID
        const appointment = {
          ...state.appointments[message.id],
          interview:
            message.interview === null ? null : { ...message.interview },
        };
        const appointments = {
          ...state.appointments,
          [message.id]: appointment,
        };

        // //Update Days
        // //Create copy of selected day by index
        // const day = {
        //   ...state.days[dayIndex],
        //   spots: message.interview === null ? spots + 1 : spots - 1,
        // };
        // //Create copy of days and insert new day
        // const days = [...state.days];
        // days[dayIndex] = day;

        dispatch({
          type: SET_INTERVIEW,
          value: { appointments: appointments },
        });
      }
    };
  });

  const setDay = function (day) {
    dispatch({ type: SET_DAY, value: day });
  };

  const bookInterview = function (id, interview) {
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

    return axios
      .put(`/api/appointments/${id}`, {
        interview,
      })
      .then((res) => {
        dispatch({
          type: SET_INTERVIEW,
          value: { appointments: appointments },
        });
        //setState({ ...state, appointments, days });
        return res;
      });
  };

  const cancelInterview = function (id, interview) {
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

    return axios.delete(`/api/appointments/${id}`).then((res) => {
      dispatch({
        type: SET_INTERVIEW,
        value: { appointments: appointments },
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
  };
}
