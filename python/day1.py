import time
from scanner import scan_id
from qr_scanner import generate_qr

green = "\033[32m"
bright_green =  "\033[102m"
pink = "\033[36m"
red = "\033[31m"
yellow = "\033[33m"
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
        scan = input(f"{green}Your ID in here:{reset}  ")
        scann = input(f"{green}this is your ID Right?{reset} {scan}  ").lower()
        

        if scann == "yes":
            print(f"{yellow}verified✅{reset}\n")
            break
        elif scann == "no":
            print(f"{pink}Okay retype you ID agin but be very careful this time{reset}")
            continue

    test = print(f"{pink}okay, wait a little please while i scan your ID{reset}\n")
    scan_id(scan)
    generate_qr(scan)
name = input(f"{green}Input Your Name:{reset}  ")
if name == "":
    print(f"{red}fill in something please{reset}")
    exit()
print(f"{yellow}hello{reset} {name}!\n")
age = int(input(f"{green}How Old Are You:{reset} {name}  "))
greet(name, age)