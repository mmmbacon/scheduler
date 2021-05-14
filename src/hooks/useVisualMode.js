import React, { useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  const transition = function (mode, replace = false) {
    if (replace) {
      setHistory((history) => [mode, ...history.slice(1)]);
      return;
    }

    setHistory((history) => [mode, ...history]);
  };

  const back = function () {
    if (history && history.length > 1) {
      setHistory((history) => history.slice(1));
    }
  };

  return { mode: history[0], transition, back };
}
