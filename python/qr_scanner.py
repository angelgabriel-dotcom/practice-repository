import qrcode
import hashlib

bright_green =  "\033[1;4;102m"
green = "\033[1;4;32m"
reset = "\033[0m"
def generate_qr(data):
    qr = qrcode.make(data)
    qr.save("id_card.png")
    print(f"{green}QR Code generated! ✅ Check id_card.png{reset}")


def hash_Id(scan):
      hashed = hashlib.sha256(scan.encode()).hexdigest()
      return hashed