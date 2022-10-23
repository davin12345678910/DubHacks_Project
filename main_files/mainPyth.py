from http.client import HTTPException
from fastapi import FastAPI
from typing import List
from uuid import UUID, uuid4
from models import User, Gender, Role, Tutor

app = FastAPI()

db_user: list[User] = [
    User(
        id=UUID("664a3d14-7809-42dc-82d4-e4657836773e"),
        first_name="Lionel",
        last_name="Messi",
        gender=Gender.male,
        roles=[Role.user]
    ),
    User(
        id=UUID("0ec402c5-d991-45fe-81f0-9ee7b8fe6a66"),
        first_name="Cristiano",
        last_name="Ronaldo",
        gender=Gender.male,
        roles=[Role.user]
    )
]

db_tutor: list[Tutor] = [
    Tutor(
        first_name="Luis",
        last_name="Enrique",
        gender="male",
        roles=[Role.tutor],
        subject="math",
        rate="5"
    ),
    Tutor(
        first_name="Pep",
        last_name="Guardiola",
        gender="male",
        roles=[Role.tutor],
        subject="physics",
        rate="8"
    )
]

@app.get("/")
async def root():
    return {"Hello" : "World"}

@app.get("/api/v1/users")
async def fetch_users():
    return db_user

@app.post("/api/v1/users")
async def register_user(user: User):
    db_user.append(user)
    return {"id": user.id}

@app.delete("/apo/v1/users/{user_id}")
async def delete_user(user_id: UUID) :
    for user in db_user:
        if user.id == user_id:
            db_user.remove(user)
            return


@app.get("/api/v1/tutors")
async def fetch_tutors():
    return db_tutor

@app.get("/api/v1/tutors/{subject}")
async def fetch_tutors_subject(subject: str):
    result = []
    for tut in db_tutor:
        if tut.subject == subject:
            result.append(tut)
    return result

@app.post("/api/v1/tutors")
async def register_user(tutor: Tutor):
    db_tutor.append(tutor)
    return {"id": tutor.id}

@app.delete("/apo/v1/tutors/{tutor_id}")
async def delete_user(tutor_id: UUID) :
    for tut in db_tutor:
        if tut.id == tutor_id:
            db_user.remove(tut)
            return