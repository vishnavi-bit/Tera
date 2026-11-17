# Tiny helpers that describe a drawn screen as data. A leading "~" marks something that is MY PROPOSAL (not in the spec).
def split(s): return [x.strip() for x in s.split('|')] if s else []

def Q(question, why, suggestion, raised=None, basis='mine'):
    return dict(question=question, why=why, suggestion=suggestion, raised=raised or [], basis=basis)

def L(title, cols, rows, actions='', tabs='', filters='', search=''):
    return dict(t='list', title=title, cols=split(cols), rows=[split(r) for r in rows], actions=split(actions), tabs=split(tabs), filters=split(filters), search=search)

def F(title, fields, actions=''):
    return dict(t='form', title=title, fields=[split(f) for f in fields], actions=split(actions), dialog=False)

def Dlg(title, fields, actions=''):
    d = F(title, fields, actions); d['dialog'] = True; return d

def D(title, tabs, kv, actions=''):
    return dict(t='detail', title=title, tabs=list(tabs), kv=[split(k) for k in kv], actions=split(actions))

def Dash(title, tiles, filters='', note=''):
    return dict(t='dash', title=title, tiles=[split(x) for x in tiles], filters=split(filters), note=note)

def Tabs(tabs): return dict(t='tabs', tabs=split(tabs))
def Note(text): return dict(t='note', text=text)
def Flow(steps): return dict(t='flow', steps=list(steps))
def Cal(title, marks, note=''): return dict(t='cal', title=title, marks=list(marks), note=note)
