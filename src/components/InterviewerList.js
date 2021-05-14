import React, { useState } from "react";
import "./InterviewerList.scss";
import classNames from "classnames";
import InterviewerListItem from "./InterviewerListItem";

export default function InterviewerList(props) {
  const interviewersList = props.interviewers.map((item) => {
    return (
      <InterviewerListItem
        {...item}
        selected={item.id === props.value}
        setInterviewer={() => props.onChange(item.id)}
        key={item.id}
      />
    );
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewersList}</ul>
    </section>
  );
}
