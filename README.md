<p align="left">
  <img src='.github/docs/logo.svg' width='200' />
</p>

# Storify 
> A mock e commerce store built to learn clean GraphQL schema design, database relationships & React

# :pushpin: Table of contents 
* [Features](#rocket-features)
* [Getting started](#runner-getting-started)
* [Found a bug?](#bug-issues)
* [Contributing](#tada-contributing)
* [License](#closed_book-license)


# :rocket: Features

* User registration, login & authentication flow with forgot password & password resets
* Full product creation user flow (with Stripe integration)
* Full Cart management flow
* Create orders 

# :construction_worker: Getting Started


**You will need to install the following in order to get this project up & running locally**


* [Node.js](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/)
* [NVM](https://github.com/nvm-sh/nvm) (this project only currently supports node versions V14 or higher)
* [Docker](https://www.docker.com/)


**Dependency management with Lerna & yarn workspaces** 

The project currently uses [Lerna](https://github.com/lerna/lerna) and [Yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) to manage dependencies. This project follows a monorepo structure and should be treated as such. This means that when installing new dependencies or bootstraping the project for the first time, you should not run `yarn install` in a given sub-project's directory. Any new dependencies should be directly added to sub-project package.json and you should then run `yarn` in the root directory to install these new dependencies.


**Install Dependencies** 

```
yarn
```

**Setting up environment variables** 

Both the `frontend` and `api` project have a `.env.example` which provides an example of what `.env` variables are required & their type (i.e. string, number etc). If you fail to provide these values, the frontend & api **will fail to start**.

Create your environment variables based on the examples of the relevant `.env.example`

```
cp -r .env.example .env 
```

***Setting up Redis & Postgres*** 

You must install [Docker](https://www.docker.com/) in order to run Redis & Postgres. Make sure you have filled the environment variables related to Postgres & Redis correctly and then run the following to start Redis & Postgres.

```bash
docker-compose up 
```

# :runner: Getting started 

Now that the databases are started we can start the API for the first time. It's worth nothing that when the server is in development, we automatically run migrations in order to save time when changing database columns.

Run the following commands to start the API (ensure the databases are running): 


This command transpiles Typescript to Javascript:

```bash 
yarn watch
```

Open up a new terminal & cd into the `api` folder


Start the API in a development environment:  

```bash
yarn dev 
```

The backend will now be listening on `http://localhost:<PORT>/api/graphql`


# :postbox: FAQ 

**Question** What tech is used in this Project? 

**Answer:** [Node.js](https://nodejs.org/en/), [Apollo server](https://www.apollographql.com/docs/apollo-server/), [TypeGraphQL](https://typegraphql.com/), [Redis](https://redis.io/), [Stripe](https://stripe.com/en-gb-de), [Next.js](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/), [URQL](https://formidable.com/open-source/urql/)

**Question** Why use GraphQL & not REST? 

**Answer:** While I could've chosen to write this API purely in a RESTful manner, this would've extended the amount of time spent on this project significantly. This project uses GraphQL codegen which significatlly cut down the amount of development & testing resource it would've taken to manually write hooks & manage state. In addition to this, I wanted to encounter n+1 problems with a real GraphQL API and learn how to fix this. 


# :bug: Issues

Feel free to **file a new issue** with a respective title and description in the [Storify](https://github.com/luke-h1/storify/issues) repository. If you already found a solution to your problem, **I would love to review your pull request**! Have a look at the [contribution guidelines](https://github.com/luke-h1/storify/blob/dev/CONTRIBUTING.md) to find out about the coding standards.


# :tada: Contributing

Check out the [contributing](https://github.com/luke-h1/storify/blob/dev/CONTRIBUTING.md) page to see the best places to file issues, start discussions and begin contributing.


# :closed_book: License
This project is under the [MIT license](https://github.com/luke-h1/storify/dev/LICENSE.md).


Made with love by [Luke Howsam](https://github.com/luke-h1) 💜 🚀💥