import os
import re

p = 'backend/database/seeders/ConversationSeeder.php'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the creation logic with firstOrCreate to avoid UniqueConstraintViolationException
old_code = """            $conversation = Conversation::create([
                'listing_id' => $listing->id,
                'buyer_id' => $buyer->id,
                'seller_id' => $listing->user_id,
            ]);"""

new_code = """            $conversation = Conversation::firstOrCreate(
                [
                    'listing_id' => $listing->id,
                    'buyer_id' => $buyer->id,
                ],
                [
                    'seller_id' => $listing->user_id,
                ]
            );"""

if old_code in c:
    c = c.replace(old_code, new_code)
else:
    print("Could not find exact block, using regex")
    c = re.sub(r'Conversation::create\(\[\s*\'listing_id\' => \$listing->id,\s*\'buyer_id\' => \$buyer->id,\s*\'seller_id\' => \$listing->user_id,\s*\]\);', new_code, c)

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
