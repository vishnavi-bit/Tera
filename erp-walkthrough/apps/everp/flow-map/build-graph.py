#!/usr/bin/env python3
"""Builds graph.json: which EVERP screen leads to which, from three kinds of evidence.
  tour : a walkthrough step on screen A leads (via an action) to a step on screen B
  mock : a button in the mock screen A has goto B
  spec : the spec text of screen A mentions screen B
Run: python3 apps/everp/flow-map/build-graph.py"""
import json, re, glob, os, collections
HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(HERE)
SPEC = os.path.join(APP, '../../../docs/screen_details.md')
CODE = re.compile(r'\b([DON]\d{2})\b')

# ---- screens from the spec
lines = open(SPEC, encoding='utf-8').read().split('\n')
app_side = section = None
screens = {}
cur = None
for ln in lines:
    if ln.startswith('## ') and 'Dealer App' in ln: app_side = 'Dealer'
    elif ln.startswith('## ') and 'OEM App' in ln: app_side = 'OEM'
    elif ln.startswith('### '): section = ln[4:].strip()
    m = re.match(r'#### \[([DON]\d{2})\]\s*(.*)', ln)
    if m:
        cur = m.group(1)
        screens[cur] = dict(code=cur, name=m.group(2).strip(), module=section, app=app_side, spec=[], inSpec=True)
        continue
    if ln.startswith('#') and not m: cur = None if ln.startswith(('## ', '### ')) else cur
    if cur: screens[cur]['spec'].append(ln)

def ensure(code, name=None):
    if code not in screens:
        screens[code] = dict(code=code, name=name or code, module='(not in spec)', app={'D':'Dealer','O':'OEM','N':'New'}[code[0]], spec=[], inSpec=False)
    return screens[code]

# ---- tour edges
edges = {}
def edge(a, b):
    k = (a, b)
    if k not in edges: edges[k] = dict(source=a, target=b, tour=[], mock=[], spec=[])
    return edges[k]

tours = []
stepinfo = {}
for f in sorted(glob.glob(os.path.join(APP, 'sequences/*.json'))):
    s = json.load(open(f)); tid = s['id']
    steps = s['steps']
    # reach order
    order, seen, q = [], set(), [s['startStep']]
    while q:
        k = q.pop(0)
        if k in seen or k not in steps: continue
        seen.add(k); order.append(k)
        st = steps[k]
        nxt = [st['nextStep']] if st.get('nextStep') else []
        nxt += [a['nextStep'] for a in (st.get('actions') or {}).values() if a.get('nextStep')]
        q += nxt
    path = []
    for k in order:
        st = steps[k]; ensure(st['screen'])
        trans = []
        if st.get('nextStep'): trans.append((None, st['nextStep'], st.get('performedText'), st.get('stateChange')))
        for an, a in (st.get('actions') or {}).items():
            if a.get('nextStep'): trans.append((an, a['nextStep'], a.get('performedText'), a.get('stateChange')))
        path.append(dict(step=k, screen=st['screen'], user=st['user'], action=st['proposedAction'], notDefined=bool(st.get('notDefined'))))
        for an, nk, ptxt, sc in trans:
            t = steps.get(nk)
            if not t or t['screen'] == st['screen']: continue
            e = edge(st['screen'], t['screen'])
            e['tour'].append(dict(tour=tid, title=s.get('title', tid), by=st['user'], to=t['user'],
                                  handoff=st['user'] != t['user'], button=an, did=st['proposedAction'],
                                  result=ptxt, stateChange=sc, nextStepAction=t['proposedAction'],
                                  gap=bool(t.get('notDefined')) ))
    tours.append(dict(id=tid, title=s.get('title', tid), steps=path, completion=s.get('completionMessage')))

# ---- mock-button edges
for f in glob.glob(os.path.join(APP, 'mock-app/screens/*/*.js')):
    src = open(f, encoding='utf-8').read()
    m = re.search(r"code:\s*'([DON]\d{2})'.*?name:\s*'([^']*)'", src)
    if not m: continue
    code = m.group(1); ensure(code, m.group(2))
    if screens[code]['name'] == code: screens[code]['name'] = m.group(2)
    for b in re.finditer(r"button\(\s*([`'\"])(.*?)\1\s*,\s*\{([^}]*)\}", src):
        g = re.search(r"goto:\s*'([DON]\d{2})'", b.group(3))
        if g and g.group(1) != code:
            ensure(g.group(1))
            edge(code, g.group(1))['mock'].append(dict(button=b.group(2), action=(re.search(r"action:\s*'([^']*)'", b.group(3)) or [None,None])[1]))
    screens[code]['built'] = True
    for t in re.finditer(r"(?:opens|open|leads to|navigates to)[^'`]*?\b([DON]\d{2})\b[^'`]*", src):
        pass

# ---- spec mentions
for code, sc in screens.items():
    text = '\n'.join(sc['spec'])
    for ln in text.split('\n'):
        for m in set(CODE.findall(ln)):
            if m == code: continue
            ensure(m)
            clean = re.sub(r'\s+', ' ', re.sub(r'^[-*>\s]+|\*\*|`', '', ln.replace('|', ' ¦ '))).strip()
            if len(clean) > 260: clean = clean[:257] + '…'
            es = edge(code, m)['spec']
            if clean not in [x['text'] for x in es]: es.append(dict(text=clean, rel='counterpart' if re.search(r'counterpart|mirror|read-only view|dealer-side|OEM-side', ln, re.I) else 'link'))
# N-screens / extra names from slides
sl = os.path.join(APP, 'feedback/slides.json')
open_q = {}
if os.path.exists(sl):
    for s in json.load(open(sl))['slides']:
        open_q[s['code']] = len(s.get('questions', []))
        if s['code'] in screens and screens[s['code']]['name'] == s['code']: screens[s['code']]['name'] = s['name']

def kind(e):
    return [k for k in ('tour', 'mock', 'spec') if e[k]]
E=[]
for e in edges.values():
    e['kinds'] = kind(e)
    E.append(e)
deg = collections.Counter()
for e in E: deg[e['source']] += 1; deg[e['target']] += 1
nodes = []
for c, s in sorted(screens.items()):
    tcount = sum(1 for t in tours for st in t['steps'] if st['screen'] == c)
    nodes.append(dict(code=c, name=s['name'], module=s['module'], app=s['app'], inSpec=s['inSpec'],
                      built=bool(s.get('built')), degree=deg[c], tourSteps=tcount, openQuestions=open_q.get(c, 0),
                      tours=sorted({t['id'] for t in tours for st in t['steps'] if st['screen'] == c})))
json.dump(dict(nodes=nodes, edges=E, tours=tours), open(os.path.join(HERE, 'graph.json'), 'w'), indent=1, ensure_ascii=False)
print(len(nodes), 'screens', len(E), 'links;',
      sum('tour' in e['kinds'] for e in E), 'walked,', sum('mock' in e['kinds'] for e in E), 'button,', sum('spec' in e['kinds'] for e in E), 'spec;',
      sum(1 for n in nodes if n['degree'] == 0), 'isolated')
