"""Compile the accepted WRITER manuscripts to the words used by the shift kernel."""
import json
import re
from pathlib import Path

app = Path(__file__).resolve().parents[2]
source = app.parents[1] / 'docs/loopforge'
table = (source / 'DAYS_2_4_TABLE_READ.md').read_text()
bank = (source / 'ROOM_CHAT_BANK.md').read_text()
voices = 'LIMEN STILETTO PRODUCER bob sam ed gus jo max kit mae ben lou'.split()

def exchanges(manuscript):
    result = {}
    key = None
    for line in manuscript.splitlines():
        heading = re.match(r'^(?:### |\*\*)([A-Z]\d{1,2}|[234][A-Z]) · ', line)
        if heading:
            key = heading[1]
            result[key] = []
        elif line.startswith('#'):
            key = None
        else:
            spoken = re.match(r'^\*\*(\w+)\*\*\s+(.+)$', line)
            if key and spoken and spoken[1] in voices:
                words = re.sub(r'^\*\(.+?\)\*\s*', '', spoken[2])
                result[key].append([spoken[1], words])
    return result

rows = re.findall(r'^\| (\w+) \| (\w+) \| (.+?) \|$', table, re.M)
rows = [r for r in rows if r[0] in voices]
data = dict(scenes=exchanges(table), chats=exchanges(bank), crowd=rows[:10], welcome=rows[10:26], helpers=rows[26:])
assert len(data['chats']) == 60 and len(data['scenes']) == 81 and len(rows) == 40
(app / 'lib/loopforge/shifts/manuscript.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
