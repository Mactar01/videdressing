import os

# Fix 1: ListingSeeder status for the items I manually added
p1 = 'backend/database/seeders/ListingSeeder.php'
with open(p1, 'r', encoding='utf-8') as f:
    c1 = f.read()
# Find my custom items and add 'status' => 'active'
c1 = c1.replace("'category_id' => ", "'status' => 'active',\n                'category_id' => ")
with open(p1, 'w', encoding='utf-8') as f:
    f.write(c1)

# Fix 2: Desktop Accueil button in app.html
p2 = 'frontend/src/app/app.html'
with open(p2, 'r', encoding='utf-8') as f:
    c2 = f.read()

# Find the Vends tes articles button and insert an Accueil button before it
btn = """        <button routerLink="/dashboard/create" class="px-5 py-2.5 bg-gradient-to-r from-watermelon-pink to-watermelon-light text-white text-sm font-semibold rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all">"""
new_btn = """        <a routerLink="/" class="text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-watermelon-pink transition-colors cursor-pointer mr-2">Accueil</a>\n""" + btn
c2 = c2.replace(btn, new_btn)

with open(p2, 'w', encoding='utf-8') as f:
    f.write(c2)
