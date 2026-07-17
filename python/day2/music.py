from auth import user_details
from auth import login
import yt_dlp
from playsound import playsound

green  = "\033[1;4;32m"
yellow = "\033[1;4;33m"
reset  = "\033[0m"

def music_player():
   print(f"{green}you have so many options of songs here search for the song you want and it will be played for you{reset}")
   ask = input(f"{green} Here is your search bar: ")
   print(f"{yellow}searching for {ask}{reset}")
   
   ydl_opts = {
      'format': 'bestaudio/best',
      'outtmpl': f'{ask}.%(ext)s',
      'quiet': True,
      'js_runtimes': {'deno': {'path': '/home/student/.deno/bin/deno'}},
   }

   with yt_dlp.YoutubeDL(ydl_opts) as ydl:
      info = ydl.extract_info(f"ytsearch1:{ask}", download=True)
      filename = ydl.prepare_filename(info['entries'][0])

   print(f"{green}Download Complete! Now Playing...{reset}")
   playsound(filename)
   print(f"{green}Now playing: {ask} 🎵{reset}")

def music_menu():
   options = print(f"""{green}1, register
2, login{reset}\n""")
   choice = input(f"{green}pick an option:{reset}  ")
   if choice == "1":
      user_details()
   elif choice == "2":
      login()
      music_player()
music_menu()