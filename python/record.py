def record_user(name,scan, hashed):
    with open("record.txt","a") as f:
        f.write(f"Name: {name} | ID: {scan} | Hased: {hashed}\n")