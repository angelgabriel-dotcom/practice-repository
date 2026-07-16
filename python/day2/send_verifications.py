import random
import smtplib


green  = "\033[1;4;32m"
reset  = "\033[0m"

def send_verification(email):
    code = random.randint(100000, 999999)
    sender = "jadeliam53@gmail.com"
    app_password = "vgll mqvj jswh rixn"

    message = f"subject: Verificaton Code\n\n Your Code is: {code}"

    with smtplib.SMTP_SSL("smtp.gmail.com", 465)as server:
        server.login(sender, app_password)
        server.sendmail(sender, email, message)
    print(f"{green}verification code sent to {email}!{reset}")
    return code