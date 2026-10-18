import sys, json; sys.path.insert(0, '.')
from b import *
P = json.load(open('/tmp/pa-keepsake-picks.json'))
IMG = json.load(open('/tmp/pa-keepsake-images.json')); flat = [x for v in IMG.values() for x in v]
U = lambda i: flat[i]['url'].replace('w=1600', 'w=1600')
A = {'title': 'zJEWLHBBE', 'slug': 'O6k2d8_BE', 'cat': 'Er2jyU3x5', 'cover': 'rk3DzAeiK', 'place': 'oZ6ubwihV', 'note': 'udarXrdyu', 'feat': 'qCj692r_7', 'excerpt': 'R3G6kV02Z'}
Q = {'quote': 'r28nVaDC2', 'name': 'U9kjhpjZa', 'session': 'c6dOI5Mj8', 'photo': 'B_PQVCddM'}
v = lambda k: f'var(--variable-{k})'
ROOT = 'WQLkyLRf1'
d = D()
def section(i, name, pad='96px 32px', fill=None, **a):
    extra = dict(fill=fill) if fill else {}
    d.stack(i, ROOT, 'vertical', align='center', gap='0px', padding=pad, name=name, **extra, **a)
    return d.stack(i + 'In', i, 'vertical', gap='40px', maxWidth='1136px', name=name + ' content')
def heading(i, parent, label, title, sub=None, align='start'):
    d.stack(i, parent, 'vertical', gap='12px', align=align, name='Heading')
    d.text(i + 'L', i, label, 'Label', 'wood')
    d.text(i + 'T', i, title, 'H2', 'fg', tag='h2')
    if sub: d.text(i + 'S', i, sub, 'Lead', 'groundMuted')
def rich(i, parent, preset, color, tag, runs, **a):
    d.c.append(f'+RichTextNode {i} parent="{parent}";')
    d._set(i, dict(textStylePreset=f'Paper/{preset}', textColor=tok(color), position='relative', width='1fr', height='auto', **a))
    d.c.append(f'+TextBlock {i}b parent="{i}" tag="{tag}";')
    for k, (txt, st) in enumerate(runs):
        d.c.append(f'+TextRun {i}r{k} parent="{i}b" text={q(txt)};')
        if st: d._set(f'{i}r{k}', st)

# ---------------- 1 hero
d.stack('hero', ROOT, 'vertical', align='center', gap='0px', padding='72px 32px 104px 32px', name='Hero')
d.stack('heroIn', 'hero', 'horizontal', gap='56px', align='center', maxWidth='1136px', name='Hero content')
d.stack('heroL', 'heroIn', 'vertical', gap='28px', width='1fr', name='Hero text')
d.text('heroLab', 'heroL', 'Wedding · Family · Portrait photography', 'Label', 'wood')
rich('heroH', 'heroL', 'Display Xl', 'fg', 'h1', [('Photographs, ', None), ('tucked in', {'fontStyle': 'italic', 'fontWeight': '300'}), (' by hand.', None)])
d.text('heroP', 'heroL', '[Studio Name] photographs weddings, families and portraits in [City], then binds the best of them into a linen album you can hold for the next fifty years.', 'Lead', 'groundMuted')
d.stack('heroBtns', 'heroL', 'horizontal', gap='16px', align='center', name='Hero actions', stackWrapEnabled=True)
d.button('heroB1', 'heroBtns', 'Book a session', 'seal', '/book', 'lg')
d.button('heroB2', 'heroBtns', 'See the albums', 'secondary', '/albums', 'lg')
d.text('heroNote', 'heroL', 'replies within 2 days', 'Note Sm', 'wood', width='auto', rotation='-2')
d.frame('heroArt', 'heroIn', name='Hero prints', position='relative', width='520px', height='580px')
d.inst('heroP1', 'heroArt', 'PhotoHolder', holder='tape', photo=P['hero'], name='Lake Como, June', tilt='1', ratio='4 / 5',
       position='absolute', width='330px', left='150px', top='10px', right='null', bottom='null')
d.inst('heroP2', 'heroArt', 'PhotoHolder', holder='polaroid', photo=U(16), name='Sunday picnic', tilt='-3',
       position='absolute', width='230px', left='0px', top='300px', right='null', bottom='null', zIndex='2')
d.inst('heroP3', 'heroArt', 'PhotoHolder', holder='corners', photo=U(35), name='Lisbon', ratio='4 / 5',
       position='absolute', width='170px', left='340px', top='370px', right='null', bottom='null', zIndex='1')
