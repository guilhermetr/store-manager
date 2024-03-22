# Store Manager

This project is a solution designed for managing a store's operations efficiently. It consists of both backend and frontend components.

## Backend
The backend is built on a microservices architecture using .NET 6 technologies. It includes the following main services:

1. **Authentication Service**:
   - Provides a Web API for user authentication.
   - Implements a security feature where after 3 failed login attempts, the user's IP address is blocked for 5 minutes.
   - Uses JWT for authentication and has an endpoint for validating JWT tokens, which other services within the system use for authorization checks.

2. **Products Service**:
   - Provides a Web API for product management through CRUD operations.

3. **Orders Service**:
   - Provides a Web API for order management through CRUD operations.   
   - Provides an endpoint for retrieving detailed information on finished orders.

4. **Logging Service**:
   - Helps monitoring system changes and activities.
   - Features a Web API endpoint for logging events and a Log Viewer Console application for log viewing.

5. **Common Project**:
   - A centralized repository for shared functionalities, models, utilities, and services used across all microservices.   
   - Integrated into each service via a NuGet package promoting the decoupled architecture of microsservices.

## Frontend
The frontend of the Store Manager project is a client application developed using Angular. Users can register for new accounts and log in, interacting directly with the Authentication Service. Once logged in, users are issued a JWT token, enabling secure and authorized interactions with the Orders and Products services for all CRUD operations (which can be performed through an intuitive interface).

## Running the Project

### Prerequisites

Before running the project, ensure you have the following prerequisites installed:

- [.NET SDK](https://dotnet.microsoft.com/download) (version 6.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- [Node.js](https://nodejs.org/)

#### Setting Up Databases

Ensure that you have SQL Server installed and running. Create the databases required for the project by running the script `create_databases.bat` (Windows only). This script will navigate to each service's directory and run migrations to create the necessary databases.

#### Setting Up Angular app

Navigate to client-app directory and install dependencies using `npm install`.

### Starting Services

After setting up the databases, you can start all the services simultaneously using the provided script `run_services.bat`.

### Starting Client app

Navigate to client-app directory and run `npm start`. Finally, go to `http://localhost:4200/` to use the app.
