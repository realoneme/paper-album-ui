import json, re
K = './'
def ids(n): return json.load(open(K + f'ids-{n}.json'))
pages = {  # name: (page id, primary id, dsl file, ids file)
 'home': ('augiA20Il', 'WQLkyLRf1', 'home.dsl', 'home'), 'albums': ('Ta0Gx5QSq', 'B9TaTUnmd', 'albums.dsl', 'albums'),
 'album': ('SQX73ddn8', 'kECOvd7KQ', 'album.dsl', 'album'), 'services': ('il9cXDCML', 'gSPXJeRCl', 'services.dsl', 'services'),
 'order': ('ou9YJtDf6', 'P_tDqwAqQ', 'order.dsl', 'order'), 'book': ('zbfGBKZWg', 'PxLO66PeO', 'book.dsl', 'book'),
 'about': ('QB8vgIcLs', 'dDWa8bCSo', 'about.dsl', 'about'), '404': ('s2pQWLZYw', 'xqNxQWMli', 'about.dsl', 'about'),
 'away': ('GhK5zvVHc', 'I5LwHtpiu', 'about.dsl', 'about'), 'style': ('jTjyMvxVJ', 'Y64dUIUxJ', None, None)}
def pad_for(p, f):
    nums = [int(x) for x in re.findall(r'(\d+)px', p)]
    if len(nums) == 2: nums = [nums[0], nums[1], nums[0], nums[1]]
    t, r, b, l = nums
    return f'{round(t * f)}px 20px {round(b * f)}px 20px'
VERT = 'stackDirection="vertical" stackAlignment="start" gap="{g}"'
STACK = 'layout="stack" stackDirection="vertical" stackAlignment="start" stackDistribution="start" gap="{g}"'
create, sets = [], []
for name, (pg, prim, dsl, idf) in pages.items():
    T, P = f'{name}T', f'{name}P'
    create += [f'CREATE_VARIANT {T} from="{prim}";', f'CREATE_VARIANT {P} from="{prim}";']
    sets += [f'SET {T} name="Tablet" width="810px" left="1300px" top="0px";', f'SET {P} name="Phone" width="390px" left="2210px" top="0px";']
    if not dsl: continue
    I = ids(idf); text = open(K + dsl).read()
    # sections = direct children of this page's primary
    temp = {v: k for k, v in I.items()}
    for m in re.finditer(r'\+FrameNode (\w+) parent="%s"' % prim, text):
        sid = m.group(1)
        sm = re.search(r'SET %s .*?padding="([^"]+)"' % re.escape(sid), text)
        if sm and sid in I:
            sets.append(f'SET {P}+{I[sid]} padding="{pad_for(sm.group(1), 0.62)}";')
            sets.append(f'SET {T}+{I[sid]} padding="{pad_for(sm.group(1), 0.8).replace("20px", "32px")}";')
def o(page, node, attrs, bp='P'):
    I = ids(pages[page][3]); sets.append(f'SET {page}{bp}+{I[node]} {attrs};')
