import React, { useState } from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";

export default function Form(props) {
  /* 
  
  The Form component should track the following state:

  name:String
  interviewer:Number

  The Form component should have the following actions:

  setName:Function
  setInterviewer:Function

  The Form component should take the following props:

  name:String
  interviewers:Array
  interviewer:Number
  onSave:Function
  onCancel:Function 
  
  */

  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);

  const setNameField = function (nameField) {
    setName(nameField);
  };

  const setInterviewerField = function (interviewerField) {
    setInterviewer(interviewerField);
  };

  const reset = function () {
    setName("");
    setInterviewer(null);
  };

  const cancel = function () {
    reset();
    props.onCancel();
  };

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(event) => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name={name}
            type="text"
            placeholder="Enter Student Name"
            onChange={(event) => {
              setNameField(event.target.value);
            }}
          />
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          value={interviewer}
          onChange={setInterviewerField}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>
            Cancel
          </Button>
          <Button
            confirm
            onClick={() => {
              props.onSave(name, interviewer);
            }}
          >
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
