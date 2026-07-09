#name1 = "angel finix"
#age = 22

#print(f"my name is {name1}")
#print(f"am {age} years old")

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
        input(f"this is your ID Right? {scan}  ").lower()

        if scan == "yes":
            print("okay")
            break
        elif scan == "no":
            print("Okay retype you ID agin but be very careful this time")

    test = input("okay let's continue")

name = input("Input Your Name:  ")
print(f"hello {name}!\n")
age = int(input(f"How Old Are You: {name}  "))
greet(name, age)