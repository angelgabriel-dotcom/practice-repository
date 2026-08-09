from fastapi import FastAPI
from pydantic import BaseModel
import yt_dlp
from fastapi.middleware.cors import CORSMiddleware
import httpx
from send_verifications import send_verification
from bs4 import BeautifulSoup
import os
import syncedlyrics
import asyncio
from fastapi.responses import FileResponse
from fastapi.responses import StreamingResponse
from fastapi import Request
from fastapi.responses import StreamingResponse
import httpx
from passlib.context import CryptContext
import jwt
import os
from datetime import datetime, timedelta
from fastapi import Header, HTTPException



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],

)



pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret-change-this")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 24 * 7  # 1 week

def create_token(email: str):
    payload = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRE_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


class User(BaseModel):
    email: str
    password: str


verification_codes = {}

@app.post("/register")
def register(user: User):
    if not user.password.isalnum():
        return {"message": "Password can only contain letters and numbers"}

    code = send_verification(user.email)
    verification_codes[user.email] = {
        "code": str(code),
        "password": user.password,
        "expires": datetime.utcnow() + timedelta(minutes=10)
    }
    return {"message": "verification_sent", "email": user.email}


class VerifyRequest(BaseModel):
    email: str
    code: str

@app.post("/verify")
def verify(req: VerifyRequest):
    entry = verification_codes.get(req.email)
    if not entry:
        return {"message": "No pending verification for this email"}
    if datetime.utcnow() > entry["expires"]:
        del verification_codes[req.email]
        return {"message": "Code expired, please register again"}
    if req.code != entry["code"]:
        return {"message": "Wrong code"}

    hashed = pwd_context.hash(entry["password"])
    with open("password_logins.txt", "a") as f:
        f.write(f"username:{req.email}|password_hash:{hashed}\n")

    del verification_codes[req.email]
    return {"message": "Account created successfully"}
    
@app.post("/save_user")
def save_user(user: User):
    hashed = pwd_context.hash(user.password)
    with open("password_logins.txt", "a") as f:
        f.write(f"username:{user.email}|password_hash:{hashed}\n")
    return {"message": "User saved"}


@app.post("/login")
def login(user: User):
    with open("password_logins.txt", "r") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = dict(p.split(":", 1) for p in line.split("|"))
            if parts.get("username") == user.email:
                if pwd_context.verify(user.password, parts.get("password_hash", "")):
                    token = create_token(user.email)
                    return {"message": "Login successful", "token": token, "email": user.email}
                else:
                    return {"message": "Invalid credentials"}
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

