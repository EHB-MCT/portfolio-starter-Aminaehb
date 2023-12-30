# Fitness Form API

## Purpose
The Fitness Form API is written in JavaScript (Nodejs) and serves as a platform for college students to input their personal information and track their fitness during their college journey.

## Quick Start
To get started with the project, follow these steps:

1. **Copy the .env Template:**
   - Before running the project, copy the `.env.template` file and rename it to `.env`. Fill in the required configuration details in the `.env` file.

2. **Build and Run with Docker Compose:**
   - Run the following command to build and start the project using Docker Compose:
     ```
     docker-compose up --build
     ```

3. **Access the API:**
   - Once the Docker containers are up and running, you can access the API at [http://localhost:8080/]

## Development
The project is currently in development, and improvements and features are actively being added. Contributions and feedback are welcome.

## API Endpoints and Actions

### Students

| Endpoint                       | Description                                                    |
|---------------------------------|----------------------------------------------------------------|
| **GET /api/students**           | Get all students.                                              |
| **GET /api/students/:id**       | Get student information by ID.                                 |
| **POST /api/students**          | Create a new student. (Parameters: first_name - string, last_name - string, age - number, email - string) |
| **PUT /api/fitness_info/:id**   | Update fitness information by ID.                              |
| **DELETE /api/students/:id**    | Delete a student by ID.                                        |

### Fitness Information

| Endpoint                        | Description                                                                                          |
|----------------------------------|------------------------------------------------------------------------------------------------------|
| **GET /api/fitness_info**        | Get all fitness information.                                                                        |
| **POST /api/fitness_info**       | Create new fitness information. (Parameters: student_id - number, physical_activity - string, exercise_duration - string, anxiety_control - string, sleep_duration - string, quality_of_sleep - string) |
| **PUT /api/fitness_info/:id**    | Update fitness information by ID.                                                                   |
| **DELETE /api/fitness_info/:id** | Delete fitness information by ID.                                                                   |

## Testing
Testing is performed in the `feat/testing` branch. Please note that testing is not implemented in the development branch due to an error. 

## Questions and Support
If you have any questions, issues, or need support, please open a ticket in the [issue tracker].

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
