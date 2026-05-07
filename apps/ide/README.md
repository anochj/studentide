<br/>
<div id="studentide-logo" align="center">
    <br />
    <h1>student<span>ide_</span></h1>
    <h3>Prepared coding workspaces for project-based courses</h3>
</div>

<div id="badges" align="center">

StudentIDE packages project instructions, starter files, editor tools, and submission context into a browser workspace students can launch without local setup.

</div>

## License

- [MIT](LICENSE)

## What is this?

StudentIDE is the browser IDE surface for the studentide product. It gives instructors a consistent runtime for coding projects and gives students a ready workspace with the expected files, tools, instructions, and submission path.

You can run the browser app locally for development or package it as a Docker image for hosted IDE sessions.

## Development

### Requirements

Use Node 22 and Yarn 1.x, matching the engines declared in the browser app package.

### Repository Structure

- Root level configures the IDE monorepo build with lerna
- `applications` groups the different app targets
  - `browser` contains the StudentIDE browser app that may be packaged as a Docker image
- `theia-extensions` groups custom StudentIDE extensions
  - `product` contributes StudentIDE branding, the welcome page, assignment overview, theme, and product actions
- `patches` contains package patches required by the IDE build

### Build

For development and casual testing, build the IDE in dev mode.

NOTE: If manually building after updating dependencies or pulling to a newer commit, clear generated outputs before rebuilding to avoid runtime conflicts.

```sh
# Build the dev version of the app. It is quicker and uses less memory.
yarn && yarn build:dev && yarn download:plugins
```

Production applications:

```sh
# Build production version of the StudentIDE app
yarn && yarn build && yarn download:plugins
```

### Running Browser app

The browser app may be started with

```sh
yarn browser start
```

and connect to <http://localhost:3000/>

### Developing with Local Framework Packages

To build and test StudentIDE against local framework packages, see [docs/developing-with-local-theia.md](docs/developing-with-local-theia.md).

### Reporting Feature Requests and Bugs

If a workspace does not launch, save, or submit correctly, report the project name, browser, workspace URL, and recent action. If the issue is in StudentIDE browser packaging, open an issue in this project.

### Docker

You can create the Docker image for StudentIDE with the following build command:

```sh
docker build -t studentide -f browser.Dockerfile .
```

You may then run this with

```sh
docker run -p=3000:3000 --rm studentide
```

and connect to <http://localhost:3000/>
