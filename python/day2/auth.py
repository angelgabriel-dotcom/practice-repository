green  = "\033[1;4;32m"
red    = "\033[1;4;31m"
yellow = "\033[1;4;33m"
reset  = "\033[0m"
def user_details():
    print(f"{green}Note: this is an authentication process so we would need your name and your password{reset}\n")
    username = input(f"{green}Input Your Username Here:{reset}  ")
    while True:
     password = input(f"{green}Input Password Here:{reset}  ")
     if password.isalnum():
        with open("password_logins.txt", "a") as f:
            f.write(f"password:{password} | username:{username}\n")
        break
     else:
        print(f"{red}Password can only contain letters and numbers!{reset}")
        continue  

user_details()