"""Tiny builder for Framer DSL: two phases (create, then set)."""
import json
T = {'bg':'8c691625-4181-47b8-a36c-840403c4acf0','fg':'d91fe586-20e9-4a3c-bb8e-74f8112c4a64','groundMuted':'c0147b51-0aef-4614-ab6e-082dc0b1557c',
 'card':'837d972a-3050-4af7-aec3-ab6d155ff9d0','cardFg':'8e07e7c2-4b9c-4848-823c-9a7d21efe6b3','muted':'f3647d72-cc62-4a91-a21a-dd824b91c7df',
 'mutedFg':'dad719f8-3045-4c8d-b2e4-9fa3f2bd5bdc','primary':'13dc56df-922a-4ba8-aad3-832454add9cd','primaryFg':'3c9a9168-e56c-49a0-b563-569a2d5915d1',
 'edge':'1f2fad49-27f1-4bd9-9846-db0c15c5f112','border':'01902613-4181-4740-9476-6fa57a3b236c','ring':'bdfcc781-9f46-4a88-9ae3-d6ade4137449',
 'wood':'929570d9-0f16-458b-b9ee-66ad0b69c97e','onWood':'309262b3-9960-43af-92cf-d391174f8c89','seal':'f0b27269-ea51-4d87-ac03-83e8fb89b6f9',
 'onSeal':'911a1246-4cf6-4e8d-a227-9045e1669eb4','print':'58b953b8-f941-4c5b-8fb4-669eadd004bc','printInk':'48748234-649f-44f8-89c7-d3fc1cb79106',
 'glow':'593864fa-6efa-4132-a171-eb9cf21ae3a4','tape':'c92eda17-eb25-4699-b3a0-30313d2ce207','success':'c890c1c5-6b11-4a32-b845-384b96e799fb',
 'destructive':'2dfe6e70-2362-428d-b376-d439ada6f86f','destructiveFg':'40f305c1-2782-4ebb-977c-8706256f14b5'}
def tok(n): return f'var(--token-{T[n]})'
SH = {
 'raised1': [f'0px 2px 0px 0px {tok("border")}', '0px 6px 12px 0px rgba(40, 24, 10, 0.16)'],
 'raised2': [f'0px 2px 0px 0px {tok("border")}', f'0px 5px 0px 0px {tok("muted")}', f'0px 7px 0px 0px {tok("border")}', '0px 16px 24px 0px rgba(40, 24, 10, 0.22)'],
 'print': ['0px 4px 10px 0px rgba(40, 24, 10, 0.24)'],
 'sunken': ['inset 0px 3px 5px 0px rgba(40, 24, 10, 0.22)', 'inset 0px -1px 0px 0px rgba(255, 255, 255, 0.5)'],
 'layer': ['0px -6px 12px 0px rgba(40, 24, 10, 0.28)'],
}
CODE = {'Button':'czLaRAM','PhotoHolder':'wTWkIQA','Accordion':'jqknXdA','Carousel':'ggXlNnz','Tabs':'TVtNttw','RadioGroup':'gbV_TGg','Checkbox':'CnVM2G9',
        'Input':'Nrk8sbh','Textarea':'SRQeAqz','Select':'LkRJ5s0','Calendar':'ww03Ob6','Toast':'cqHI_7c','HelpTip':'Qvtn2Cv'}
BTN = {'$control__primary': tok('primary'), '$control__primaryText': tok('primaryFg'), '$control__edge': tok('edge'), '$control__paper': tok('card'),
       '$control__paperText': tok('cardFg'), '$control__paperEdge': tok('border'), '$control__seal': tok('seal'), '$control__sealText': tok('onSeal'),
       '$control__hover': tok('muted'), '$control__outline': tok('groundMuted'), '$control__destructive': tok('destructive'),
       '$control__destructiveText': tok('destructiveFg'), '$control__font': json.dumps({'fontSelector': 'GF;Instrument Sans-600', 'letterSpacing': [0, 'em']})}
PH = {'$control__print': tok('print'), '$control__corners': tok('wood'), '$control__page': tok('card'), '$control__sleeve': tok('muted'),
      '$control__tape': tok('tape'), '$control__ink': tok('printInk'), '$control__nameFont': json.dumps({'fontSelector': 'GF;Caveat-500', 'letterSpacing': [0, 'em']})}

def q(v):
    if isinstance(v, bool): v = 'true' if v else 'false'
    return '"' + str(v).replace('\\', '\\\\').replace('"', '\\"') + '"'

class D:
    def __init__(self): self.c, self.s = [], []
    def _set(self, i, a):
        a = dict(a)
        for k in list(a):
            if k == 'shadow':
                for n, x in enumerate(SH[a.pop(k)] if isinstance(a[k], str) else a.pop(k)): a[f'boxShadows.{n}'] = x
        if a: self.s.append(f'SET {i} ' + ' '.join(f'{k}={q(v)}' for k, v in a.items()) + ';')
    def frame(self, i, parent, index=None, **a):
        self.c.append(f'+FrameNode {i} parent="{parent}"' + (f' index="{index}"' if index is not None else '') + ';'); self._set(i, a); return i
    def stack(self, i, parent, dir='vertical', gap=None, align='start', dist='start', index=None, **a):
        base = dict(layout='stack', stackDirection=dir, stackDistribution=dist, stackAlignment=align, position='relative')
        if gap is not None and not dist.startswith('space'): base['gap'] = gap
        base.setdefault('width', '100%'); base.setdefault('height', 'auto')
        base.update(a); return self.frame(i, parent, index, **base)
    def text(self, i, parent, text, preset, color='fg', index=None, tag=None, **a):
        self.c.append(f'+RichTextNode {i} parent="{parent}"' + (f' index="{index}"' if index is not None else '') + ';')
        base = dict(text=text, textStylePreset=f'Paper/{preset}', textColor=tok(color) if color in T else color, position='relative', width='1fr', height='auto')
        if tag: base['tag'] = tag
        base.update(a); self._set(i, base); return i
    def inst(self, i, parent, comp, index=None, **a):
        self.c.append(f'+ComponentInstanceNode {i} component="codeFile/{CODE[comp]}:default" parent="{parent}"' + (f' index="{index}"' if index is not None else '') + ';')
        base = {**(BTN if comp == 'Button' else PH if comp == 'PhotoHolder' else {}), 'position': 'relative', 'width': 'auto', 'height': 'auto'}
        base.update({(k if k.startswith('$') or k in ('position', 'width', 'height', 'link.href', 'rotation', 'zIndex', 'visible', 'maxWidth', 'left', 'top', 'right', 'bottom', 'opacity') else f'$control__{k}'): v for k, v in a.items()})
        self._set(i, base); return i
    def button(self, i, parent, label, variant='primary', href=None, size='default', **a):
        extra = {'label': label, 'variant': variant, 'size': size}
        if href: extra['link'] = href
        extra.update(a); return self.inst(i, parent, 'Button', **extra)
    def raw(self, line, phase='s'): (self.c if phase == 'c' else self.s).append(line)
    def out(self): return '\n'.join(self.c) + '\n---\n' + '\n'.join(self.s) + '\n'