both = lambda page, node, attrs: (o(page, node, attrs, 'T'), o(page, node, attrs, 'P'))
pin = lambda w, l, t: f'width="{w}px" left="{l}px" top="{t}px"'
# ---- home
both('home', 'heroIn', VERT.format(g='48px'))
o('home', 'heroArt', 'width="520px" height="640px"', 'T')
o('home', 'heroArt', 'width="350px" height="470px"'); o('home', 'heroP1', pin(230, 110, 0)); o('home', 'heroP2', pin(170, 0, 270)); o('home', 'heroP3', pin(120, 228, 240))
o('home', 'featHead', VERT.format(g='16px'))
for g in ('featList', 'servGrid', 'qList'): o('home', g, STACK.format(g='40px' if g == 'featList' else '24px'))
both('home', 'albIn', VERT.format(g='40px'))
o('home', 'albIn', 'padding="28px 22px 36px 22px"')
o('home', 'albArt', 'width="320px" height="320px"'); o('home', 'albP1', pin(240, 0, 0)); o('home', 'albP2', pin(140, 180, 150))
o('home', 'ctaIn', 'padding="48px 24px"')
# ---- albums
for k in range(3): o('albums', f'cat{k}l', STACK.format(g='40px'))
# ---- album
both('album', 'dTop', VERT.format(g='16px'))
o('album', 'dGrid', STACK.format(g='32px'))
both('album', 'dPanel', VERT.format(g='20px')); o('album', 'dPanel', 'padding="28px 24px"')
o('album', 'dPanelBtns', 'stackWrapEnabled="true"')
# ---- services
o('services', 'pList', STACK.format(g='24px'))
o('services', 'addIn', VERT.format(g='20px')); o('services', 'addIn', 'padding="28px 24px"')
both('services', 'faqCols', VERT.format(g='28px')); both('services', 'faqL', 'width="100%"')
# ---- order
both('order', 'oHeroIn', VERT.format(g='40px'))
o('order', 'oArt', 'width="340px" height="370px"'); o('order', 'oA1', pin(210, 0, 0)); o('order', 'oA2', pin(165, 170, 150))
o('order', 'oStG', STACK.format(g='18px'))
both('order', 'oFCols', VERT.format(g='32px')); both('order', 'oFL', 'width="100%" position="relative"')
o('order', 'oFrm', 'padding="24px 20px"')
for r in ('fRow1', 'fRow2'): o('order', r, VERT.format(g='20px'))
for g in ('fSizeG', 'fCoverG', 'fSrcG'): o('order', g, STACK.format(g='10px'))
# ---- book
both('book', 'bkCols', VERT.format(g='40px')); both('book', 'bkL', 'position="relative"'); both('book', 'bkF', 'width="100%"')
o('book', 'bkF', 'padding="24px 20px"')
for r in ('bkR1', 'bkR2', 'bkR3'): o('book', r, VERT.format(g='20px'))
# ---- about / 404
both('about', 'abHIn', VERT.format(g='40px'))
o('about', 'abArt', 'width="340px" height="430px"'); o('about', 'abP', pin(300, 20, 10))
o('about', 'abVG', STACK.format(g='20px'))
o('about', 'abGR', 'layout="grid" gridColumnCount="2" gridColumnMinWidth="140px" gridRowHeightType="fit" gap="28px 20px"')
I = ids('about')
for bp in ('T', 'P'): sets.append(f'SET 404{bp}+{I["nfIn"]} ' + VERT.format(g='32px') + ';')
sets.append(f'SET 404P+{I["nfArt"]} width="340px" height="400px";'); sets.append(f'SET 404P+{I["nfP"]} {pin(250, 30, 70)};'); sets.append(f'SET 404P+{I["nfP2"]} {pin(150, 180, 0)};')
for sid, pad in (('nf', '96px 32px 128px 32px'), ('aw', '112px 32px 144px 32px'), ('abH', '72px 32px 96px 32px')):
    pg = '404' if sid == 'nf' else 'away' if sid == 'aw' else 'about'
    if sid != 'abH': sets.append(f'SET {pg}P+{I[sid]} padding="{pad_for(pad, 0.62)}";')
# styleguide content padding
sets.append('SET styleP+VP4K1dN8I padding="40px 20px 64px 20px";')
for g in ('jzC75t5dx', 'Fy37gCfvC'): sets.append(f'SET styleP+{g} ' + STACK.format(g='24px') + ';')
print('\n'.join(create)); print('---'); print('\n'.join(sets))
# Tablet fixes applied later (no card left alone on a row):
#   Home sessions: the third card spans the row, photo beside text
#     SET aWOL2xvI_+mwNYeYcXr gridItemColumnSpan="all" stackDirection="horizontal" stackAlignment="center" gap="28px" height="auto";
#     SET aWOL2xvI_+tiPXD_x11 width="1fr";  SET aWOL2xvI_+kPvNCKT1M width="1fr";
#   Home testimonials and Services packages: three columns on tablet
#     SET aWOL2xvI_+K9JO8tNgU gridColumnCount="3" gridColumnMinWidth="200px" gap="20px";  SET aWOL2xvI_+f64v8XBCZ padding="24px";
#     SET gUfbkRYXi+NIvE7HUqV gridColumnCount="3" gridColumnMinWidth="200px" gap="16px";  SET gUfbkRYXi+anV1xgiyv padding="24px 20px";
