import os
import shutil

old_root = "configs"
new_root = "final_configs"

os.makedirs(new_root, exist_ok=True)

protocols = ["vmess", "vless", "ss", "trojan"]

for proto in protocols:
    proto_path = os.path.join(old_root, proto)
    if not os.path.isdir(proto_path):
        continue

    for country in os.listdir(proto_path):
        old_file = os.path.join(proto_path, country, "configs.txt")
        if os.path.isfile(old_file):
            new_country_path = os.path.join(new_root, country)
            os.makedirs(new_country_path, exist_ok=True)
            new_file = os.path.join(new_country_path, f"{proto}.txt")
            shutil.copyfile(old_file, new_file)

print("✅ ساختار جدید ساخته شد در: final_configs/")
