import json
import os

toc_path = os.path.join('kaflar-json', 'book-toc.json')
with open(toc_path, encoding='utf-8') as f:
    toc = json.load(f)

index = []
for ch in toc['chapters']:
    path = os.path.join('kaflar-json', ch['id'] + '.json')
    if not os.path.exists(path):
        print('Vantar:', path)
        continue
    with open(path, encoding='utf-8') as f:
        data = json.load(f)
    full_text = ' '.join(data.get('text', []))
    for c in data.get('concepts', []):
        full_text += ' ' + c.get('term', '') + ' ' + c.get('explanation', '')
    index.append({
        'id': ch['id'],
        'part': ch['part'],
        'title': ch['title'],
        'text': full_text
    })

with open('search-index.json', 'w', encoding='utf-8') as f:
    json.dump(index, f, ensure_ascii=False, indent=2)

print('Lokið!', len(index), 'kaflar skrifaðir í search-index.json')