### Project Introduction
This is the backend server code for CS 8803 MAS programming project (To-Do-List app) see details here: https://github.com/aaronwork1205/CS_8803_MAS_fall2023/tree/main. <br> 
We use node.js and express.js to build this backend api, and store all the user-generated data in MongoDB Atlas Database. This backend server responds to requests when users register new accounts and log-in with existing accounts. 
It also responds to requests sent by users when they want to create, read, update, and delete tasks in their Todo List. 

### Project Setup
This backend has been published to Heroku. The link is the following: https://tasks-api-8803-8645d4ff37f7.herokuapp.com/ <br>
Go to https://tasks-api-8803-8645d4ff37f7.herokuapp.com/api-docs/ to see documents about all the api endpoints <br>
You can also download the source code and run this command to test running our backend server on your local server (default port 8080)

```bash
npm install && npm start
```

Swagger UI

```yaml
/tasks/{id}:
  parameters:
    - in: path
      name: id
      schema:
        type: string
      required: true
      description: the task id
```

### Reference

We learned a lot about how to built backend apis from this tutorial: https://www.youtube.com/watch?v=qwfE7fSVaZM&t=34523s <br>
and used some source code there as our starting point. Great thanks to John Smilga who created this tutorial for us! 


