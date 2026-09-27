import os

d = 'frontend/src/app'
for r, _, fs in os.walk(d):
    for f in fs:
        if f.endswith('.ts') or f.endswith('.html'):
            p = os.path.join(r, f)
            with open(p, 'r', encoding='utf-8') as file:
                c = file.read()
            if '€' in c or 'â‚¬' in c:
                c = c.replace('€', ' FCFA').replace('â‚¬', ' FCFA')
                with open(p, 'w', encoding='utf-8') as file:
                    file.write(c)
                print(f"Replaced in {p}")
