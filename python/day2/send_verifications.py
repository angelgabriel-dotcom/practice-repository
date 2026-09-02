import smtplib
import random
import os
from email.mime.text import MIMEText

def send_verification(to_email: str):
    sender = os.environ.get("GMAIL_SENDER")
    app_password = os.environ.get("GMAIL_APP_PASSWORD")

    if not sender or not app_password:
        raise RuntimeError("GMAIL_SENDER or GMAIL_APP_PASSWORD environment variable not set")

    code = random.randint(100000, 999999)

    subject = "Your Verification Code"
    body = f"Your verification code is: {code}"

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = to_email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender, app_password)
        server.sendmail(sender, to_email, msg.as_string())

    return code