from fastapi import FastAPI
from pydantic import BaseModel
import yt_dlp
from fastapi.middleware.cors import CORSMiddleware
import httpx


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],

)

class User(BaseModel):
    email: str
    password: str

@app.get("/")
def home():
    return {"message": "Welcome to the Music Player API"}

@app.post("/register")
def register(user: User):
    with open("password_logins.txt", "a") as f:
        f.write(f"username:{user.email} | password:{user.password}\n")
    return {"message": f"User {user.email} registered successfully"}

@app.post("/login")
def login(user: User):
    with open("password_logins.txt", "r") as f:
        for line in f:
            if f"username:{user.email}" in line and f"password:{user.password}" in line:
                return {"message": "Login successful"}
    return {"message": "Invalid credentials"}

@app.get("/search")
def search(song: str):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f'{song}.%(ext)s',
        'quiet': True,
        'js_runtimes': {'deno': {'path': '/home/student/.deno/bin/deno'}},
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(f"ytsearch1:{song}", download=True)
        filename = ydl.prepare_filename(info['entries'][0])
    return {"message": f"Downloaded {song}", "filename": filename}
from fastapi.responses import FileResponse

@app.get("/stream")
def stream(song: str):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f'{song}.%(ext)s',
        'quiet': True,
        'js_runtimes': {'deno': {'path': '/home/student/.deno/bin/deno'}},
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(f"ytsearch1:{song}", download=True)
        filename = ydl.prepare_filename(info['entries'][0])
    
    return FileResponse(filename, media_type="audio/webm")

@app.get("/artists")
async def get_artists():
    async with httpx.AsyncClient() as client:
        res = await client.get("https://groupietrackers.herokuapp.com/api/artists")
        return res.json()