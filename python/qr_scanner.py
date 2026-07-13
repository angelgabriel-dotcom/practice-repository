import qrcode

bright_green =  "\033[102m"
green = "\033[32m"
reset = "\033[0m"
def generate_qr(data):
    qr = qrcode.make(data)
    qr.save("id_card.png")
    print(f"{green}QR Code generated! ✅ Check id_card.png{reset}")