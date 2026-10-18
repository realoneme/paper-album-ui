from common import *
ROOT = 'B9TaTUnmd'
d = D(); section = page(d, ROOT)
hin = section('aHead', 'Header', pad='72px 32px 24px 32px', gap='28px')
heading(d, 'aH', hin, 'Albums', 'Every album starts as a day.', 'A few of the families, couples and faces we have photographed lately, and the albums they became.', preset='Display', tag='h1')
d.stack('chips', hin, 'horizontal', gap='10px', align='center', name='Jump to', stackWrapEnabled=True)
cats = [('Weddings', 'Wedding', 'weddings', 'corners', 'The ceremony, the speeches and the dancing, in order.'),
        ('Families', 'Family', 'families', 'tape', 'Picnics, kitchens and gardens; whoever is in the family that year.'),
        ('Portraits', 'Portrait', 'portraits', 'polaroid', 'One person, one place, good light.')]
for k, (t, *_r) in enumerate(cats):
    d.stack(f'chip{k}', 'chips', 'horizontal', align='center', width='auto', padding='10px 18px', radius='999px', fill=tok('card'),
            shadow=[f'inset 0px 0px 0px 1px {tok("border")}', f'0px 2px 0px 0px {tok("border")}'], name=t, **{'link.href': f'/albums#{_r[1]}'})
    d.text(f'chip{k}t', f'chip{k}', t, 'Ui', 'cardFg', width='auto')
for k, (t, opt, anchor, holder, sub) in enumerate(cats):
    sin = section(f'cat{k}', t, pad='56px 32px 40px 32px' if k else '40px 32px 40px 32px', gap='32px', scrollTargetEnabled=True, elementId=anchor)
    d.stack(f'cat{k}h', sin, 'vertical', gap='8px', name='Heading', padding='0px 0px 20px 0px', shadow=[f'inset 0px -1px 0px 0px {tok("border")}'])
    d.text(f'cat{k}t', f'cat{k}h', t, 'H2', 'fg', tag='h2')
    d.text(f'cat{k}s', f'cat{k}h', sub, 'Body', 'groundMuted')
    d.frame(f'cat{k}l', sin, name=f'{t} albums', layout='grid', gridColumnCount='3', gridColumnMinWidth='300px', gridRowHeightType='fit', gridAlignment='start',
            gap='48px 40px', position='relative', width='100%', height='auto',
            **{'collectionList.collection': 'Albums', 'collectionList.repeatedDescendantId': f'cat{k}i',
               'collectionList.filters.0.variableId': A['cat'], 'collectionList.filters.0.transforms.0.name': 'equals', 'collectionList.filters.0.transforms.0.value': opt})
    d.stack(f'cat{k}i', f'cat{k}l', 'vertical', gap='18px', width='1fr', name='Album', **{'link.href': '/albums/:slug', 'link.collectionItem': v(A['slug'])})
    d.inst(f'cat{k}p', f'cat{k}i', 'PhotoHolder', holder=holder, photo=v(A['cover']), name=v(A['note']), ratio='4 / 5', width='100%', tilt=str([-1, 1.5, -2][k]))
    d.stack(f'cat{k}x', f'cat{k}i', 'vertical', gap='6px', name='Album text')
    d.text(f'cat{k}xt', f'cat{k}x', v(A['title']), 'H3', 'fg', tag='h3')
    d.text(f'cat{k}xp', f'cat{k}x', v(A['place']), 'Small', 'groundMuted')
    d.text(f'cat{k}xe', f'cat{k}x', v(A['excerpt']), 'Body', 'groundMuted')
section('aEnd', 'Spacer', pad='0px 32px 64px 32px', gap='0px')
print(d.out())
