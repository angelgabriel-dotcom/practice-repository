from fastapi import FastAPI
from pydantic import BaseModel
import yt_dlp
from fastapi.middleware.cors import CORSMiddleware
import httpx
from send_verifications import send_verification


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
    # validate password
    if not user.password.isalnum():
        return {"message": "Password can only contain letters and numbers"}
    
    code = send_verification(user.email)
    return {"message": "verification_sent", "code": str(code), "email": user.email}

@app.post("/save_user")
def save_user(user: User):
    with open("password_logins.txt", "a") as f:
        f.write(f"username:{user.email} | password:{user.password}\n")
    return {"message": "User saved"}

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
@app.get("/songs")
async def get_songs(artist: str):
    ydl_opts = {
        'quiet': True,
        'extract_flat': True,
        'js_runtimes': {'deno': {'path': '/home/student/.deno/bin/deno'}},
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(f"ytsearch10:{artist}", download=False)
        songs = [{'title': e['title'], 'duration': e.get('duration', 0)} for e in info['entries']]
    return {"songs": songs}

@app.get("/artist-search")
async def artist_search(name: str):
    api_key = "6655f51f5f278165d40174692082dec2"  # replace with your key
    async with httpx.AsyncClient() as client:
        res = await client.get(f"https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist={name}&api_key={api_key}&format=json")
        data = res.json()
    
        artist = data.get("artist", {})
        image_url = ""
        images = artist.get("image", [])
    for img in images:
        url = img.get("#text", "")
    if url and img.get("size") in ["mega", "extralarge", "large"]:
        image_url = url
    
    return {
        "name": artist.get("name", name),
        "image": image_url,
        "bio": artist.get("bio", {}).get("summary", ""),
        "listeners": artist.get("stats", {}).get("listeners", "")
    }