from optparse import Option
from tokenize import Double
from typing import Optional, List
from uuid import UUID, uuid4
from pydantic import BaseModel
from enum import Enum

class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"

class Role(str, Enum):
    admin="admin"
    user="user"
    tutor="tutor"

class User (BaseModel):
    id: Optional[UUID] = uuid4()
    first_name: str
    last_name: str
    gender: Optional[str]
    roles: List[Role]
    subject: Optional[str]
    question: Optional[str]

class Tutor (BaseModel):
    id: Optional[UUID] = uuid4()
    first_name: str
    last_name: str
    gender: Optional[str]
    roles: List[Role]
    subject: str
    rate: int