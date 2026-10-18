# The site photographs more than weddings, families and portraits: the copy names those three as the most booked
# sessions and invites everything else. Usage: python3 open.py home|services|book|layout > x.dsl
from common import *
d = D(); which = sys.argv[1]
if which == 'home':
    d._set('ApfkLaDA2', {'text': 'Weddings, families, portraits, and the days in between'})
    d._set('x_9yLxzc2', {'text': 'These are the sessions we book most, not the only ones. Whatever the day, it ends the same way: a sequence of prints you choose together, bound into an album.'})
    d.stack('servMore', 'm8SMdmS5a', 'horizontal', gap='18px', align='center', name='Other sessions', stackWrapEnabled='true',
            padding='18px 24px', radius='10px', fill=tok('muted'), shadow='sunken')
    d.text('servMoreN', 'servMore', 'and also', 'Note', 'seal', width='auto', rotation='-3')
    d.text('servMoreT', 'servMore', 'Engagements, maternity and newborns, birthdays, small celebrations, brand portraits.', 'Ui', 'cardFg', width='1fr')
    d.button('servMoreB', 'servMore', 'Ask about your day', 'ghost', '/book', icon='arrow-right')
elif which == 'services':
    d._set('HmXuKlcxt', {'text': 'Ways to spend a day with us.'})
    d._set('sT8X6inrZ', {'text': 'Three starting points, and a quote for anything else. Every session ends with a private gallery and an album. Prices include travel within [80 km] of [City].'})
    d.stack('sOther', 'gSPXJeRCl', 'vertical', align='center', gap='0px', padding='0px 32px 28px 32px', name='Other sessions', index=2)
    d.stack('othIn', 'sOther', 'horizontal', gap='40px', align='center', maxWidth='1136px', fill=tok('card'), radius='14px', padding='36px 44px', shadow='raised1', name='Other sessions panel')
    d.stack('othT', 'othIn', 'vertical', gap='8px', width='1fr', name='Other sessions text')
    d.text('othL', 'othT', 'Not on the list?', 'Note', 'seal', width='auto', rotation='-2')
    d.text('othH', 'othT', 'Engagements, maternity, newborns, birthdays, small events, brand portraits.', 'H3', 'cardFg', tag='h2')
    d.text('othB', 'othT', 'Tell us about the day and we reply within two days with a plan and a price. It still ends in an album.', 'Body', 'mutedFg')
    d.button('othBtn', 'othIn', 'Ask for a quote', 'primary', '/book', icon='arrow-right')
elif which == 'book':
    d._set('SG74Rg2i3', {'text': 'Weddings book about a year ahead; most other sessions a few weeks. Write even if your date is close; we often have a free morning.'})
    opts = [('wedding', 'Wedding'), ('engagement', 'Engagement'), ('family', 'Family'), ('maternity', 'Maternity or newborn'), ('portrait', 'Portrait'),
            ('event', 'Birthday or small event'), ('brand', 'Brand or business'), ('other', 'Something else')]
    a = {}
    for k, (val, title) in enumerate(opts):
        a[f'formSelectOptions.{k}.type'] = 'option'; a[f'formSelectOptions.{k}.value'] = val; a[f'formSelectOptions.{k}.title'] = title
    d._set('OdXg91tvF', a)
elif which == 'layout':
    d._set('mKFZCQfw4', {'text': 'Weddings, families, portraits and the days in between, in [City]. Every session ends in an album you can hold.'})
print(d.out())
