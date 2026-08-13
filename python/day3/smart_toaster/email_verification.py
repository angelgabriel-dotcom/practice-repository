import os
import smtplib
from email.mime.text import MIMEText

class ToasterApp:
    def __init__(self, title: str, name: str, email: str):
        self.title = title
        self.name = name
        self.email = email

    def send_notification(self) -> None:
        sender_email = os.environ.get("")
        app_password = os.environ.get("")

        if not sender_email or not app_password:
            print("Error: Missing SENDER_EMAIL or SENDER_APP_PASSWORD environment variables.")
            return

        msg = MIMEText(f"Hello {self.title} {self.name},\n\nYour toast is ready!")
        msg["Subject"] = "Toaster Notification"
        msg["From"] = sender_email
        msg["To"] = self.email                

        try:
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(sender_email, app_password)
                server.send_message(msg)
            print("Email sent successfully!")
            
        except Exception as e:
            print(f"Failed to send email: {e}")