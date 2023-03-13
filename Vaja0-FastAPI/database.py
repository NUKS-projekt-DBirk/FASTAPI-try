from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String

engine = create_engine("sqlite:///tododatabase.db") #to je nasa "db" na disku
Base = declarative_base()

class ToDO(Base):   #dva columna
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True)
    task = Column(String(50))


#al rajs tko da ti shran sliko v todo ze?
