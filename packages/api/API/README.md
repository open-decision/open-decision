# Open Decision

Welcome to the Open Decision backend!

The backend is built using Node.js and Express, we are using Typescript for the whole project. The backend is providing an REST API for authentication as well as a GraphQL API for storing and managing apps build with Open Decision.

The backend is mainly designed to be used in conjunction with the Open Decision frontend, which can be found here: [github.com/open-legal-tech/open-decision](https://github.com/open-legal-tech/open-decision).

## Table of content

- [Important Links](#important-links)
- [Participate](#participate)
- [Deploy in the Cloud](#deploy-in-the-cloud)
- [Local Set-Up](#local-set-up)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Additional settings](#additional-settings)
  - [Running the tests](#running-the-tests)
- [Contributing](#contributing)
- [License](#license)
- [Links](#links)

## Important Links

See the frontend on [github.com/open-legal-tech/open-decision](https://github.com/open-legal-tech/open-decision)

Further information about the project on [open-decision.org](https://open-decision.org)

Open Decision is a project by the [Open Legal Tech e.V.](https://open-legal-tech.org/), a non-profit based in Berlin, Germany.

## Participate

Join our growing community and socialize in [our Slack-Workspace](https://open-decision.org/slack).

Feel free to pick an issue, open a bug report, feature request or fork the project. We are open to any input or suggestions on how to bring the project forward.

If you want to join our team, contact us at [contact@open-decision.org](mailto:contact@open-decision.org).

## Deploy in the Cloud

With one click, you can deploy your own instance of the Open Decision backend for free on Heroku.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/open-legal-tech/node-backend)

Make sure to replace the ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET as soon as possible to secure your instance. [Click here](https://djecrety.ir/) to generate two unique secret keys and [replace them in the Heroku Dashboard.](https://devcenter.heroku.com/articles/config-vars#using-the-heroku-dashboard)

Take a look at the [.evn.example file](https://github.com/open-legal-tech/node-backend/blob/master/.env.example)to see the optional variables you should set when running the backend properly. Refer to the [Heroku documentation](https://devcenter.heroku.com/articles/config-vars#using-the-heroku-dashboard)for more information about config variables.

## Local Set-up

The instructions down below will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to install Node.js and the package manager npm globally. When you install Node from the [official website](https://nodejs.org/en/download/), npm will be installed as well. We are currently using Node 16 LTS.

Furthermore, make sure to have [git installed](https://git-scm.com/downloads) and available in your terminal.

To run the backend locally, you need to connect to a (local) PostgreSQL database. For macOS users, we recommend using [Postgres.app](https://postgresapp.com/) as its open source and super simple to use. For other OS, you might want to refer to the [tutorial provided by Prisma](https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database), the ORM the backend is using, or some other tutorials.

(Optional)
If you want to run the tests, you need to have docker and docker-compose installed. The easiest way is to [install Docker Desktop](https://www.docker.com/products/docker-desktop).

### Installation

Open the folder where you want the code to be in the terminal.

Clone the repo using the commmand below or download the [repo](https://github.com/open-legal-tech/node-backend) as zip, unpack the folder and rename it to "node-backend".

```
# Clone repository to current directory
git clone https://github.com/open-legal-tech/node-backend.git
```

Next install the dependencies.

```
# Enter the folder and install the dependencies
cd node-backend
npm install
```

Next, we need to set the environment variables. By default, the backend expects a `.env.development` file in the project root when running `npm run dev` for the development environment.

Feel free to rename the `.env.development.example` file to `.env.development`.

Next, set the `DATABASE_URL` variable to the connection string for your local Postgres database. When using Postgres.app, simply replace the two occurrences of "username" in the string with your macOS system user name, as this is the [default database](https://postgresapp.com/) provided.

If you're using another local Postgres database, please refer to the documentation on how to create a database and get the connection string.

Finally, when using the local database for the first time, run the following command to migrate the schema.

```
npm run migrate:dev
```

Now, you can start the local server using

```
npm run dev
```

The console should print the following if everything worked fine:

```
info: Listening to port 3000
info: Connected to database
```

Access the server at [http://localhost:3000](http://localhost:3000).

To see the API documentation, go to [http://localhost:3000/v1/docs](http://localhost:3000/v1/docs).

### Additional settings

There are several additional settings you can set in the .env-files. Please [refer to the commented .env.example file](https://github.com/open-legal-tech/node-backend/blob/master/.env.example) to see all possible options. For a deeper insight, you can take a look at the [zod validation schema](https://github.com/open-legal-tech/node-backend/blob/master/src/validations/env.validation.ts).

To test the mailing functionality, we recommend using [Ethereal](https://ethereal.email/). When running in production, you should use a transactional SMTP provider, as Ethereal is not actually sending mails.

### Running the tests

To verify that the backend is running correctly it comes equipped with many end-to-end tests (and some unit tests) using [Jest](https://github.com/facebook/jest) and [supertest](https://github.com/visionmedia/supertest).

The database for the tests is run using docker-compose. Therefore, you need to have Docker installed (see [Prerequisites](#prerequisites)).

Next, you need to provide an `.env.test` file in the project root. The `.env.test.example` file can be renamed to `.env.test`, it already contains the connection string for the docker database.

Now, make sure that Docker Desktop (or the docker daemon) is running and start the test scripts using `npm run test`.

At the moment, some of the tests for the docs are failing due to some routing issues. All other tests should pass fine.

## Contributing

Please read [CONTRIBUTING.md](https://github.com/fbennets/open-decision/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/fbennets/open-decision/blob/master/LICENSE) file for details.

## Links

- [Project Website](http://open-decision.org)
- [Join our Slack-Workspace](https://open-decision.org/slack)
