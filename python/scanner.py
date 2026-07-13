import time

bright_green =  "\033[102m"
yellow = "\033[33m"
reset = "\033[0m"
def scan_id(scan):
    splitting = scan.split(";")
    print(f"{bright_green}Scanning....{reset}\n")
    bar = ""
    for i in range(15):
        bar += f"{yellow}:{reset}"
        print(f"\r[{bar:<15}]", end="", flush=True)
        time.sleep(0.1)
    print("✅\n")
    for part in splitting:
        print(part)