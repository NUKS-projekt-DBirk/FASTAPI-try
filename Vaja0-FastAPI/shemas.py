from pydantic import BaseModel

class ToDoTask(BaseModel):
    task: str 