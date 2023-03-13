from pydantic import BaseModel

class ToDoTask(BaseModel):
    task: str 
#################################
#class ImageData(BaseModel):
#    data: str