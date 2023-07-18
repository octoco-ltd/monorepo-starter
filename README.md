# monorepo-starter

nvm use 18.16.1
npm i -g yarn
npm i -g nx@latest
yarn create nx-workspace@latest starter --preset=nest

Connected the workspace to nx cloud by following the link
```
https://cloud.nx.app/orgs/workspace-setup?accessToken=NmUxNWUzYmYtNjQ2MC00Y2I3LTk0ZjUtYTMyOWUyYTIzMGIxfHJlYWQtd3JpdGU=
```

NX_BRANCH=testing nx run-many -t build

nx serve starter


nx g @nx/js:lib domain
--> Choose jest
--> Choose tsc

nx g @nx/js:lib infrastructure
--> Choose jest
--> Choose tsc

npm i -D @nx/react

nx g @nx/react:app react-app-1

## MikroORM - Unit Of Work
https://mikro-orm.io/docs/unit-of-work
https://mikro-orm.io/docs/3.6/usage-with-nestjs


## Storybook
https://nx.dev/packages/storybook


## Add .NET projects
https://www.nx-dotnet.com/docs/core/guides/handling-solutions/