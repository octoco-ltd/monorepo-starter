# SwitchTrading

Monorepo for the Switch energy trading platform. Currently the monorepo is managed using [`yarn workspaces`](https://yarnpkg.com/features/workspaces), and to ensure a decent developer experience the packages make use of [`project references`](https://www.typescriptlang.org/docs/handbook/project-references.html#build-mode-for-typescript) to build typescript packages in the correct order.

## Installation

Make sure that you have the latest version of `yarn` installed to make use of workspace features. Note that this is _not_ the latest version of `yarn` available on `npm` - installation instructions can be found [here](https://yarnpkg.com/getting-started/install). Once you've installed `yarn`, you can set yourself up as follows:

```bash
yarn install
yarn plugin import workspace-tools
yarn workspaces list
```

You should see something like this:

```
➤ YN0000: .
➤ YN0000: packages/@octoco/models
➤ YN0000: packages/@octoco/rest
➤ YN0000: Done in 0s 1ms
```

## Usage

Each of the packages listed above is a [_workspace_](https://yarnpkg.com/features/workspaces), which basically just means a folder with a `package.json`. When you run `yarn install`, it automatically tries to deduplicate dependencies across each workspace into the root `node_modules` folder.

### Running Workspace Scripts

You can run scripts in a particular workspace's `package.json` with `yarn workspace <workspace-name> <script-name>`. The `<workspace-name>` should match the workspace's `package.json` name, so for instance to build the REST API you can run:

```
yarn workspace @octoco/rest build
```

This will automatically build the `@octoco/models` workspace first, as it's a dependency of `@octoco/rest` (see [managing dependencies](#markdown-header-managing-dependencies)). If you want to run a script across every workspace, you can do it as follows:

```
yarn workspaces foreach run <script_name>
```

Note that you can also `cd` into a workspace's directory and run `yarn <script_name>` directly if you prefer.

### Adding a New Workspace

Workspaces are configured in the root `package.json`. Currently `yarn` recognises any packages inside the `packages/` directory as a workspace:

```json
{
  "workspaces": [
    "packages/@octoco/*"
  ]
}
```

You can simply add your package to `packages/<workspace_name` and `yarn` will automatically pick it up. If you want to recognise a package that you've put somewhere else you'll have to add it to the `workspaces` list in the root `package.json`.

### Managing Dependencies

Each workspace manages its own dependencies in its local `package.json`. This has some disadvantages, such as not being guaranteed that every package is running the same version of every dependency, but it makes migration in/out of the monorepo very easy and reduces the complexity of our toolkit. You can add dependencies to a workspace using `yarn`, in which case it will automatically try and match the version of that dependency against other packages in the monorepo, to avoid version drift:

```
yarn workspace @octoco/rest add @nestjs/common
```

If you want to have a workspace depend on another workspace (for instance, the REST API depends on the shared models library), you can do exactly the same thing:

```
yarn workspace @octoco/rest add @octoco/models
```

There is one catch though - `tsc` isn't aware of yarn workspaces by default, so you would have to make sure to build the `@octoco/models` workspace before you build the `@octoco/rest` workspace. To solve this problem, you can add a typescript [project reference](https://www.typescriptlang.org/docs/handbook/project-references.html) to the workspace to tell `tsc` that there is a build dependency between them. This is configured in the workspace's `tsconfig.json`:

```js
{
  "references": [
    {
      "path": "../models" // tell tsc that we depend on this workspace
    }
  ]
}
```

Now whenever you build `@octoco/rest` it will build the dependencies first. As usual, you can run all of these commands within the `@octoco/rest` directory if you want to avoid writing `yarn workspace <...>` all the time.

### Generating CRUD Boilerplate

The `_templates` directory contains a [`hygen`](https://github.com/jondot/hygen) template that can generate basic NestJS and MikroORM boilerplate for business model CRUD, including tests. To generate boilerplate for a `Municipality` model, for instance, you can run:

```bash
yarn hygen generate crud Municipality
```

This will write an entity class and a database service for it to the shared `@octoco/models` workspace, and a REST controller for basic CRUD to the `@octoco/rest` workspace. It also generates tests for both, so you can verify that it worked by running `yarn workspaces foreach run test`. Currently this boilerplate is pretty minimal, but it does give you a model that's fully wired up.

If you want to edit the template, the [`hygen`](https://github.com/jondot/hygen) github page has great documentation.
