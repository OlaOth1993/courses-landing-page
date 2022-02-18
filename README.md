## Installed Packages

- Angular Material v11.2.8
- Bootstrap v5.0.0-beta3
- flex layout
- ng-circle-progress
- @angular-material-extensions/select-country
- font-awesome
- font-awesome-animation
- file-saver
- @types/file-saver
- @types/jquery
- jquery
- angular-crumbs
- ngx-skeleton-loader

## Install the following extensions

- Angular Language Service
- Better Comments
- ESLint
- Prettier - Code formatter

## Fresh Start

1. Clone develop branch to your IDE
2. Run the command `git flow init -d`
3. Run the command `npm i`

## Git flow feature commands

Use those commands when working on a **new feature**.

- Create a feature branch locally `git flow feature start FEATURE_NAME`.
- Publish a feature branch to remote or push changes `git flow feature publish FEATURE_NAME`.
- Rebases (Updates) the feature branch from the current state of develop `git flow feature rebase FEATURE-NAME`
- Merge and delete branch when done `git flow feature finish FEATURE_NAME`.
  Where `FEATURE_NAME` is either the feature you're working on _i.e. login, categories, etc.._
  or the relevant `ID` to the task on `Jira`.

## Git flow bugfix commands

Use those commands when there's a bug in **develop branch** and you want to fix it.

- Create a bugfix branch locally `git flow bugfix start BUGFIX_NAME`.
- Publish a bugfix branch to remote or push changes `git flow bugfix publish BUGFIX_NAME`.
- Merge and delete branch when done `git flow bugfix finish BUGFIX_NAME`.
  Where `BUGFIX_NAME` is the name of the bug.

## Git flow hotfix commands

Use those commands when there's a bug in **master branch** and you want to fix it.

- Create a hotfix branch locally `git flow hotfix start HOTFIX_NAME`.
- Publish a hotfix branch to remote or push changes `git flow hotfix publish HOTFIX_NAME`.
- Merge and delete branch when done `git flow hotfix finish HOTFIX_NAME`.  
  Where `HOTFIX_NAME` is the name of the bug.
  > Refer that hotfix branches are merged with both develop and master

### Development server

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.7

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.  
The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component.  
You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project.  
The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
