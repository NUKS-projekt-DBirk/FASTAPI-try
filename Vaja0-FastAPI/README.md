README Documentation for TODO Backend
=====================================
This is the backend code for a TODO application. It is written in Python, using the FastAPI web framework, and uses an SQLite database to store the tasks.

Installation
============
Clone the repository or download the source code
Navigate to the root directory of the project
Create a virtual environment: python -m venv env
Activate the virtual environment: source env/bin/activate (on Unix-based systems) or env\Scripts\activate (on Windows)
pyenv local 3.11.2
Install the required packages: pip install -r requirements.txt

Usage
============
Navigate to the root directory of the project
Activate the virtual environment: source env/bin/activate (on Unix-based systems) or env\Scripts\activate (on Windows)
To deactivate enter deactivate
Run the server: uvicorn main:app --reload --host 0.0.0.0
Access the API endpoints using an HTTP client like curl, Postman or a web browser

API endpoints for the TODO app:
================================
- GET /: Default API call
- GET /get/{id}: Get a TODO item by ID
- GET /list: Get the list of non-deleted TODO items
- POST /add: Create a new TODO item
- DELETE /delete/{id}: Delete a TODO item by ID
- PUT /change/{id}: Update the task of a TODO item by ID
- GET /list-deleted: Get the list of deleted TODO items
- POST /send-email: Send an email with the list of TODO items