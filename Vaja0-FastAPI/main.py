from fastapi import FastAPI

import shemas
from sqlalchemy.orm import Session

from database import Base, engine, ToDO

Base.metadata.create_all(engine)

app = FastAPI()

@app.get("/")
def read_root():
    """
    Default API call
    """
    return "TODO app"

@app.post("/add")
def create_todo(todo: shemas.ToDoTask):
    session = Session(bind = engine, expire_on_commit=False)
    tododb = ToDO(task= todo.task)
    
    session.add(tododb)
    session.commit()
    id = tododb.id
    session.close()

    return f"Created new todo with id: {id}"


@app.get("/get/{id}")
def read_todo(id: int):
    return "Read todo item with id {id}"


@app.put("/change/{id}")
def change_todo(id: int):
    return "Change todo item with id {id}"

@app.delete("/delete/{id}")
def delete_todo(id: int):
    return "Delete todo item with id {id}"

@app.get("list")
def read_todo_list(id: int):
    return "All todos"


