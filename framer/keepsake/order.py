from common import *
P = json.load(open('/tmp/pa-keepsake-picks.json'))
ROOT = 'P_tDqwAqQ'
d = D(); section = page(d, ROOT)
# hero
d.stack('oHero', ROOT, 'vertical', align='center', gap='0px', padding='72px 32px 88px 32px', name='Hero')
d.stack('oHeroIn', 'oHero', 'horizontal', gap='64px', align='center', maxWidth='1136px', name='Hero content')
d.stack('oHeroT', 'oHeroIn', 'vertical', gap='24px', width='1fr', name='Hero text')
d.text('oLab', 'oHeroT', 'Printed albums', 'Label', 'wood')
d.text('oH', 'oHeroT', 'The only thing in the house that remembers every face.', 'Display', 'fg', tag='h1')
d.text('oP', 'oHeroT', 'Linen covers, archival cotton pages, stitched by hand and laid flat. Made from a session with us or from the photographs already on your phone.', 'Lead', 'groundMuted')
d.stack('oPrice', 'oHeroT', 'horizontal', gap='12px', align='center', name='From price')
d.text('oPriceT', 'oPrice', 'from $280', 'Note', 'seal', width='auto', rotation='-3')
d.text('oPriceS', 'oPrice', 'including design and shipping', 'Small', 'groundMuted', width='auto')
d.frame('oArt', 'oHeroIn', name='Album photos', position='relative', width='500px', height='520px')
d.inst('oA1', 'oArt', 'PhotoHolder', holder='slits', photo=P['product'][0], ratio='4 / 5', position='absolute', width='300px', left='0px', top='0px', right='null', bottom='null', hoverMotion='false')
d.inst('oA2', 'oArt', 'PhotoHolder', holder='polaroid', photo=P['product'][3], name='the heirloom box', tilt='3', position='absolute', width='240px', left='250px', top='210px', right='null', bottom='null', zIndex='1')
# steps
sin = section('oSteps', 'How it works', pad='0px 32px 88px 32px', gap='32px')
heading(d, 'oStH', sin, 'How it works', 'Four weeks from the first call to the parcel')
d.frame('oStG', sin, name='Steps', layout='grid', gridColumnCount='4', gridColumnMinWidth='220px', gridRowHeightType='auto', gridAlignment='start', gap='20px',
        position='relative', width='100%', height='auto')
steps = [('Choose', 'Pick the size, the cover and how many pages. Not sure? Start with a 30-page linen album.'),
         ('Send', 'Book a session, or send us the photographs you already have. Up to 400 files.'),
         ('We design', 'We lay out a first sequence and send it as a flip-through. You move, swap and remove prints.'),
         ('You hold it', 'Printed on cotton rag, stitched, pressed for two days and posted in a linen box.')]
for k, (t, b) in enumerate(steps):
    c = f'oSt{k}'
    d.stack(c, 'oStG', 'vertical', gap='10px', width='1fr', height='1fr', fill=tok('print'), radius='2px', padding='24px', shadow='print', name=t, rotation=str([-1, 0.8, -0.6, 1][k]))
    d.text(c + 'n', c, f'{k + 1}', 'Note', 'seal')
    d.text(c + 't', c, t, 'H4', 'printInk', tag='h3')
    d.text(c + 'b', c, b, 'Small', 'mutedFg')
# form
fin = section('oForm', 'Design your album', pad='0px 32px 112px 32px', gap='0px', scrollTargetEnabled=True, elementId='design')
d.stack('oFCols', fin, 'horizontal', gap='56px', align='start', name='Form layout')
d.stack('oFL', 'oFCols', 'vertical', gap='18px', width='360px', name='Form intro', position='sticky', top='100px')
d.text('oFLl', 'oFL', 'Design your album', 'Label', 'wood')
d.text('oFLh', 'oFL', 'Tell us what you have in mind', 'H2', 'fg', tag='h2')
d.text('oFLp', 'oFL', 'This is not a checkout. We reply with a quote, a first layout and a time to talk it through.', 'Body', 'groundMuted')
d.stack('oPrices', 'oFL', 'vertical', gap='0px', fill=tok('card'), radius='8px', padding='8px 20px', shadow='raised1', name='Price list')
for k, (a, b) in enumerate([('20 × 25 cm, 30 pages', '$280'), ('24 × 30 cm, 50 pages', '$420'), ('30 × 30 cm, 80 pages', '$640'), ('Each extra 10 pages', '$45')]):
    r = f'opr{k}'
    d.stack(r, 'oPrices', 'horizontal', align='center', dist='space-between', padding='12px 0px', name=a, shadow=[f'inset 0px -1px 0px 0px {tok("border")}'] if k < 3 else [])
    d.text(r + 'a', r, a, 'Small', 'cardFg', width='auto')
    d.text(r + 'b', r, b, 'Small', 'cardFg', width='auto', openTypeFontFeatures__tnum='on')
d.stack('oFrm', 'oFCols', 'vertical', gap='28px', width='1fr', htmlTag='form', fill=tok('card'), radius='14px', padding='40px', shadow='raised2', name='Album form')
choices(d, 'fSize', 'oFrm', 'Size', 'size', [('20x25', '20 × 25 cm', 'portrait, from $280'), ('24x30', '24 × 30 cm', 'landscape, from $420'), ('30x30', '30 × 30 cm', 'square, from $640')])
choices(d, 'fCover', 'oFrm', 'Cover', 'cover', [('linen-sand', 'Sand linen', 'warm, light'), ('linen-walnut', 'Walnut linen', 'deep brown'), ('leather', 'Leather', '+ $90')])
d.stack('fRow1', 'oFrm', 'horizontal', gap='16px', align='start', name='Pages and names')
field(d, 'fPages', 'fRow1', 'Pages', 'select', 'pages', options=[('30', '30 pages'), ('50', '50 pages'), ('80', '80 pages'), ('100', '100 pages')])
field(d, 'fNames', 'fRow1', 'Names on the cover', 'text', 'cover_names', 'Mara & Theo, June 2026')
choices(d, 'fSrc', 'oFrm', 'Photographs', 'source', [('session', 'From a session with you', None), ('mine', 'My own photographs', None)], cols=2)
d.stack('fRow2', 'oFrm', 'horizontal', gap='16px', align='start', name='Contact')
field(d, 'fName', 'fRow2', 'Your name', 'text', 'name', 'Ada Okafor', required=True)
field(d, 'fEmail', 'fRow2', 'Email', 'text', 'email', 'you@example.com', required=True, ttype='email')
field(d, 'fMsg', 'oFrm', 'Anything we should know?', 'text', 'message', 'A gift? A deadline? A box of old prints?', ttype='textarea')
d.stack('fFoot', 'oFrm', 'horizontal', gap='16px', align='center', name='Submit row')
submit(d, 'fSubmit', 'fFoot', 'Request a quote')
d.text('fFootN', 'fFoot', 'We reply within two days.', 'Caption', 'mutedFg')
d.raw('SET oFrm formSubmitButtonId="fSubmit";')
print(d.out().replace('openTypeFontFeatures__tnum', 'openTypeFontFeatures.tnum'))
