def r(f, a, b):
    with open(f, 'r', encoding='utf-8') as file: c = file.read()
    with open(f, 'w', encoding='utf-8') as file: file.write(c.replace(a, b))

r('src/app/features/dashboard/inbox.component.ts', '  }\n  }\n\n  sendMessage()', '  }\n\n  sendMessage()')
r('src/app/features/dashboard/inbox.component.ts', '  }\r\n  }\r\n\r\n  sendMessage()', '  }\r\n\r\n  sendMessage()')
r('src/app/features/dashboard/dashboard.component.ts', 'return \/storage/\\\\;', "return '/storage/' + item.images[0].path;")
r('src/app/app.routes.ts', '  }\n  { path: \'admin/dashboard\'', '  },\n  { path: \'admin/dashboard\'')
r('src/app/app.routes.ts', '  }\r\n  { path: \'admin/dashboard\'', '  },\r\n  { path: \'admin/dashboard\'')
r('src/app/core/services/listing.service.ts', 'return this.http.get(/api/v1/favorites);', "return this.http.get('/api/v1/favorites');")
r('src/app/core/services/listing.service.ts', 'return this.http.post(/api/v1/listings//favorite, {});', "return this.http.post('/api/v1/listings/'+str(listingId)+'/favorite', {});")
