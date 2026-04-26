<br/>
<div id="studentide-logo" align="center">
    <br />
    <!-- TODO: Replace this inherited Theia logo URL with the final StudentIDE logo asset. -->
    <img src="https://raw.githubusercontent.com/eclipse-theia/studentide/master/theia-extensions/product/src/browser/icons/StudentIDE.png" alt="StudentIDE Logo" width="300"/>
    <h3>StudentIDE</h3>
</div>

<div id="badges" align="center">

StudentIDE is built with this project.\
StudentIDE also serves as a template for building browser-based products based on the Theia platform.

</div>

[![Build Status](https://ci.eclipse.org/theia/buildStatus/icon?subject=latest&job=Theia2%2Fmaster)](https://ci.eclipse.org/theia/job/Theia2/job/master/)

[Main Theia Repository](https://github.com/eclipse-theia/theia)

[Visit the Theia website](http://www.studentide.org) for more documentation about the underlying platform.

## License

- [MIT](LICENSE)

## What is this?

StudentIDE is a modern and open IDE for the browser. StudentIDE is based on the [Theia platform](https://studentide.org).
You can run the StudentIDE browser app locally or package it as a Docker image.

StudentIDE also serves as a **template** for building browser-based products based on the Theia platform. It is made up of a subset of existing Theia features and extensions. [Documentation is available](https://studentide.org/docs/composing_applications/) to help you customize and build your own StudentIDE-based product.

## Development

### Requirements

Please check Theia's [prerequisites](https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites), and keep node versions aligned between StudentIDE and the referenced Theia version.

### Repository Structure

- Root level configures mono-repo build with lerna
- `applications` groups the different app targets
  - `browser` contains the StudentIDE browser app that may be packaged as a Docker image
- `theia-extensions` groups the custom Theia extensions for StudentIDE
  - `product` contains a Theia extension contributing the product branding (about dialogue and welcome page).
- `patches` contains patches applied to upstream packages

### Build

For development and casual testing of StudentIDE, one can build it in "dev" mode. This permits building the IDE on systems with less resources, like a Raspberry Pi 4B with 4GB of RAM.

NOTE: If manually building after updating dependencies or pulling to a newer commit, run `git clean -xfd` to help avoid runtime conflicts.

```sh
# Build "dev" version of the app. Its quicker, uses less resources, 
# but the front end app is not "minified"
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

### Developing with Local Theia Framework

To build and test StudentIDE against a local development version of the Theia framework, see [docs/developing-with-local-theia.md](docs/developing-with-local-theia.md).

### Reporting Feature Requests and Bugs

The features in StudentIDE are based on Theia and the included extensions/plugins. For bugs in Theia please consider opening an issue in the [Theia project on Github](https://github.com/eclipse-theia/theia/issues/new/choose).
If you believe there is a mistake in the StudentIDE browser packaging, please open an issue.

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
