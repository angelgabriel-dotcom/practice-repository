import time
from scanner import scan_id

def greet(name, age): 
    if age >= 18:
        print("An adult\n")
    else:
        print("A minor\n")
    print(f"Okay {name} You Said You Are {age} Years Old 🤣🤣 Funny Your Face Looks Young")
    print("Okay let's move on\n")
    
    answer = input("do you have your Id with you: (Yes/No)  ").lower()
    while True:
        if answer == "yes":
            print("Okay present your ID please\n")
            break
        elif answer == "no":
            print("Sorry, you cannot procced without an ID")
            return

    while True:
        scan = input("Your ID in here:  ")
        scann = input(f"this is your ID Right? {scan}  ").lower()
        

        if scann == "yes":
            print("verified✅\n")
            break
        elif scann == "no":
            print("Okay retype you ID agin but be very careful this time")
            continue

    test = print("okay, wait a little please while i scan your ID\n")
    scan_id(scan)
name = input("Input Your Name:  ")
if name == "":
    print("fill in something please")
    exit()
print(f"hello {name}!\n")
age = int(input(f"How Old Are You: {name}  "))
greet(name, age)