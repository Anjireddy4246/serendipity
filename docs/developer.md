# Serendipity Developer Documentation

Good tools make application development better and easier.

The [Angular CLI](https://cli.angular.io/) is a command line tool that you can use to create the scaffolding for a new project, add files to a project and perform a variety of common development tasks.

## Quick Start

The goal of this guide is to help you build and run Serendipity using the Angular CLI.

### Step 1. Set up the Development Environment 

You need to set up your development environment before you can do anything.

Open a terminal window and install [Node.js (and npm)](https://nodejs.org/en/download/) and [git](https://git-scm.com/) if they are not already on your machine.

> Verify that you are running at least Node.js version 8.x or greater and npm version 5.x or greater by running node -v and npm -v in a terminal/console window. Older versions produce errors, but newer versions are fine.

Then install the Angular CLI globally:

```
npm install -g @angular/cli
```

### Step 2. Clone the project 

Change the current working directory to the location where you want the cloned directory to be:

```
cd ~/workspaces
```

Clone the project by running the following command:

```
git clone https://github.com/Robinyo/serendipity
```

### Step 3: Launch Flowable 

The easiest way to get started with [Flowable](https://www.flowable.org/index.html) is to use a Docker image, for example:

```
docker run --name flowable -p 8080:8080 flowable/all-in-one
```

or

```
docker start --interactive flowable
```

To list all running containers:

```
docker container ls
```

You can stop a container using the following command:

```
docker container stop [name]
```

For example:

```
docker container stop flowable
docker container stop flowable-rest
```

Where is your image? It’s in your machine’s local Docker image registry:

```
docker image ls
```

During **development** we can use the [proxying](https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/proxy.md) support in webpack's dev server to highjack certain URIs and send them to a backend server:

```
ng serve --proxy-config=proxy.conf.json
```

proxy.conf.json:

```
  "/flowable-task": {
    "target": "http://localhost:8080",
    "secure": false,
    "logLevel": "debug"
  },
  "/api": {
    "target": "http://localhost:3001",
    "secure": false,
    "logLevel": "debug"
  }
```

**Note:** You can build and serve Serendipity without launching Flowable:

<p align="center">
  <img src="https://github.com/Robinyo/serendipity/blob/master/screen-shots/activities-without-flowable.png">
</p>

#### Flowable-related Blog Posts 

* Rob Ferguson's blog: [Getting started with Flowable](https://robferguson.org/blog/2018/12/10/getting-started-with-flowable/)
* Rob Ferguson's blog: [How To: Build Flowable](https://robferguson.org/blog/2019/01/05/how-to-build-flowable/)
* Rob Ferguson's blog: [How To: Flowable and LDAP](https://robferguson.org/blog/2019/01/28/how-to-flowable-and-ldap/)
* Rob Ferguson's blog: [Flowable's REST API - Part 1](https://robferguson.org/blog/2018/12/24/flowable-rest-api-part-1/)
* Rob Ferguson's blog: [Flowable's REST API - Part 2](https://robferguson.org/blog/2019/01/02/flowable-rest-api-part-2/)
* Rob Ferguson's blog: [Flowable's REST API - Part 3](https://robferguson.org/blog/2019/01/03/flowable-rest-api-part-3/)

### Step 4: Serve the application's API 

Follow the steps in the Serendipity API's [Quick Start](https://github.com/Robinyo/serendipity-api/blob/master/projects/express-typeorm/docs/developer.md) Guide.

### Step 5: Serve the application 

Go to the project directory, install the project's dependencies and launch the server:

```
cd serendipity
npm install

ng build utils && \
ng build auth && \
ng build auth-auth0 && \
ng build auth-okta && \
ng build serendipity-components && \
ng build dashboard-widgets && \
ng build dashboard && \
ng build dynamic-forms && \
ng build auth-local && \
ng build flowable && \
ng build sales

ng serve --proxy-config=proxy.conf.json --open
```

The ng serve command launches the server, watches your files, and rebuilds the app as you make changes to those files.

Using the --open (or just -o) option will open your browser on `http://localhost:4200/`

## Build Management

### Aliases

Steps to add support for aliases update the "paths" array in the `compilerOptions` section of `tsconfig.json`:

```
  "paths": {
    "@app/*": [
      "src/app/*"
    ],
    "@env/*": [
      "src/environments/*"
    ],

    ...
    
  }
```

### Development

To build the project:

```
ng build utils && \
ng build auth && \
ng build auth-auth0 && \
ng build auth-okta && \
ng build serendipity-components && \
ng build dashboard-widgets && \
ng build dashboard && \
ng build dynamic-forms && \
ng build auth-local && \
ng build flowable && \
ng build sales
```
       
To launch the project:

```
ng serve --proxy-config=proxy.conf.json
```

Navigate to:

```
http://localhost:4200/
```

The app will automatically reload if you change any of the source files.

### Production

To update the project's version:

```
npm run version-update -- 1.0.0-beta.1
```

To build the project:

```
ng build utils && \
ng build auth && \
ng build auth-auth0 && \
ng build auth-okta && \
ng build serendipity-components && \
ng build dashboard-widgets && \
ng build dashboard && \
ng build dynamic-forms && \
ng build auth-local && \
ng build flowable && \
ng build sales
ng build --prod --source-map 
```

The build artifacts will be stored in the `dist/serendipity` directory. 

To launch the project using [http-server](https://github.com/indexzero/http-server):

```
http-server -p 5042 -c-1 dist/serendipity
```

**Note:** To reduce the possibility of conflicts and avoid serving stale content, test on a dedicated port and disable caching.

Navigate to:

```
http://127.0.0.1:5042
```

#### AoT Don'ts

The following are some things that will make AoT compile fail.

- Don’t use require statements for your templates or styles, use styleUrls and templateUrls, the angular2-template-loader plugin will change it to require at build time.
- Don’t use default exports.
- Don’t use `form.controls.controlName`, use `form.get(‘controlName’)`
- Don’t use `control.errors?.someError`, use `control.hasError(‘someError’)`
- Don’t use functions in your providers, routes or declarations, export a function and then reference that function name
- @Inputs, @Outputs, View or Content Child(ren), Hostbindings, and any field you use from the template or annotate for Angular should be public

For more detailed guide on AoT's Do's and Don'ts refer to https://github.com/rangle/angular-2-aot-sandbox

### Firebase Hosting

The Serendipity [demo](https://serendipity-f7626.firebaseapp.com) utilises Firebase Hosting.

The Firebase Hosting configuration is located in the project's `environment.ts` and `environments.prod.ts`:

```
  firebase: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: ''
  }
```

And, `firebase.json`:

```
{
  "hosting": {
    "public": "dist/serendipity",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

To launch the project locally using Firebase:

```
firebase serve
```
 
Navigate to:
 
```
http://localhost:5000
```

To deploy the project to Firebase Hosting:

```
firebase deploy
```

Navigate to:

```
https://serendipity-f7626.firebaseapp.com
```

**Note:** If you run into any issues when trying to deploy to Firebase Hosting, try:

```
firebase login --reauth
firebase list
```

### Authentication

* [auth](https://github.com/Robinyo/serendipity/tree/master/projects/auth) library
* [auth-local](https://github.com/Robinyo/serendipity/tree/master/projects/auth-local) library
* [auth-auth0](https://github.com/Robinyo/serendipity/tree/master/projects/auth-auth0) library
* [auth-okta](https://github.com/Robinyo/serendipity/tree/master/projects/auth-okta) library

#### Authentication Providers

The project's Auth providers are configured in the App [module](https://github.com/Robinyo/serendipity/blob/master/src/app/app.module.ts):

```
...

//
// Auth libs
//

import { Auth0AuthModule, authProviders } from 'auth-auth0';
// import { AuthOktaModule, authProviders } from 'auth-okta';

@NgModule({
  imports: [
    BrowserModule,
    Auth0AuthModule.forRoot(environment),
    CoreModule,
    AppRoutingModule
  ],
  declarations: [ AppComponent ],
  providers: [
    loggerProviders,
    authProviders,
    angularMaterialProviders
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
``` 
 
### Code scaffolding

Run `ng generate component component-name` to generate a new component. 

You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Project Assets

You use the assets array inside the build target in `angular.json` to list files or folders you want to copy as-is when building your project:

```
  "assets": [
    "src/apple-touch-icon-iphone-retina.png",
    "src/apple-touch-icon-iphone-retina-precomposed.png",
    "src/browserconfig.xml",
    "src/favicon.ico",
    "src/manifest.json",
    "src/assets",
    
    ...
  ]
```

### Library Assets

ng-packagr does not copy 'assets' (the files and folders in the `assets/` directory) to the `dist/` directory.

You can workaround this issue by updating the assets array inside the build target in `angular.json`, for example:

```
  "assets": [
   
    ....
    
    {
      "glob": "**/*",
      "input": "projects/sales/src/assets",
      "output": "/assets"
    },
    {
      "glob": "**/*",
      "input": "projects/dashboard/src/assets",
      "output": "/assets"
    }
  ]
```

### Source Control

Check in:

```
git add .
git commit -m "Updated the README.md file"
git push -u origin master
```

Tag Format:

```
1.0.0-beta.1
```

To create a local tag on your current branch, run this:

```
git tag <tagname>
```

To push the local tags to GitHub:

```
git push origin --tags
```

or

```
git push origin <tag>
```

### WebStorm

To disable the 'Angular Language Service', go to WebStorm -> Preferences -> Languages & Frameworks -> TypeScript and clear the 'Angular Language Service' checkbox.

## Resources 

### Auth0 Auth Libraries
* GitHub: [Auth0 Authentication for Single Page Applications with PKCE](https://github.com/auth0/auth0-spa-js)

### Okta Auth Libraries
* GitHub: [Okta Auth JavaScript SDK](https://github.com/okta/okta-auth-js)

### Auth Resources
* Internet Engineering Task Force: [OAuth 2.0 for Browser-Based Apps](https://datatracker.ietf.org/doc/draft-ietf-oauth-browser-based-apps/)
* Internet Engineering Task Force: [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/draft-ietf-oauth-security-topics/)

### Additional Auth Resources
* Auth0's blog: [The Auth0 SPA JS SDK](https://auth0.com/blog/introducing-auth0-single-page-apps-spa-js-sdk/)
* Okta's blog: [Is the OAuth 2.0 Implicit Flow Dead?](https://developer.okta.com/blog/2019/05/01/is-the-oauth-implicit-flow-dead)

### Authorisation Servers
* GitHub: [Keycloak - Open Source Identity and Access Management](https://www.keycloak.org/)

### Angular Resources

* Angular.io: [Quick Start Guide](https://angular.io/guide/quickstart)
* Angular.io: [Style Guide](https://angular.io/guide/styleguide)
* GitHub: [Angular, one framework for Mobile & Desktop](https://github.com/angular/angular)
* GitHub: [A curated list of awesome Angular resources](https://github.com/gdi2290/awesome-angular)
* GitHub: [Catalog of Angular 2+ Components & Libraries](https://github.com/brillout/awesome-angular-components)

### Angular CLI Resources

* GitHub: [Library support in the Angular CLI](https://github.com/angular/angular-cli/wiki/stories-create-library)
* Medium: [6 Best Practices & Pro Tips when using Angular CLI](https://medium.com/@tomastrajan/6-best-practices-pro-tips-for-angular-cli-better-developer-experience-7b328bc9db81)
* Medium: [Compiling css in new Angular 6 libraries](https://medium.com/@Dor3nz/compiling-css-in-new-angular-6-libraries-26f80274d8e5)
* GitHub: [Project Assets](https://github.com/angular/angular-cli/wiki/stories-asset-configuration)

### Material Design Resources

* Material.io: [Material Design, make beautiful products, faster](https://material.io/)
* GitHub: [Material Design for Angular](https://github.com/angular/material2)
* GitHub: [Covalent - The Teradata UI Platform built on Angular Material](https://teradata.github.io/covalent/#/docs)
* GitHub: [NiFi Flow Design System](https://github.com/apache/nifi-fds)

### Angular Component Libraries

* GitHub: [flex-layout](https://github.com/angular/flex-layout)
* GitHub: [angular-split](https://github.com/bertrandg/angular-split/)
* GitHub: [angular-gridster2](https://github.com/tiberiuzuld/angular-gridster2)
* GitHub: [highcharts-angular](https://github.com/highcharts/highcharts-angular)

### Angular Form Libraries

* GitHub: [ng-dynamic-forms](https://github.com/udos86/ng-dynamic-forms)
* GitHub: [ngx-formly](https://github.com/formly-js/ngx-formly)
* GitHub: [angular-schema-form (AngularJS) - Generate forms from a JSON schema](https://github.com/json-schema-form/angular-schema-form)
* GitHub: [ngx-schema-form - HTML form generation based on JSON Schema](https://github.com/guillotinaweb/ngx-schema-form)
* GitHub: [angular2-json-schema-form - Angular 2 JSON Schema Form builder](https://github.com/dschnelldavis/angular2-json-schema-form)
* form.io: [form.io - A Form and Data Management Platform](https://www.form.io/)

### Angular i18N

* GitHub: [ngx-translate](https://github.com/ngx-translate/core)

### Additional Angular Component Libraries

* GitHub: [Angular in-memory Web API](https://github.com/angular/in-memory-web-api)
* GitHub: [json-server](https://github.com/typicode/json-server)
* GitHub: [Hotel - A simple process manager for developers](https://github.com/typicode/hotel)

### CSS Grid Layout

* CSS Tricks: [A Complete Guide to CSS Grid Layout](https://css-tricks.com/snippets/css/complete-guide-grid/)
* Grid By Example: [CSS Grid Layout by Example](https://gridbyexample.com/learn/)

### Sample Data

* Wikipedia: [List of political parties in Australia](https://en.wikipedia.org/wiki/List_of_political_parties_in_Australia)
* Australian Parliament: [Mail Labels for Australian Senators](https://www.aph.gov.au/Senators_and_Members/Guidelines_for_Contacting_Senators_and_Members/Address_labels_and_CSV_files)
