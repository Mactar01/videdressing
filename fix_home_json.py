import os

p = 'frontend/src/app/features/home/home.component.ts'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

old_logic = """    this.listingService.getListings().subscribe(res => {
      const arr = Array.isArray(res) ? res : ((res as any).data && Array.isArray((res as any).data)) ? (res as any).data : [];
      this.listings = arr.slice(0, 8);
    });"""

new_logic = """    this.listingService.getListings().subscribe(res => {
      let arr = [];
      if (Array.isArray(res)) {
        arr = res;
      } else if (res && (res as any).data) {
        if (Array.isArray((res as any).data)) {
          arr = (res as any).data;
        } else if (Array.isArray((res as any).data.data)) {
          arr = (res as any).data.data;
        }
      }
      this.listings = arr.slice(0, 8);
    });"""

c = c.replace(old_logic, new_logic)

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
