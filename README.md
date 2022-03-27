# Vitawerks-Admin-UI

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Running the project

1. Clone the project `https://github.com/Vitawerks/Vitawerks-Admin-UI.git`.
2. Install dependencies `yarn install`.
3. Run `yarn run start`.
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Adding new environment
1. Add a file with name `.env.ENVIRONMENT_NAME` at root level.
2. copy contents from `.env.template` file into newly created environment file and edit the values as per requirements.

# Building the project
1. Staging/Dev - `yarn run build:staging`
2. Test/QA - `yarn run build:qa`
3. UAT - `yarn run build:uat`
4. PROD - `yarn run build:prod`

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### CICD Trigger

- **For DEV ENV**
  ```
  Push code to dev branch

  ```
- **For Test ENV** 
  ```
  We Need to Push the code to dev branch with Tag

  ```
  ```
  After commiting the code. Use the Command "yarn version patch/minor/major".

  ```

- **For UAT ENV**
  ```
  Merge the dev branch with main branch by raising Pull request

  ```
- **For PROD ENV**
  ```
  Approach Frontend or Devops Lead to Trigger the Prod Workflow

  ```