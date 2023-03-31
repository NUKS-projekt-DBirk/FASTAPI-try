##
import shemas
from database import Base, ToDO, engine
from fastapi import FastAPI, HTTPException, status, Response
from fastapi_versioning import VersionedFastAPI, version
from sqlalchemy.orm import Session, sessionmaker

##
import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(engine)
app = FastAPI()  #app instance


#origins = ["*"]
origins = ["http://localhost", "http://localhost:3000", "http://localhost:3000",  "http://localhost:8000", "localhost:3000"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#___________________________________________________________
@app.get("/")
def read_root():
    """
    Default API call
    """
    return "TODO app"
#_______________________________________________________

@app.get("/list")
@version(2)
@app.get("/list")
def read_todo_list(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"  #dodano za CORS
    session = Session(bind=engine, expire_on_commit=False)
    tododb_list = session.query(ToDO).filter_by(is_deleted=False).all()
    session.close()
    return [{"id": todo.id, "task": todo.task} for todo in tododb_list]
#_______________________________________________________

@app.options("/add")
@version(2)
def add_todo_options(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"  # allow all origins
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"

@app.post("/add", status_code=status.HTTP_201_CREATED)
@version(2)
def create_todo(todo: shemas.ToDoTask, response: Response): 
    response.headers["Access-Control-Allow-Origin"] = "*"  # allow all origins

    session = Session(bind = engine, expire_on_commit=False)
    tododb = ToDO(task= todo.task, is_deleted=False) 
    
    session.add(tododb)
    session.commit()
    id = tododb.id
    session.close()

    return f"Created new todo with id: {id}"
#_______________________________________________________

@app.options("/delete/{id}")
@version(2)
def delete_todo_options(id: int, response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    
@app.delete("/delete/{id}")
@version(2)
def delete_todo(id: int, response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"  # allow all origins

    session = Session(bind=engine, expire_on_commit=False)
    tododb = session.query(ToDO).filter_by(id=id, is_deleted=False).first()
    
    if not tododb:
        raise HTTPException(status_code=404, detail=f"Todo with id {id} not found")
    
    tododb.is_deleted = True
    session.commit()
    session.close()
    
    return f"Deleted todo item with id {id}"
#_______________________________________________________

@app.options("/change/{id}")
@version(2)
def change_todo_options(id: int, response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "PUT, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"


@app.put("/change/{id}")
@version(2)
def change_todo(id: int, new_task: str, response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"  # allow all origins

    session = Session(bind=engine, expire_on_commit=False)
    tododb = session.query(ToDO).filter_by(id=id, is_deleted=False).first()

    if not tododb:
        raise HTTPException(status_code=404, detail=f"Todo with id {id} not found")

    tododb.task = new_task
    session.commit()
    session.close()

    return f"Changed task of todo item with id {id} to '{new_task}'"
#_______________________________________________________

@app.options("/list-deleted")
@version(2)
def read_deleted_todo_list_options(id: int, response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"


@app.get("/list-deleted")
@version(2)
def read_deleted_todo_list(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"  # allow all origins
    session = Session(bind=engine, expire_on_commit=False)
    tododb_list = session.query(ToDO).filter_by(is_deleted=True).all()
    session.close() 
    
    return [{"id": todo.id, "task": todo.task} for todo in tododb_list]
#_______________________________________________________

###############################################################################################################


#_______________________________________________________

@app.get("/get/{id}")
@version(1)
def read_todo(id: int):
    return "read TODO"

############################## v2 Get APIja##
@app.get("/get/{id}")
@version(2)
def read_todo(id: int):
    session = Session(bind=engine, expire_on_commit=False)
    tododb = session.query(ToDO).filter_by(id=id, is_deleted=False).first()
    session.close()
    
    if not tododb:
        raise HTTPException(status_code=404, detail=f"Todo with id {id} not found")
    
    return tododb.task



#_______________________________________________________

###########################################################

load_dotenv()  

@app.options("/send-email")
@version(2)
def send_email_options(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"  # allow all origins
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"

@app.post("/send-email")
@version(2)
def send_email(to_email: str, response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"  # allow all origins

    session = Session(bind=engine, expire_on_commit=False)
    tododb_list = session.query(ToDO).filter_by(is_deleted=False).all()
    session.close()
    todos = [{"id": todo.id, "task": todo.task} for todo in tododb_list]
    todos_text = "\n".join([f"{todo['id']}: {todo['task']}" for todo in todos])
    
    msg = EmailMessage()
    msg.set_content(todos_text)
    msg['Subject'] = 'TODO List'
    msg['From'] = os.getenv("EMAIL_USERNAME") # replace with the email address you want to send from
    msg['To'] = to_email
    
    try:
        with smtplib.SMTP('smtp.office365.com', 587) as smtp:  # replace with your email provider's SMTP settings
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
            smtp.login(os.getenv("EMAIL_USERNAME"), os.getenv("EMAIL_PASSWORD"))  # replace with your email address and password
            smtp.send_message(msg)
            return f"TODO list sent to {to_email}"
    except Exception as e:
        print(e.message)
        return "Failed to send email" 
    
############################################################
app = VersionedFastAPI(app, version_format="{major}", prefix_format="/v{major}")