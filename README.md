![CI](https://github.com/ocean-tech-ship/ocean-pearl-api/actions/workflows/ci.yml/badge.svg)

## Description

Backend repository for the ocean-pearl project.
An Open API documentation can be found at https://api.oceanpearl.io.

## Startup

Create .env files for each working environment, e.g. ```dev.env```, inside the environment folder.
An example for the contents of the file can be found inside the environment folder. 

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing

```bash
$ npm run test 
```

To run tests locally you preferably have an instance of MongoDB installed on your local machine.
Refer to the MongoDB documentation for further instructions:
https://docs.mongodb.com/manual/administration/install-community/