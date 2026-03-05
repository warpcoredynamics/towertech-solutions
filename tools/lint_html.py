from html.parser import HTMLParser
from pathlib import Path
import sys

class Checker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.errors = []
        self.has_title = False
        self.has_h1 = False

    def handle_starttag(self, tag, attrs):
        attr = dict(attrs)
        if tag == "img" and "alt" not in attr:
            self.errors.append("<img> missing alt attribute")
        if tag == "title":
            self.has_title = True
        if tag == "h1":
            self.has_h1 = True

content = Path(sys.argv[1]).read_text()
checker = Checker()
checker.feed(content)

if "<title>" not in content:
    checker.errors.append("Missing <title>")
if "<h1" not in content:
    checker.errors.append("Missing <h1>")

if checker.errors:
    print("HTML lint errors:")
    for err in checker.errors:
        print(f"- {err}")
    raise SystemExit(1)

print("HTML lint passed")
