# One spacing system for every Keepsake page and breakpoint. Reads the serialized page tree (/tmp/pa-tree.json, written
# by an exec that serializes every breakpoint 4 levels deep) and prints SET lines that put every section, heading,
# grid, card and panel on the scale below. Usage: python3 spacing.py <page path> > x.dsl
#
# Scale (px): 4 8 12 16 20 24 32 40 48 56 64 72 80 96 112 128          Desktop / Tablet / Phone
#   gutter        section side padding                                       32 / 32 / 20
#   pageTop       first section, below the navigation                        80 / 64 / 48
#   headerBottom  page header to the first content                           48 / 40 / 32
#   section       between sections on different topics                       96 / 80 / 64
#   subsection    between groups of the same kind (album categories,         64 / 56 / 48
#                 cover, photographs and story of one album)
#   group         between panels that belong together                        24 / 24 / 16
#   last          last section to the footer                                 112 / 96 / 80
#   head          heading block to its content                               40 / 32 / 24
#   heading       label, title and subtitle inside a heading                 12
#   split         between the two columns of a split layout                  64 / 40 / 32
#   cardGap       between cards in a grid                                    32 / 24 / 16
#   albumGap      between album covers (rows, columns)                       48 32 / 40 24 / 32 16
#   cardPad       inside a card                                              28 / 24 / 20
#   panelPad      inside a wide feature panel                                56 / 40 / 28 24
#   bandPad       inside a one-line band (offer, add-on)                     40 48 / 32 36 / 28 24
#   ctaPad        inside the closing call to action                          72 48 / 56 40 / 48 24
#   formPad       inside a form card                                         40 / 32 / 24
import json, sys

T = dict(gutter=(32, 32, 20), pageTop=(80, 64, 48), headerBottom=(48, 40, 32), section=(96, 80, 64), subsection=(64, 56, 48),
         group=(24, 24, 16), last=(112, 96, 80), head=(40, 32, 24), split=(64, 40, 32), cardGap=(32, 24, 16),
         albumGap=('48px 32px', '40px 24px', '32px 16px'), cardPad=(28, 24, 20), panelPad=('56px', '40px', '28px 24px'),
         bandPad=('40px 48px', '32px 36px', '28px 24px'), ctaPad=('72px 48px', '56px 40px', '48px 24px'), formPad=(40, 32, 24),
         photoCardPad=('20px 20px 28px 20px', '20px 20px 24px 20px', '16px 16px 24px 16px'))
px = lambda v: v if isinstance(v, str) else f'{v}px'

# per page: section name -> (top, bottom) as token names (None = 0); unnamed sections fall back to 0 / section
PAGES = {
    '/': {'Recent albums': ('section', 'section'), 'What we photograph': (None, 'section'), 'Printed albums': (None, 'section'),
          'Kind words': (None, 'section'), 'Call to action': (None, 'last')},
    '/albums': {'Header': ('pageTop', 'headerBottom'), 'Weddings': (None, 'subsection'), 'Families': (None, 'subsection'),
                'Portraits': (None, 'last'), 'Spacer': (None, None)},
    '/albums/:Albums': {'Header': ('pageTop', 'headerBottom'), 'Cover': (None, 'subsection'), 'Photographs': (None, 'subsection'),
                        'Story': (None, 'section'), 'Next': (None, 'last')},
    '/services': {'Header': ('pageTop', 'headerBottom'), 'Packages': (None, 'section'), 'Other sessions': (None, 'group'),
                  'Album add-on': (None, 'section'), 'Questions': (None, 'last')},
    '/printed-albums': {'Hero': ('pageTop', 'section'), 'How it works': (None, 'section'), 'Design your album': (None, 'last')},
    '/book': {'Book a session': ('pageTop', 'last')},
    '/about': {'Hero': ('pageTop', 'section'), 'How I work': (None, 'section'), 'Lately': (None, 'last')},
    '/404': {'Not found': ((112, 96, 64), (128, 112, 80))},
    '/away': {'Away': ((112, 96, 64), (128, 112, 80))},
}
SPLITS = {'Hero content', 'Questions layout', 'Form layout', 'Booking layout', 'Printed albums panel', 'Not found content', 'Title row'}
CARD_GRIDS = {'Session cards', 'Testimonials', 'Packages', 'Steps', 'Principles'}
PANELS = {'Printed albums panel': 'panelPad', 'Call to action panel': 'ctaPad', 'Other sessions panel': 'bandPad', 'Add-on panel': 'bandPad',
          'Album offer': 'bandPad', 'Album form': 'formPad', 'Booking form': 'formPad'}

def tok(name, i):
    if name is None: return 0
    v = name if isinstance(name, tuple) else T[name]
    return v[i]

def main(path):
    tree = json.load(open('/tmp/pa-tree.json'))[path]
    rules = PAGES[path]; out = []
    for root in tree:
        if root.get('name') not in ('Desktop', 'Tablet', 'Phone'): continue
        i = ('Desktop', 'Tablet', 'Phone').index(root['name']); g = T['gutter'][i]
        for sec in root.get('children') or []:
            a = sec.get('attributes', {})
            if sec['type'] != 'FrameNode' or a.get('visible') is False or a.get('layout') != 'stack': continue
            top, bottom = rules.get(sec.get('name'), (None, 'section'))
            out.append(f'SET {sec["id"]} padding="{px(tok(top, i))} {g}px {px(tok(bottom, i))} {g}px";')
            walk(sec, i, out, 0)
    return out

def walk(n, i, out, depth):
    for c in n.get('children') or []:
        a = c.get('attributes', {}); name = c.get('name') or ''
        if c['type'] != 'FrameNode' or a.get('layout') not in ('stack', 'grid'): continue
        kids = [k.get('name') for k in c.get('children') or []]
        sets = {}
        if a.get('layout') == 'grid':
            # equal rows keep cards in a row the same height; the session cards hold a row-wide card on tablet, so they fit
            sets['gridRowHeightType'] = 'auto' if name in CARD_GRIDS and name != 'Session cards' else 'fit'
            if name in CARD_GRIDS: sets['gap'] = px(T['cardGap'][i])
            elif name.endswith(' albums') or name == 'Gallery': sets['gap'] = T['albumGap'][i]
            for k in c.get('children') or []:
                if name == 'Session cards': out.append(f'SET {k["id"]} padding="{T["photoCardPad"][i]}";')
                elif name in CARD_GRIDS and k.get('attributes', {}).get('padding'): out.append(f'SET {k["id"]} padding="{px(T["cardPad"][i])}";')
        elif name == 'Heading':
            sets.update(gap='12px', padding='0px')
        elif name.endswith(' content') and kids and kids[0] in ('Heading', 'Heading row'):
            sets['gap'] = px(T['head'][i])
        if name in SPLITS: sets['gap'] = px(T['split'][i])
        if name in PANELS: sets['padding'] = px(T[PANELS[name]][i])
        if sets: out.append(f'SET {c["id"]} ' + ' '.join(f'{k}="{v}"' for k, v in sets.items()) + ';')
        if depth < 3: walk(c, i, out, depth + 1)

if __name__ == '__main__':
    print('\n'.join(main(sys.argv[1])))
