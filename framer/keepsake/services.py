from common import *
ROOT = 'gSPXJeRCl'
d = D(); section = page(d, ROOT)
hin = section('sHead', 'Header', pad='72px 32px 48px 32px', gap='20px')
heading(d, 'sH', hin, 'Services & prices', 'Ways to spend a day with us.', 'Three starting points, and a quote for anything else. Every session ends with a private gallery and an album. Prices include travel within [80 km] of [City].', preset='Display', tag='h1')
pin = section('sPacks', 'Packages', pad='16px 32px 88px 32px', gap='0px')
d.frame('pList', pin, name='Packages', layout='grid', gridColumnCount='3', gridColumnMinWidth='300px', gridRowHeightType='auto', gridAlignment='start', gap='28px',
        position='relative', width='100%', height='auto', **{'collectionList.collection': 'Packages', 'collectionList.repeatedDescendantId': 'pItem'})
d.stack('pItem', 'pList', 'vertical', gap='22px', width='1fr', height='1fr', fill=tok('card'), radius='8px', padding='32px 28px', shadow='raised1', name='Package')
d.stack('pTop', 'pItem', 'horizontal', align='center', dist='space-between', name='Name row')
d.text('pName', 'pTop', v(PK['name']), 'H3', 'cardFg', width='auto', tag='h2')
d.stack('pBadge', 'pTop', 'horizontal', align='center', width='auto', padding='4px 10px', radius='999px', fill=tok('seal'), name='Most booked', visible=v(PK['hi']))
d.text('pBadgeT', 'pBadge', 'Most booked', 'Caption', 'onSeal', width='auto')
d.stack('pPrice', 'pItem', 'horizontal', gap='8px', align='end', name='Price')
d.text('pUnit', 'pPrice', v(PK['unit']), 'Small', 'mutedFg', width='auto')
d.text('pNum', 'pPrice', v(PK['price']), 'Display', 'cardFg', width='auto')
d.text('pBlurb', 'pItem', v(PK['blurb']), 'Body', 'mutedFg')
d.stack('pIncl', 'pItem', 'vertical', gap='10px', name='Includes', padding='18px 0px 0px 0px', shadow=[f'inset 0px 1px 0px 0px {tok("border")}'])
d.stack('pRow', 'pIncl', 'horizontal', gap='10px', align='center', name='Included', **{'repeat.variable': v(PK['incl'])})
d.text('pTick', 'pRow', '✓', 'Ui', 'success', width='auto')
d.text('pRowT', 'pRow', 'var(--variable-xExVBRiPH)', 'Ui', 'cardFg')
d.stack('pSpacer', 'pItem', 'vertical', height='1fr', name='Spacer')
d.button('pBtn', 'pItem', 'Book this session', 'primary', '/book', fullWidth='true', width='100%')
# album add-on band
ain = section('sAdd', 'Album add-on', pad='0px 32px 88px 32px', gap='0px')
d.stack('addIn', ain, 'horizontal', gap='40px', align='center', fill=tok('muted'), radius='14px', padding='36px 44px', shadow='sunken', name='Add-on panel')
d.stack('addT', 'addIn', 'vertical', gap='8px', width='1fr', name='Add-on text')
d.text('addH', 'addT', 'Already have photographs?', 'H3', 'cardFg', tag='h2')
d.text('addB', 'addT', 'We bind albums from any photographs, from last summer or from 1974. Choose the size, cover and pages, and we design the sequence with you.', 'Body', 'mutedFg')
d.button('addBtn', 'addIn', 'Design an album', 'secondary', '/printed-albums', icon='arrow-right')
# faq
fin = section('sFaq', 'Questions', pad='0px 32px 112px 32px', gap='28px')
d.stack('faqCols', fin, 'horizontal', gap='64px', align='start', name='Questions layout')
d.stack('faqL', 'faqCols', 'vertical', gap='12px', width='340px', name='Questions heading')
d.text('faqLab', 'faqL', 'Questions', 'Label', 'wood')
d.text('faqT', 'faqL', 'Before you book', 'H2', 'fg', tag='h2')
d.text('faqS', 'faqL', 'Anything else? Write to [hello@studio.com] and we answer within two days.', 'Body', 'groundMuted')
faqs = [('How soon will we see the photographs?', 'A first look within [3 days], the full gallery within [3 weeks] for weddings and [10 days] for families and portraits.'),
        ('Can we choose which photos go in the album?', 'Yes. We send a first sequence and you move, swap or remove prints until it reads the way you remember the day.'),
        ('Do you travel?', 'Travel within [80 km] of [City] is included. Further afield we quote train or flight and one night of accommodation.'),
        ('What if it rains?', 'We plan an indoor and an outdoor route for every session. Some of our favourite photographs were taken under umbrellas.'),
        ('How do we hold the date?', 'A [30%] deposit holds the date; the rest is due two weeks before the session.')]
d.inst('faqAcc', 'faqCols', 'Accordion', width='1fr', items=json.dumps([{'question': a, 'answer': b} for a, b in faqs]), openFirst='true', oneAtATime='false',
       question=tok('fg'), answer=tok('groundMuted'), well=tok('muted'), rule=tok('border'),
       questionFont=json.dumps({'fontSelector': 'GF;Instrument Sans-600', 'fontSize': '16px', 'letterSpacing': [0, 'em'], 'lineHeight': [1.4, 'em']}),
       answerFont=json.dumps({'fontSelector': 'GF;Instrument Sans-regular', 'fontSize': '15px', 'letterSpacing': [0, 'em'], 'lineHeight': [1.65, 'em']}))
print(d.out())
