# Gastar-Me

[![CircleCI](https://circleci.com/gh/leoribeirowebmaster/gastar-me.svg?style=svg)](https://circleci.com/gh/leoribeirowebmaster/gastar-me) [![Coverage Status](https://coveralls.io/repos/github/leoribeirowebmaster/gastar-me/badge.svg?branch=master)](https://coveralls.io/github/leoribeirowebmaster/gastar-me?branch=master)

**Gastar-Me** is an application that makes complete management of your credit cards, prioritizing the best choice of card at the time of purchase.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Npm](https://www.npmjs.com/)
- [Mongodb](https://www.mongodb.com/)

### Installing

After github project clone, enter the project folder and run:

Install dependencies

```shell
npm install
```

### Running in development mode

Create the **development.env** in the root folder with the parameters:

```
MONGO_URI=<< your mongodb string connection >>
JWT_SECRET=<< secret for sign JWT Tokens >>
JWT_EXPIRES=<< JWT expiration time >>
```

Start the server in development mode with hot reload

```shell
npm run start:dev
```

The server is running at [http://localhost:3000](http://localhost:3000)

## Documentation

This api has been documented using the [OpenAPI](https://github.com/OAI/OpenAPI-Specification) and [Swagger](https://swagger.io/docs/specification/about/) specification, after the server is running, view the complete documentation at [http://localhost:3000/swagger](http://localhost:3000/swagger).

## Running the tests

### Unit tests

```shell
npm test
```

### Unit tests with coverage

```shell
npm run test:coverage
```

### Coding style tests

```shell
npm run lint
```

## Built With

- [NestJs](https://docs.nestjs.com/) - Nest is a framework for building efficient, scalable [Node.js](https://nodejs.org/) server-side applications. 

## Contributing

Please read [CONTRIBUTING.md](https://github.com/leoribeirowebmaster/gastar-me/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [releases on this repository](https://github.com/leoribeirowebmaster/gastar-me/releases). 

## Authors

- **Leonardo Ribeiro** - *Initial work* - [leoribeirowebmaster](https://github.com/leoribeirowebmaster)