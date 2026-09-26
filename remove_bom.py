import os
import codecs

def remove_bom(path):
    with open(path, 'rb') as f:
        content = f.read()
    if content.startswith(codecs.BOM_UTF8):
        print(f"BOM found in {path}")
        with open(path, 'wb') as f:
            f.write(content[3:])
            
for root, _, files in os.walk('backend'):
    for file in files:
        if file.endswith('.php'):
            remove_bom(os.path.join(root, file))
