from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from pytz import timezone

local_tz = timezone('Europe/Belgrade')

engine = create_engine("sqlite:///tododatabase.db") #to je nasa "db" na disku
Base = declarative_base()

class ToDO(Base):   #dva columna
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True)
    task = Column(String(50))

    ####
    is_deleted = Column(Boolean, default=False)
    ###############
    created_at = Column(DateTime, default=datetime.now(local_tz))