# ---------------- 2 featured albums
fin = section('feat', 'Recent albums')
d.stack('featHead', fin, 'horizontal', align='end', dist='space-between', name='Heading row')
heading('featH', 'featHead', 'Recent albums', 'Bound this year', None)
d.raw('SET featH width="auto";')
d.button('featAll', 'featHead', 'All albums', 'secondary', '/albums', icon='arrow-right')
d.frame('featList', fin, name='Featured albums', layout='grid', gridColumnCount='3', gridColumnMinWidth='300px', gridRowHeightType='fit',
        gridAlignment='start', gap='40px', position='relative', width='100%', height='auto',
        **{'collectionList.collection': 'Albums', 'collectionList.repeatedDescendantId': 'featItem', 'collectionList.limit': '3',
           'collectionList.filters.0.variableId': A['feat'], 'collectionList.filters.0.transforms.0.name': 'equals', 'collectionList.filters.0.transforms.0.value': 'true'})
d.stack('featItem', 'featList', 'vertical', gap='18px', width='1fr', name='Album', **{'link.href': '/albums/:slug', 'link.collectionItem': v(A['slug'])})
d.inst('featPh', 'featItem', 'PhotoHolder', holder='corners', photo=v(A['cover']), name=v(A['title']), ratio='4 / 5', width='100%')
d.stack('featTxt', 'featItem', 'vertical', gap='6px', name='Album text')
d.text('featNote', 'featTxt', v(A['note']), 'Note Sm', 'wood')
d.text('featTitle', 'featTxt', v(A['title']), 'H3', 'fg', tag='h3')
d.text('featPlace', 'featTxt', v(A['place']), 'Small', 'groundMuted')
# ---------------- 3 services
sin = section('serv', 'What we photograph', pad='24px 32px 96px 32px')
heading('servH', sin, 'Sessions', 'Weddings, families, portraits, and any moment you want to keep', 'These are the sessions we book most, not the only ones. Whatever the day, it ends the same way: a sequence of prints you choose together, bound into an album.')
d.frame('servGrid', sin, name='Session cards', layout='grid', gridColumnCount='3', gridColumnMinWidth='300px', gridRowHeightType='auto', gridAlignment='start',
        gap='28px', position='relative', width='100%', height='auto')
cards = [('Weddings', U(2), 'The whole day, from the first coffee to the last dance, with a second photographer.', 'from $3,800', 'wedding'),
         ('Families', U(20), 'Two slow hours at home or somewhere you love. Children run, nobody poses.', 'from $750', 'family'),
         ('Portraits', U(42), 'One hour, one place, for you or for two. Book jackets, graduations, birthdays.', 'from $450', 'portrait')]
for k, (t, img, body, price, slug) in enumerate(cards):
    c = f'sc{k}'
    d.stack(c, 'servGrid', 'vertical', gap='20px', width='1fr', height='1fr', fill=tok('card'), radius='8px', padding='20px 20px 28px 20px', shadow='raised1', name=t,
            **{'link.href': '/services'})
    d.inst(c + 'Ph', c, 'PhotoHolder', holder='slits', photo=img, name=t, ratio='3 / 2', width='100%', hoverMotion='false')
    d.stack(c + 'T', c, 'vertical', gap='8px', name='Text', padding='0px 8px')
    d.text(c + 'H', c + 'T', t, 'H3', 'cardFg', tag='h3')
    d.text(c + 'B', c + 'T', body, 'Body', 'mutedFg')
    d.text(c + 'P', c + 'T', price, 'Note Sm', 'seal')
