from fastapi import FastAPI
from typing import List
from uuid import UUID, uuid4
from models import User, Gender, Role

app = FastAPI()

db: list[User] = [
    User(
        id=UUID("664a3d14-7809-42dc-82d4-e4657836773e"),
        first_name="Lionel",
        last_name="Messi",
        gender=Gender.male,
        roles=[Role.student]
    ),
    User(
        id=UUID("0ec402c5-d991-45fe-81f0-9ee7b8fe6a66"),
        first_name="Cristiano",
        last_name="Ronaldo",
        gender=Gender.male,
        roles=[Role.admin, Role.user]
    )
]

@app.get("/")
async def root():
    return {"Hello" : "Mundo"}

@app.get("/api/v1/users")
async def fetch_users():
    return db

@app.post("/api/v1/users")
async def register_user(user: User):
    db.append(user)
    return {"id": user.id}