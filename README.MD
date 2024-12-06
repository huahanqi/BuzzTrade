# BuzzTrade

## Project Introduction

This is the source code for CS 6400 final project named BuzzTrade. BuzzTrade serves as the online marketplace specifically for Georgia Tech students and faculties. It allows users to post second-hand items for sale and place orders on items they wanted. Moreover, it also provides the messaging features to let buyers ask sellers any questions they may have.

## Project Setup

We use node.js and express.js to build this backend service, and store all the user-generated data in MongoDB Atlas Database (https://www.mongodb.com/products/platform/atlas-database). Dependecies for this project is in the package.json file. For demonstration purpose, We also build a command line interface (CLI) using JavaScript.

## Data Preparation

All data are user-generated. There is no explicit data loading and preprocessing for this project.

## Running the Project

### Runing Backend

Run the following command to run our backend server on your local server (default port 8080)

```bash
npm install && npm start
```

### CLI Usage

Use the following command to see all available commands:

```
node cli.js --help
```

## Reference

We learned a lot about how to built backend APIs in Node.js from this tutorial: https://www.youtube.com/watch?v=qwfE7fSVaZM&t=34523s and used some code base as our starting point for this project: https://github.com/john-smilga/node-express-course. Big thanks to John Smilga who created this tutorial!
