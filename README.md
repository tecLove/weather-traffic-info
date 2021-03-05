# WeatherTrafficInfo

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.2.

## Prerequisite
Your machine should have nodeJS 12 or higher version.
Download the code from the repo and then run `npm install` inside the project directory.
Once the installation of the packages are done, run `npm install -g @angular/cli`.

A proxy is being used in local to fetch the data from public api to avoid CORS issues. When deployed to server, proxy might have to be configured at web server level accordingly.

Once the traffic images have been fetched, request is made to decode latitude and longitude for each entry, received from traffic img api. Request takes time to return the decoded locations. If there is an api available which can return all the decoded locations in one call then it would be quiet efficient. 
When user changes date or time then previously fetched decoded locations are used.

Most of the times the weather forecast returned by `https://api.data.gov.sg/v1/environment/2-hour-weather-forecast` does not match any of the area location returned by reverse geolocation. In that case no weather forecast is displayed.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Typescript lint

Run `ng lint` to check the lint errors on typescript

## Scss lint

Run `npm run sass-lint` to check the lint errors on scss styles

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
