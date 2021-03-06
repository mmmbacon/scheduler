# Interview Scheduler

This interview scheduler was created during my enrollment in the Lighthouse Labs Web Development bootcamp. The app uses Webpack, React, Postgres, Axios, Express and Websockets to deliver a realtime single page application. The application is a simple student interview scheduler. Components were developed in isolation using the Storybook Visual Testbed. Integration testing was completed with Jest, while end-to-end testing was managed with Cypress. The database is deployed with Heroku, and Continuous Integration is managed with CircleCI and Netlify. 

This project should help highlight my knowledge and practical application of all of the above mentioned technologies. Please check out the Netlify deployment below!

## [https://scheduler-app-mmmbacon.netlify.app/](https://scheduler-app-mmmbacon.netlify.app/)
This app has been deployed using a personal use license. If you visit this site and there is no content or the site is partially loaded, please give it a few seconds and the site will render the schedule items eventually. This is a restriction on the license type.

## Local Setup

Install dependencies with `$ npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
## Screenshots

Adding a user:
![Scheduler1](https://user-images.githubusercontent.com/8649801/118921614-b6e6a800-b8f5-11eb-984b-03b43e80180d.gif)

Editing a User:
![Scheduler2](https://user-images.githubusercontent.com/8649801/118921622-b9490200-b8f5-11eb-9e12-9ca8b781a53a.gif)

Deleting a User:
![Scheduler3](https://user-images.githubusercontent.com/8649801/118921629-bbab5c00-b8f5-11eb-88e3-001e72f32604.gif)

Storybook:
![Scheduler4](https://user-images.githubusercontent.com/8649801/118924503-69206e80-b8fa-11eb-8d7f-84e625e4a582.gif)

Integrated Testing Coverage Reporting with Jest:
![image](https://user-images.githubusercontent.com/8649801/118924551-7dfd0200-b8fa-11eb-8ba3-a3b400258c09.png)
