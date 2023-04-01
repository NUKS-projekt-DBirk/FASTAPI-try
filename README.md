ToDo List App
This is a simple ToDo List App for personal use. The application is built using FastAPI for the backend, SQLite for the database, and React for the frontend.

Features
Add tasks to your ToDo list
Edit tasks
Mark tasks as completed
Delete tasks
Requirements
Python 3.8 or higher
Node.js 14 or higher
SQLite 3 or higher
Installation
Clone the repository: git clone https://github.com/yourusername/todo-list-app.git
Install the backend dependencies: cd todo-list-app/backend && pip install -r requirements.txt
Create the SQLite database: cd .. && touch todo.db
Start the backend server: cd backend && uvicorn main:app --reload
Install the frontend dependencies: cd ../frontend && npm install
Start the frontend server: npm start
Usage
Once you have the backend and frontend servers running, you can access the app by visiting http://localhost:3000 in your web browser.

Contributing
Contributions to this project are welcome! Please fork the repository and create a pull request with your changes.

License
This project is licensed under the MIT License. See the LICENSE file for details.