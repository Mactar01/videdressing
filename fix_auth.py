import re

with open('backend/app/Http/Controllers/Api/V1/AuthController.php', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = r'''        \ = \->createToken\('auth_token'\)->plainTextToken;

        return \->sendResponse\(\[
            'user' => \,
            'token' => \
        \], 'User registered successfully', 201\);'''

new_code = '''        \\Illuminate\\Support\\Facades\\Auth::login();
        ->session()->regenerate();

        return ->sendResponse([
            'user' => 
        ], 'User registered successfully', 201);'''

content = re.sub(old_code, new_code, content)

with open('backend/app/Http/Controllers/Api/V1/AuthController.php', 'w', encoding='utf-8') as f:
    f.write(content)
