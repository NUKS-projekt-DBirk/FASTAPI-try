from fastapi import FastAPI, HTTPException

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
    session = Session(bind=engine, expire_on_commit=False)
    tododb = session.query(ToDO).filter_by(id=id).first()
    session.close()
    
    if not tododb:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    return tododb.task


@app.put("/change/{id}")
def change_todo(id: int, new_task: str):
    session = Session(bind=engine, expire_on_commit=False)
    tododb = session.query(ToDO).filter_by(id=id).first()
    
    if not tododb:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    tododb.task = new_task
    session.commit()
    session.close()
    
    return f"Changed task of todo item with id {id} to '{new_task}'"

@app.delete("/delete/{id}")
def delete_todo(id: int):
    session = Session(bind=engine, expire_on_commit=False)
    tododb = session.query(ToDO).filter_by(id=id).first()
    
    if not tododb:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    session.delete(tododb)
    session.commit()
    session.close()
    
    return f"Deleted todo item with id {id}"

@app.get("/list")
def read_todo_list():
    session = Session(bind=engine, expire_on_commit=False)
    tododb_list = session.query(ToDO).all()
    session.close()
    
    return [{"id": todo.id, "task": todo.task} for todo in tododb_list]