# ---------------- 4 printed albums
d.stack('alb', ROOT, 'vertical', align='center', gap='0px', padding='0px 32px 96px 32px', name='Printed albums')
d.stack('albIn', 'alb', 'horizontal', gap='64px', align='center', maxWidth='1136px', fill=tok('card'), radius='14px', padding='56px 56px 56px 56px', shadow='raised2', name='Printed albums panel')
d.frame('albArt', 'albIn', name='Album photos', position='relative', width='440px', height='420px')
d.inst('albP1', 'albArt', 'PhotoHolder', holder='corners', photo=P['product'][1], name='Linen, 30 × 30 cm', ratio='1 / 1', position='absolute', width='330px', left='0px', top='0px', right='null', bottom='null')
d.inst('albP2', 'albArt', 'PhotoHolder', holder='tape', photo=P['product'][2], name='Archival cotton rag', ratio='4 / 5', tilt='2', position='absolute', width='190px', left='250px', top='190px', right='null', bottom='null', zIndex='1')
d.stack('albT', 'albIn', 'vertical', gap='22px', width='1fr', name='Album text')
d.text('albL', 'albT', 'Printed albums', 'Label', 'wood')
rich('albH', 'albT', 'H1', 'cardFg', 'h2', [('Your photographs deserve more than ', None), ('a folder.', {'fontStyle': 'italic', 'fontWeight': '300'})])
d.text('albB', 'albT', 'We design every album with you, print it on archival cotton paper and bind it in linen. Order one with your session, or bring photographs from years ago.', 'Body', 'mutedFg')
d.stack('albList', 'albT', 'vertical', gap='12px', name='Album facts')
for k, (n, t) in enumerate([('1', 'Three sizes, from 20 × 25 to 30 × 30 cm'), ('2', 'Linen or leather covers, debossed with your names'), ('3', '30 to 100 pages, laid flat so no photo is lost in the fold')]):
    d.stack(f'af{k}', 'albList', 'horizontal', gap='14px', align='center', name='Fact')
    d.text(f'af{k}n', f'af{k}', n, 'Note', 'seal', width='auto')
    d.text(f'af{k}t', f'af{k}', t, 'Ui', 'cardFg')
d.stack('albBtns', 'albT', 'horizontal', gap='16px', align='center', name='Album actions')
d.button('albB1', 'albBtns', 'Design your album', 'primary', '/printed-albums')
d.text('albNote', 'albBtns', 'ships in 4 weeks', 'Note Sm', 'wood', width='auto', rotation='-3')
# ---------------- 5 testimonials
tin = section('quotes', 'Kind words', pad='24px 32px 96px 32px')
heading('qH', tin, 'Kind words', 'From the people in the photographs')
d.frame('qList', tin, name='Testimonials', layout='grid', gridColumnCount='3', gridColumnMinWidth='300px', gridRowHeightType='auto', gridAlignment='start', gap='28px',
        position='relative', width='100%', height='auto', **{'collectionList.collection': 'Testimonials', 'collectionList.repeatedDescendantId': 'qItem', 'collectionList.limit': '3'})
d.stack('qItem', 'qList', 'vertical', gap='20px', width='1fr', height='1fr', fill=tok('print'), radius='2px', padding='28px', shadow='print', name='Testimonial')
d.text('qMark', 'qItem', '“', 'Display', 'wood', lineHeight='0.6em')
d.text('qText', 'qItem', v(Q['quote']), 'Lead', 'printInk')
d.stack('qSpacer', 'qItem', 'vertical', height='1fr', name='Spacer')  # keeps the names on the bottom edge of every card
d.stack('qWho', 'qItem', 'horizontal', gap='12px', align='center', name='Who')
d.frame('qAv', 'qWho', name='Photo', position='relative', width='44px', height='44px', radius='999px', fill=v(Q['photo']), shadow=[f'0px 0px 0px 2px {tok("card")}', '0px 2px 6px 0px rgba(40, 24, 10, 0.25)'])
d.stack('qNames', 'qWho', 'vertical', gap='2px', width='1fr', name='Names')
d.text('qName', 'qNames', v(Q['name']), 'Small', 'printInk')
d.text('qSess', 'qNames', v(Q['session']), 'Caption', 'mutedFg')
# ---------------- 6 cta
d.stack('cta', ROOT, 'vertical', align='center', gap='0px', padding='0px 32px 112px 32px', name='Call to action')
d.stack('ctaIn', 'cta', 'vertical', gap='24px', align='center', maxWidth='1136px', fill=tok('primary'), radius='14px', padding='72px 48px', shadow='raised1', name='Call to action panel')
rich('ctaH', 'ctaIn', 'Display', 'primaryFg', 'h2', [('Let’s make something ', None), ('you’ll keep.', {'fontStyle': 'italic', 'fontWeight': '300'})], textAlignment='center')
d.text('ctaP', 'ctaIn', 'Tell us the date and the place. We reply within two days with what we have free.', 'Lead', 'primaryFg', textAlignment='center', opacity='0.85')
d.button('ctaB', 'ctaIn', 'Check my date', 'seal', '/book', 'lg')
d.text('ctaNote', 'ctaIn', '* book at least 2 weeks ahead', 'Caption', 'primaryFg', width='auto', opacity='0.75')
print(d.out())