@app.get("/stream")
async def stream(video_id: str, request: Request):
    ydl_opts = {
        'format': 'bestaudio/best',
        'quiet': True,
        'js_runtimes': {'deno': {'path': '/home/student/.deno/bin/deno'}},
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(f"https://www.youtube.com/watch?v={video_id}", download=False)
        audio_url = info['url']
        ext = info.get('ext', 'webm')

    media_type = "audio/webm" if ext == "webm" else f"audio/{ext}"
    range_header = request.headers.get("range")

    client = httpx.AsyncClient(timeout=httpx.Timeout(None))

    upstream_headers = {}
    if range_header:
        upstream_headers["Range"] = range_header

    upstream_req = client.build_request("GET", audio_url, headers=upstream_headers)
    upstream_resp = await client.send(upstream_req, stream=True)

    headers = {
        "Accept-Ranges": "bytes",
    }
    if "content-length" in upstream_resp.headers:
        headers["Content-Length"] = upstream_resp.headers["content-length"]
    if "content-range" in upstream_resp.headers:
        headers["Content-Range"] = upstream_resp.headers["content-range"]

    status_code = upstream_resp.status_code

    async def proxy():
        try:
            async for chunk in upstream_resp.aiter_bytes(chunk_size=65536):
                yield chunk
        finally:
            await upstream_resp.aclose()
            await client.aclose()

    return StreamingResponse(
        proxy(),
        status_code=status_code,
        media_type=media_type,
        headers=headers,
    )
@app.get("/artists")
async def get_artists():
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get("https://groupietrackers.herokuapp.com/api/artists")
            return res.json()
    except Exception:
        return []

@app.get("/songs")
async def get_songs(artist: str):
    ydl_opts = {
        'quiet': True,
        'extract_flat': True,
        'js_runtimes': {'deno': {'path': '/home/student/.deno/bin/deno'}},
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(f"ytsearch10:{artist}", download=False)
        songs = [
            {'title': e['title'], 'duration': e.get('duration', 0), 'id': e['id']}
            for e in info['entries']
        ]
    return {"songs": songs}

@app.get("/artist-search")
async def artist_search(name: str):
    async with httpx.AsyncClient() as client:
        res = await client.get(f"https://api.deezer.com/search/artist?q={name}")
        data = res.json()
    
    artists = data.get("data", [])
    if not artists:
        return {"name": name, "image": "", "bio": "", "fans": 0}
    
    artist = artists[0]
    return {
        "name": artist.get("name", name),
        "image": artist.get("picture_xl", ""),
        "fans": artist.get("nb_fan", 0),
    }

@app.get("/artist-search-live")
async def artist_search_live(name: str):
    if not name.strip():
        return []

    async with httpx.AsyncClient() as client:
        res = await client.get(f"https://api.deezer.com/search/artist?q={name}")
        data = res.json()

    artists = data.get("data", [])[:6]
    return [
        {
            "name": a.get("name", ""),
            "image": a.get("picture_medium", ""),
            "fans": a.get("nb_fan", 0),
        }
        for a in artists
    ]


GENIUS_TOKEN = os.environ.get("XISv1wv-jn8yot-VaetyHZEJAXsg7OKu1aUtP2NUxrtUFcaUrEqoUDIZIbf-djcR")

async def fetch_synced_lyrics(artist: str, title: str):
    def _search():
        return syncedlyrics.search(f"{artist} {title}")

    lrc = await asyncio.to_thread(_search)
    if lrc:
        plain_lines = [
            line.split("]", 1)[1].strip()
            for line in lrc.split("\n")
            if "]" in line
        ]
        plain = "\n".join(plain_lines).strip()
        return {"lyrics": plain, "synced": lrc}
    return None

async def fetch_genius_lyrics(artist: str, title: str):
    async with httpx.AsyncClient(timeout=8.0) as client:
        search_res = await client.get(
            "https://api.genius.com/search",
            params={"q": f"{artist} {title}"},
            headers={"Authorization": f"Bearer {GENIUS_TOKEN}"}
        )
        search_data = search_res.json()
        hits = search_data.get("response", {}).get("hits", [])
        if not hits:
            return None

        song_url = hits[0]["result"]["url"]

        page_res = await client.get(song_url)
        soup = BeautifulSoup(page_res.text, "html.parser")

        containers = soup.select("div[data-lyrics-container='true']")
        if not containers:
            return None

        lyrics_lines = []
        for container in containers:
            lyrics_lines.append(container.get_text(separator="\n"))

        lyrics = "\n".join(lyrics_lines).strip()
        return lyrics if lyrics else None

@app.get("/lyrics")
async def get_lyrics(artist: str, title: str):
    try:
        result = await fetch_synced_lyrics(artist, title)
        if result:
            return result
    except Exception as e:
        print(f"syncedlyrics failed: {e}")

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            res = await client.get(
                "https://lrclib.net/api/get",
                params={"artist_name": artist, "track_name": title}
            )
            if res.status_code == 200:
                data = res.json()
                plain = data.get("plainLyrics")
                if plain:
                    return {"lyrics": plain, "synced": data.get("syncedLyrics", "")}
    except Exception as e:
        print(f"lrclib failed: {e}")

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            res = await client.get(f"https://api.lyrics.ovh/v1/{artist}/{title}")
            data = res.json()
            if "lyrics" in data and data["lyrics"].strip():
                return {"lyrics": data["lyrics"], "synced": ""}
    except Exception as e:
        print(f"lyrics.ovh failed: {e}")

    try:
        genius_lyrics = await fetch_genius_lyrics(artist, title)
        if genius_lyrics:
            return {"lyrics": genius_lyrics, "synced": ""}
    except Exception as e:
        print(f"genius failed: {e}")

    return {"lyrics": None, "synced": "", "found": False}

def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")