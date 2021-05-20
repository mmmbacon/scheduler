import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  getByText,
  getAllByTestId,
  queryByText,
  getByTestId,
  getByPlaceholderText,
  getByAltText,
} from "@testing-library/react";

import axios from "axios";

import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";

afterEach(cleanup);

describe("Application Tests", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    const button = getByTestId(appointment, "button");
    fireEvent.click(button);
    const form = await waitForElement(() => getByTestId(appointment, "form"));
    const input = getByPlaceholderText(appointment, "Enter Student Name");
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: "Lydia Miller-Jones" } });
    const interviewerImage = getByAltText(form, "Sylvia Palmer");
    fireEvent.click(interviewerImage);
    const saveButton = getByText(container, "Save");
    fireEvent.click(saveButton);
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );
    // 3. Click the "Delete" button on the booked appointment.
    const button = getByAltText(appointment, "Delete");
    fireEvent.click(button);
    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Are you sure you would like to delete this item?")
    ).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    const confirmButton = getByText(appointment, "Confirm");
    fireEvent.click(confirmButton);
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByTestId(appointment, "button"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );
    // 3. Click the "Edit" button on a booked appointment.
    const button = getByAltText(appointment, "Edit");
    fireEvent.click(button);
    // 4. Check that the form item is shown.
    const form = await waitForElement(() => getByTestId(appointment, "form"));
    // 5. Click on, and edit Input text field
    const input = getByPlaceholderText(appointment, "Enter Student Name");
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: "Lydia Miller-Jones" } });
    // 6. Click on, and change interviewer selection
    const interviewerImage = getByAltText(form, "Sylvia Palmer");
    fireEvent.click(interviewerImage);
    // 7. Press submit button on form item
    const saveButton = getByText(container, "Save");
    fireEvent.click(saveButton);
    // 8. Check that the element with the text "Saving" is displayed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // 9. Wait until the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    // 10. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    // 1. Render the Application
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );
    // 3. Click the "Edit" button on a booked appointment.
    const button = getByAltText(appointment, "Edit");
    fireEvent.click(button);
    // 4. Check that the form item is shown.
    const form = await waitForElement(() => getByTestId(appointment, "form"));
    // 5. Click on, and edit Input text field
    const input = getByPlaceholderText(appointment, "Enter Student Name");
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: "Lydia Miller-Jones" } });
    // 6. Click on, and change interviewer selection
    const interviewerImage = getByAltText(form, "Sylvia Palmer");
    fireEvent.click(interviewerImage);
    // 7. Press submit button on form item
    const saveButton = getByText(container, "Save");
    fireEvent.click(saveButton);
    // 8. Check that the element with the text "Could not Save" is displayed
    await waitForElement(() => getByText(appointment, "Could not Save"));
    // 9. Click on "Close Button"
    const closeButton = getByAltText(container, "Close");
    fireEvent.click(closeButton);
    // 11. Wait until the form element is displayed.
    await waitForElement(() => getByTestId(appointment, "form"));
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );
    // 3. Click the "Delete" button on the booked appointment.
    const button = getByAltText(appointment, "Delete");
    fireEvent.click(button);
    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Are you sure you would like to delete this item?")
    ).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    const confirmButton = getByText(appointment, "Confirm");
    fireEvent.click(confirmButton);
    // 8. Check that the element with the text "Could not Save" is displayed
    await waitForElement(() => getByText(appointment, "Could not Delete"));
    // 9. Click on "Close Button"
    const closeButton = getByAltText(container, "Close");
    fireEvent.click(closeButton);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  });
});
