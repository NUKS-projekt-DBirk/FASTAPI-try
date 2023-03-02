from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String

engine = create_engine("sqlite:///tododatabase.db")
Base = declarative_base()

class ToDO(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True)
    task = Column(String(50))