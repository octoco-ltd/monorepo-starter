# monorepo-starter

This repo is an experiment to find a monorepo pattern that works for multiple projects.

## Commands used to set it up

nvm use 18.16.1
npm i -g yarn
npm i -g nx@latest
yarn create nx-workspace@latest starter --preset=nest

Connected to the nx cloud to view builds etc

# Folder structure

## apps

## libs

### domain

### infrastructure

## -- data access layer

## Scripts to run builds and serves

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

# DDD

https://javascript.plainenglish.io/understanding-the-fundamentals-of-domain-driven-design-82a24239d51d

https://enlabsoftware.com/development/domain-driven-design-in-asp-net-core-applications.html

https://medium.com/microtica/the-concept-of-domain-driven-design-explained-3184c0fd7c3f

## Terminology

### Aggregates

An aggregate is a collection of domain objects that are logically related to each other. It is a unit of change, meaning that all of the objects in an aggregate must be changed together. For example, if you change the address of a customer, you must also change the address in all of the customer's orders.

### Value Objects

# Other

## Cloud URL

https://cloud.nx.app/orgs/64b5a7ca09a3e3000df5f54c/workspaces/64b62f4ad76e71248661854e

## MikroORM - Unit Of Work

https://mikro-orm.io/docs/unit-of-work
https://mikro-orm.io/docs/3.6/usage-with-nestjs

## Storybook

https://nx.dev/packages/storybook

## Add .NET projects

https://www.nx-dotnet.com/docs/core/guides/handling-solutions/
