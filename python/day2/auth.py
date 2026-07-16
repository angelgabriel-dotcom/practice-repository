from send_verifications import send_verification


green  = "\033[1;4;32m"
red    = "\033[1;4;31m"
yellow = "\033[1;4;33m"
pink   = "\033[1;4;36m"
reset  = "\033[0m"
def user_details():
    print(f"{green}Note: this is an authentication process so we would need your gmail and your password{reset}\n")
    while True:
     email = input(f"{green}Input Your gmail Here:{reset}  ").lower()
     if email == "":
       print(f"{yellow}Empty: Input Email{reset}")
       continue
     else:
        break
    while True:
     password = input(f"{green}Input Password Here:{reset}  ")
     if password.isalnum():
        with open("password_logins.txt", "a") as f:
            f.write(f"password:{password} | username:{email}\n")
        break
     else:
        print(f"{red}Password can only contain letters and numbers!{reset}")
        continue
     if __name__ == "__main__":
        user_details()

def login():
   print(f"{green}[Note: this is your login path for you to log in we will ask for your email and your password]{reset}\n")
   while True:
    email = input(f"{green}Your Email Here:{reset}  ").lower()
    password = input(f"{yellow}Input your password here:{reset}  ").lower()
    verify = input(f"{yellow}Verify:are you sure this is are your password and username you use for signing up? {password}  {email}{reset}  ")
    print(f"{pink}we sent you a verification code to this gmail {email} check your phone{reset}")
    code = send_verification(email)
    entered = input(f"{green}Enter the verification code sent to you here:  ")
    if str(code) == entered:
       print(f"{yellow}Email Verified✅\n")
    else:
       print(f"{red}wrong code ❌")
       continue
    if  verify == "yes":
       print(f"{yellow}verified✅{reset}")
       break
    elif verify == "no":
       print(f"{red}❌ okay retype username again{reset}")
       continue
   with open("password_logins.txt","r")as f:
      for line in f:
        if f"username:{email}" in line and f"password:{password}" in line:
            print(f"{yellow}Login successful ✅{reset}\n")
            break       
      else:
        print(f"{red}Invalid credentials ❌{reset}")
        if __name__ == "__main__":
         login()

