import React from "react";
import DayListItem from "components/DayListItem";

export default function DayList(props) {
  const items = props.days.map((item) => {
    return (
      <DayListItem
        selected={item.name === props.day}
        name={item.name}
        spots={item.spots}
        setDay={props.setDay}
        key={item.id}
      />
    );
  });

  return <ul>{items}</ul>;
}
