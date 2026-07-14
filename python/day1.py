import time
from scanner import scan_id
from qr_scanner import generate_qr
from qr_scanner import hash_Id
from record import record_user

green = "\033[1;4;32m"
bright_green =  "\033[1;4;102m"
pink = "\033[1;4;36m"
red = "\033[1;4;31m"
yellow = "\033[1;4;33m"
reset = "\033[0m"

def greet(name, age): 
    if age >= 18:
        print(f"{yellow}An adult{reset}\n")
    else:
        print(f"{yellow}A minor{reset}\n")
    print(f"{yellow}Okay let's move on{reset}\n")
    
    answer = input(f"{green}do you have your Id with you: (Yes/No){reset}  ").lower()
    while True:
        if answer == "yes":
            print(f"{yellow}Okay present your ID please{reset}\n")
            break
        elif answer == "no":
            print(f"{red}Sorry, you cannot procced without an ID{reset}")
            return

    while True:
        scan = input(f"{green}Provide Your ID in here:{reset}  ")
        if scan == "":
           print(f"{red}becareful please ID is empty fill in something{reset}")
           continue

        scann = input(f"{green}this is your ID Right?{reset} {scan}  ").lower()
        if scann == "yes":
            print(f"{yellow}verified✅{reset}\n")
            break
        elif scann == "no":
            print(f"{pink}Okay retype you ID agin but be very careful this time{reset}")
            continue

    test = print(f"{pink}okay, wait a little please while i scan your ID{reset}\n")
    scan_id(scan)
    hashed = hash_Id(scan)
    print(f"{green}hased{reset}{hashed}")
    generate_qr(scan)
    record_user(name,scan,hashed)
while True:
    name = input(f"{green}Input Your Name:{reset}  ")
    if name == "":
     print(f"{red}it can't be empty fill in something!{reset}")
     continue
    print(f"{yellow}hello{reset} {name}!\n")
    age = int(input(f"{green}How Old Are You:{reset} {name}  "))
    greet(name, age)
    note = input(f"{green}is they any other user for this program?{reset}  ").lower()
    if note == "yes":
       continue
    elif note == "no":
       print(f"{pink}okay Good Day😜{reset}")
       exit()