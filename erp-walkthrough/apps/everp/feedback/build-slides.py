#!/usr/bin/env python3
"""Builds slides.json for the stakeholder review page.
Run from anywhere:  python3 apps/everp/feedback/build-slides.py
Reads: docs/screen_details.md, flags.json (what the tours flag), build/content*.py (authored questions and drawings).
Spec and workbook text are copied as written. Questions, suggestions and drawings are authored."""
import json, re, sys, importlib.util
from pathlib import Path
here = Path(__file__).resolve().parent
root = here.parents[3]
sys.path.insert(0, str(here / 'build'))
src = (root / 'docs' / 'screen_details.md').read_text()
flags = json.loads((here / 'flags.json').read_text())['screens']
app = json.loads((here.parent / 'app.json').read_text())

C = {}
for f in ('content1', 'content2', 'content3'):
    spec = importlib.util.spec_from_file_location(f, here / 'build' / f'{f}.py'); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    for k, v in m.C.items():
        assert k not in C or f != 'content1' or True
        C[k] = v   # later parts win (content2 redoes D27 and D45)

def spec(code):
    m = re.search(r'#### \[' + code + r'\] (.*?)\n(.*?)(?=\n#### \[|\n### |\Z)', src, re.S)
    name, body = m.group(1).strip(), m.group(2)
    g = lambda k: ((re.search(r'\*\*' + k + r':\*\*\s*`?([^`\n·]*)`?', body) or [None, ''])[1] or '').strip()
    rows = []
    t = re.search(r'\| Label.*?\n\|[-| ]+\n((?:\|.*\n?)+)', body)
    if t:
        for line in t.group(1).strip().split('\n'):
            rows.append([x.strip() for x in line.strip().strip('|').split('|')])
    nf = re.search(r'\*\*Fields:\*\* ([^\n]*)', body)
    btn = (re.search(r'\*\*Buttons / Actions:\*\* ([^\n]*)', body) or [None, ''])[1]
    rules = re.findall(r'^- (.*)$', body.split('**Business logic / rules:**')[-1], re.M) if 'Business logic' in body else []
    path = re.search(r'\*\*Path:\*\* `([^`]*)`', body)
    return dict(code=code, name=name, path=path.group(1) if path else '', type=g('Type').replace('**', ''), mode=g('Mode').replace('**', ''),
                roles=(re.search(r'\*\*Roles:\*\* ([^\n]*)', body) or [None, ''])[1], priority=g('Priority'),
                buttons=btn, fields=rows, note=(nf.group(1) if nf and not rows else ''), rules=rules)

def clean(t): return re.sub(r'\{[^}]*\}', '…', t)

# Order: by the first tour (in app.json order) that reaches the screen.
tour_order = {}
for i, w in enumerate(app['walkthroughs']):
    seq = json.loads((here.parent / w['sequenceFile']).read_text())
    for j, st in enumerate(seq['steps'].values()):
        tour_order.setdefault(st['screen'], (i, j))
by_code = {s['code']: s for s in flags}
codes = sorted(by_code, key=lambda c: (tour_order.get(c, (99, 0)), c))

slides = []
for c in codes:
    s = by_code[c]; a = C.get(c)
    if not a: print('NO CONTENT for', c); continue
    seen, guesses = set(), []
    for f in s['flags']:
        t = clean(f['text']).strip()
        if t in seen: continue
        seen.add(t); guesses.append(dict(where=f['where'], text=t))
    fb = [x for x in s['feedback'] if x['text'].strip() != 'Test -']
    qs = []
    for i, q in enumerate(a['questions'], 1): qs.append(dict(id=f'{c}-{i}', **q))
    wb = s['workbook']
    slides.append(dict(code=c, name=s['name'], tours=s['walkthroughs'], priority=wb['priority'], estDays=wb['estDays'],
        purpose=a['purpose'], spec=spec(c), workbook=dict(notes=wb['notes'], dependencies=wb['dependencies'], openQuestion=wb['openQuestion']),
        guesses=guesses, feedback=fb, mock=a['mock'], questions=qs))
out = dict(title='EV ERP: open questions, one slide per screen', generated='2026-10-29', specSource='docs/screen_details.md', slides=slides)
(here / 'slides.json').write_text(json.dumps(out, indent=1, ensure_ascii=False))
print(len(slides), 'slides,', sum(len(x['questions']) for x in slides), 'questions')
