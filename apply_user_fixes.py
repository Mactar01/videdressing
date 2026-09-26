import os

# 1. CategorySeeder - change multiselect to select
p = 'backend/database/seeders/CategorySeeder.php'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("'type'        => 'multiselect',", "'type'        => 'select',")
c = c.replace("'type'    => 'multiselect',", "'type'    => 'select',")

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)

# 2. create-listing.component.ts - redirect to home page
p2 = 'frontend/src/app/features/dashboard/create-listing.component.ts'
with open(p2, 'r', encoding='utf-8') as f:
    c2 = f.read()

c2 = c2.replace("this.router.navigate(['/listing', finalId]);", "this.router.navigate(['/']);")
with open(p2, 'w', encoding='utf-8') as f:
    f.write(c2)

