# Payment System Project

This project is a **payment-system** application developed using Node.js, MongoDB, and Express.js.

## Technologies Used

This project is developed using JavaScript and includes the following technologies:

- **Node.js**: Used as the runtime environment for server-side JavaScript.
- **MongoDB**: Used as the database.
- **Express.js**: Used as the server-side application framework.

### Packages Used

The project includes the following packages:

- **crypto-js**: Used for encrypting passwords.
- **dotenv**: Used for loading environment variables.
- **helmet**: Used for security measures.
- **http-status**: Used for facilitating the use of HTTP status codes.
- **joi**: Used for data validation.
- **jsonwebtoken**: Used for JWT (JSON Web Token) authorization.
- **mongoose**: Used for interacting with MongoDB.
- **async-mutex**: Used for lock management and synchronization.
- **compression**: Used for compressing HTTP responses.
- **jest**: Used as the JavaScript testing framework.
- **mongodb-memory-server**: Used for testing MongoDB applications.
- **nanoid**: Used for generating unique identifiers.
- **supertest**: Used for testing HTTP servers.
- **swagger-jsdoc**: Used for generating Swagger documentation.
- **swagger-ui-express**: Used for presenting Swagger documentation in a user-friendly manner.

## Endpoints

### USERS

- **GET /users**: Used to view information of all users in the system.
- **GET /users/:id**: Used to view information of users based on the provided ID.
- **GET /users/transactions**: Displays all transactions made by the user.
- **GET /users/balance**: Displays the balance in the user's account.
- **GET /users/transactions/sender**: Displays transactions where the user is the sender.
- **GET /users/transactions/receiver**: Displays transactions where the user is the receiver.
- **POST /users**: Used to create a new user.
- **POST /users/login**: Allows the user to log in to the system.
- **PATCH /users/change-password**: Allows the user to change their password.
- **PATCH /users**: Allows the user to update their information.

### TRANSACTIONS

- **POST /transactions**: Used to create a new transaction.

## Running the Application Locally

1. Install Node.js, MongoDB, and MongoDB Compass.
2. Clone the project to your local directory.
3. Navigate to the project directory in your terminal and run `npm install` to install dependencies.
4. Create a `.env` file and define the necessary environment variables.
5. Execute the following command in your terminal:
`npm run start`
6. Send requests to the required endpoints using tools like Postman.
7. Visit `localhost:3000/api-docs` in your browser to view and test the API documentation using Swagger.

## Running in Kubernetes

1. Install Docker.
2. Enable Kubernetes from the Docker interface.
3. Refer to the [Minikube documentation](https://minikube.sigs.k8s.io/docs/start/) and [Kubernetes documentation](https://kubernetes.io/docs/tasks/tools/) for instructions on installing Minikube and kubectl.
4. Build the Docker image:
`docker build -t local-nodejs-kubernetes:1 .`
5. Start containers with Docker Compose:
`docker-compose up --build -d`
6. Apply Kubernetes resources:
`kubectl apply -f deployments`
7. Set up Minikube Docker environment:
`eval $(minikube docker-env)`
8. Start Minikube tunnel:
`minikube tunnel`
9. Send requests to the required endpoints (`localhost:8099/users` or `localhost:8099/transactions`) using tools like Postman.
By following these steps, you can successfully run your Node.js application in a Kubernetes environment.

## Testing

To test the application:
1. Set the value of NODE_ENV to "test" in the .env file:
`NODE_ENV=test`
2. Execute the following command in your terminal:
`npm run test`
3. These steps will configure the environment for testing and run the test suite.

