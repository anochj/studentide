# Developing StudentIDE With Local Theia

This guide explains how to build and test StudentIDE against a local development checkout of the [Theia framework](https://github.com/eclipse-theia/theia). This is useful when you need to test StudentIDE changes against unreleased Theia packages or debug behavior that spans both repositories.

## Repository Layout

```text
parent-directory/
  theia/        # Local Theia framework checkout
  studentide/   # StudentIDE repository
```

## Build

From the StudentIDE repository:

```sh
node scripts/build-with-local-theia.js
```

The script will:

1. Install and compile the local Theia checkout.
2. Create yarn links for the required `@theia/*` packages.
3. Link those packages into StudentIDE.
4. Build the StudentIDE browser app.
5. Download plugins unless `--skip-plugins` is provided.

## Run

```sh
yarn browser start
```

Then open <http://localhost:3000/>.

## Common Options

```sh
# Use a non-default Theia checkout location
node scripts/build-with-local-theia.js --theia-path /path/to/theia

# Rebuild only StudentIDE when Theia was already compiled
node scripts/build-with-local-theia.js --skip-theia-build

# Link packages without building StudentIDE
node scripts/build-with-local-theia.js --skip-ide-build

# Restore npm dependencies after local linking
node scripts/build-with-local-theia.js --unlink
```

The script does not update package versions. If needed, run the version update commands separately before building.
