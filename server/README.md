# LOCKIN app - backend server

this is the backend server for the lockin app, a platform that allows users to create and participate in challenges with financial incentives.

## technologies

- node.js with express
- typeScript
- postgresql with prisma 

# api endpoints

### challenges
getting all the challenges

```http
GET /api/challenges
```

getting a specific challenge
```http
GET /api/challenges/:id
```


