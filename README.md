# GRASBERG COFFEE BACKEND

Codebase containing CRUD and auth to provide client side for our [project](##Related)

[![dotenv](https://img.shields.io/badge/dotenv-16.0.3-blue)](https://www.npmjs.com/package/dotenv)
[![express](https://img.shields.io/badge/express-4.18.1-blue)](https://www.npmjs.com/package/express)
[![bcrypt](https://img.shields.io/badge/bcrypt-5.0.1-blue)](https://www.npmjs.com/package/bcrypt)
[![jsonwebtoken](https://img.shields.io/badge/jsonwebtoken-8.5.1-blue)](https://www.npmjs.com/package/jsonwebtoken)
[![multer](https://img.shields.io/badge/multer-1.4.4-blue)](https://www.npmjs.com/package/multer)
[![morgan](https://img.shields.io/badge/morgan-1.10.0-blue)](https://www.npmjs.com/package/morganr)
[![postgreSQL](https://img.shields.io/badge/pg-8.8.0-blue)](https://www.npmjs.com/package/morganr)

# Installation

## 1. Clone this repository

Clone this repository by run the following code:

```
$ git clone https://github.com/Rama-z/Grasberg-Coffee-Project-V1
```

## 2. Go to directory

```
$ cd Grasberg-Coffee-Project-V1
```

## 3. Install dependency packages

Install dependency packages by run the following code inside project folder:

```
$ npm install
```

## Application Structure

- `index.js` - The entry point to our application. This file defines our express server and connects it to posgreSQL
- `config/` - This folder contains configuration for passport as well as a central location for configuration/environment variables.
- `routes/` - This folder contains the route definitions for our API.
- `repo/` - This folder contains the schema definitions for our sql models.
- `controller/` - This folder contains the schema definitions for unctions that separate out the code to route requests from the code that actually processes requests.
- `middleware/` - This folder contains the schema definitions for middleware.
- `helper/` - This folder contains helper functions to make our code much easier to read
- `public/` - This folder contains uploaded data to our API

## Documentation

[Documentation](https://bit.ly/3it3CwK)

## Features

- Auth
  - login
  - logout
- Product
  - Get Product
  - Edit
  - Delete
  - Update
- Users
  - Register
  - Edit password
  - Update profile
- Transactions
  - Get transaction history
  - Create transaction
  - Edit transaction
  - Delete transactions
- Promos
  - Get Promos
  - Create
  - Update
  - Delete

## API Reference Example

```http
  GET, POST /products
```

```http
  GET, POST, PATCH, DELETE /products/${id}
```

```http
  GET, POST, UPDATE /transasction
```

```http
  DELETE /transasction/${id}
```

## Related Projects

[Grasberg Coffee Web](https://github.com/Rama-z/Grasberg-Coffee-Front-End-Reactjs/)<br/>
[Grasberg Coffee Mobile](https://github.com/Rama-z/Gasberg-Native)

## Authors

- [@Rama-z](https://github.com/Rama-z)
