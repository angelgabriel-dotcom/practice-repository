import time
from email_verification import ToasterApp



class Toaster:
    def __init__(self):
        self.name = input("Please Input Your Name here  ").lower()
        while True:
         self.title = input("\ninput your title ```exampl: Mr/Mrs```  ").lower()

         if self.title == "mr" or self.title == "mrs":
            break
         else:
             print("failed to follow example (mr  or  mrs)")
         
        self.email = input(f"\n{self.title} {self.name} input your email address here for toaster notification  ")

        self.power = "off"
        self.heat_dial = 3
        self.lever = "up"
        self.bread_location = "counter"
        self.bread_temp = "cold"
        self.bread_colour = "white"
        self.plate_location = "counter"
        self.plate_contents = "empty"

    def insert_bread(self):
        self.bread_location = "toaster"

    def start_toster(self):
        self.power = "on"
        self.lever = "down"

    def wait_for_toast(self):
        time.sleep(5)

    def stop_toaster(self):
        self.power = "off"
        self.lever = "up"

    def eject_bread(self):
        self.bread_temp = "hot"
        self.bread_colour = "brown" 
        self.bread_location = "plate"
        self.plate_contents = "bread"

    def trigger_email_alert(self):
        emailer = ToasterApp(self.name, self.title,self.email)
        emailer.send_notification()

    def run(self):
        self.insert_bread()
        self.start_toster()
        self.wait_for_toast()
        self.stop_toaster()
        self.eject_bread()
        self.trigger_email_alert()
my_toaster = Toaster()
my_toaster.run()