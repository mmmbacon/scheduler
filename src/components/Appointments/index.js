import React from "react";
import "./styles.scss";
import "../../hooks/useVisualMode";

import Header from "components/Appointments/Header";
import Show from "components/Appointments/Show";
import Empty from "components/Appointments/Empty";
import Form from "components/Appointments/Form";
import useVisualMode from "../../hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";

  console.log("Interview: ", props.interview);

  const save = function (name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };

    transition(SAVING);

    // Promise.resolve(props.bookInterview(props.id, interview)).then(() => {
    //   return transition(SHOW);
    // });

    props
      .bookInterview(props.id, interview)
      .then((res) => {
        return transition(SHOW);
      })
      .catch((err) => console.log(err));
  };

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => transition(EMPTY)}
          onSave={(name, interviewer) => {
            save(name, interviewer);
          }}
        />
      )}
    </article>
  );
}
