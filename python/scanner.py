import time

def scan_id(scan):
    splitting = scan.split(";")
    print("Scanning", end="", flush=True)
    for i in range(5):
        time.sleep(0.3)
        print(".", end="", flush=True)
    print("\n")
    for part in splitting:
        time.sleep(0.3)
        print(part)