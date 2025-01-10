# Sourcix Home Assignment

## Overview

This home assignment involves working with a procurement service built using Node.js, Express, and TypeScript. The goal is to enhance the service by fixing existing issues and integrating external data sources.

## Project Structure

Here’s the structure of the project:

```
/project-root
│
├── backend
│   ├── procurement-service
│   │   ├── src
│   │   │   ├── controllers
│   │   │   │   └── procurementController.ts
│   │   │   ├── app.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── vendor-service
│       ├── src
│       │   ├── controllers
│       │   │   └── vendorController.ts
│       │   ├── app.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── docker-compose.yml
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 1.27 or higher)
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)

## Getting Started

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Build and Run the Docker Containers**

   Use Docker Compose to build and run the services:

   ```bash
   docker-compose up --build
   ```

   This command will build the Docker images and start the containers defined in the `docker-compose.yml` file, located in the root of the project.

3. **Access the Application**

   Once the containers are running, you can access the procurement service at:

   ```
   http://localhost:3002
   ```

   You can also check the health endpoint:

   ```
   http://localhost:3002/health
   ```

## Accessing the UI Dashboard

Once the containers are running, you can access the UI dashboard at:

```
http://localhost:8080
```

The dashboard provides a user-friendly interface to interact with the procurement service and view the data. Make sure to explore the various features available in the dashboard.

## Tasks

### 1. Fix the Invalid Date Issue

Currently, the `createdat` field in the response may show an invalid date in the UI. Your task is to ensure that the date is formatted correctly before sending it to the client.

- Investigate the code in the procurement controller and ensure that the date is being set to the current date when a new request is created.
- If the date is being retrieved from a database, ensure it is formatted correctly in ISO format.

### 2. Integrate External API Data

Enhance the procurement service by integrating data from an external API.

- Choose an external API that provides relevant data (e.g., product information, inventory levels, etc.).
- Implement a new endpoint that fetches data from this external API and returns it in a structured format.
- Ensure proper error handling and logging for the API requests.

### 3. Add Procurements to Vendors

Enhance the vendor service by integrating data from an external API to create procurements for each vendor.

- Choose an external API that provides relevant procurement data (e.g., product information, inventory levels, etc.). You can use the **JSONPlaceholder** API or any other suitable API.
- For each vendor, create at least **five procurements** with items and quantities.
- Implement a new endpoint in the vendor service (e.g., `/api/vendors/:id/procurements`) that allows you to fetch and create procurements for a specific vendor.
- Ensure that the procurement data includes:
  - `title`: A brief description of the procurement.
  - `items`: An array of items, where each item has:
    - `itemName`: The name of the item.
    - `quantity`: The quantity of the item.
- Ensure proper error handling and logging for the API requests.
- Return a summary of the created procurements or any errors encountered during the process.

### 4. Add Filtering Endpoints for Procurements

Enhance the procurement service by adding two new endpoints to filter procurements.

- **Endpoint 1**: Filter procurements by quantity.

  - **Path**: `/api/procurements/filter-by-quantity`
  - **Method**: `GET`
  - **Query Parameter**: `minQuantity` (the minimum quantity to filter procurements)
  - **Response**: Return all procurements where the quantity of items is greater than the specified `minQuantity`.

- **Endpoint 2**: Filter procurements by status.
  - **Path**: `/api/procurements/filter-by-status`
  - **Method**: `GET`
  - **Query Parameter**: `status` (the status to filter procurements)
  - **Response**: Return all procurements that match the specified status.

Ensure that both endpoints handle errors appropriately and return meaningful messages if no procurements are found.

### Bonus Task: Add Filtering Endpoint for Orders

Enhance the procurement service by adding an endpoint to filter procurements based on a specific ISO certification and the vendor rating, and show all vendors that have those procurements.

- **Endpoint**: Filter procurements by ISO certification and vendor rating.
  - **Path**: `/api/procurements/filter-by-certification-and-rating`
  - **Method**: `GET`
  - **Query Parameters**:
    - `isoCertification`: The specific ISO certification to filter procurements.
    - `minVendorRating`: The minimum vendor rating to filter procurements.
  - **Response**: Return all procurements that match the specified ISO certification and include the associated vendors for each procurement that meet the minimum vendor rating.

Ensure that the endpoint handles errors appropriately and returns meaningful messages if no procurements or vendors are found.

## Submission

Once you have completed the tasks, please follow these steps:

1. **Fork the Repository**: Fork the original home assignment repository on GitHub to your own account.

2. **Make Your Changes**: Implement the required features and any additional improvements you wish to add.

3. **Test Your Application**: Ensure that your application runs correctly by executing the following command in the root of your project:

   ```bash
   docker-compose up --build
   ```

   Make sure that all services are running without errors and that you can access the application at `http://localhost:3002`.

4. **Push Your Changes**: Once you are satisfied with your implementation, push your changes to your forked repository.

5. **Provide a Link**: Send a link to your GitHub repository when it is ready for review.

---

Good luck, and happy coding!
