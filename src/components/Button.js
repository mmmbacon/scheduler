import React from "react";
import classnames from 'classnames';

import "components/Button.scss";
import { action } from "@storybook/addon-actions/dist/preview";

export default function Button(props) {

  let classNames = classnames({
    'button': true,
    'button--confirm': props.confirm,
    'button--danger': props.danger
  });

   return <button disabled={props.disabled} className={classNames} onClick={props.onClick}>{props.children}</button>;
}
