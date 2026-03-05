from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
base = (ROOT / 'src' / 'index.base.html').read_text()
partials = {
    'header': 'header.html',
    'hero': 'hero.html',
    'status': 'status.html',
    'intro': 'intro.html',
    'capabilities': 'capabilities.html',
    'proof': 'proof.html',
    'news': 'news.html',
    'footer': 'footer.html',
}

for key, file_name in partials.items():
    content = (ROOT / 'src' / 'partials' / file_name).read_text().rstrip()
    base = base.replace('{{' + key + '}}', content)

(ROOT / 'index.html').write_text(base + '\n')
print('Built index.html from partials')
