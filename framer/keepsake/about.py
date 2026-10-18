from common import *
P = json.load(open('/tmp/pa-keepsake-picks.json'))
IMG = json.load(open('/tmp/pa-keepsake-images.json')); flat = [x for v in IMG.values() for x in v]
U = lambda i: flat[i]['url']
out = []
# ---------------- About
ROOT = 'dDWa8bCSo'
d = D(); section = page(d, ROOT)
d.stack('abH', ROOT, 'vertical', align='center', gap='0px', padding='72px 32px 96px 32px', name='Hero')
d.stack('abHIn', 'abH', 'horizontal', gap='72px', align='center', maxWidth='1136px', name='Hero content')
d.frame('abArt', 'abHIn', name='Portrait', position='relative', width='420px', height='520px')
d.inst('abP', 'abArt', 'PhotoHolder', holder='polaroid', photo=P['about'], name='me, on a good day', tilt='-2', position='absolute', width='360px', left='20px', top='10px', right='null', bottom='null')
d.stack('abT', 'abHIn', 'vertical', gap='22px', width='1fr', name='Hero text')
d.text('abL', 'abT', 'About', 'Label', 'wood')
d.text('abHd', 'abT', 'Hello, I’m [Your Name].', 'Display', 'fg', tag='h1')
d.text('abB1', 'abT', 'I have photographed [140] weddings and more families than I can count, mostly in and around [City]. I came to photography through my grandmother’s albums, the kind with corners and tissue between the pages.', 'Lead', 'groundMuted')
d.text('abB2', 'abT', 'I still think a photograph is finished only when it is printed. So every session I shoot ends the same way: in an album you can hold, pass around and spill coffee on.', 'Body', 'groundMuted')
d.text('abSig', 'abT', '[Your Name]', 'Note', 'seal', width='auto', rotation='-4')
vin = section('abV', 'How I work', pad='0px 32px 96px 32px', gap='32px')
heading(d, 'abVH', vin, 'How I work', 'Three things I won’t change')
d.frame('abVG', vin, name='Principles', layout='grid', gridColumnCount='3', gridColumnMinWidth='300px', gridRowHeightType='auto', gridAlignment='start', gap='28px',
        position='relative', width='100%', height='auto')
for k, (t, b) in enumerate([('Slow sessions', 'Two hours for a family, a whole day for a wedding. Nobody relaxes in twenty minutes.'),
                             ('Very few poses', 'I give you somewhere to stand and something to do, then I wait. The waiting is the job.'),
                             ('Albums, not folders', 'A gallery link gets lost in an inbox. An album stays on the shelf and gets taken down at Christmas.')]):
    c = f'abV{k}'
    d.stack(c, 'abVG', 'vertical', gap='12px', width='1fr', height='1fr', fill=tok('card'), radius='8px', padding='28px', shadow='raised1', name=t)
    d.text(c + 'n', c, ['i.', 'ii.', 'iii.'][k], 'Note', 'seal')
    d.text(c + 't', c, t, 'H3', 'cardFg', tag='h3')
    d.text(c + 'b', c, b, 'Body', 'mutedFg')
gin = section('abG', 'Lately', pad='0px 32px 112px 32px', gap='28px')
heading(d, 'abGH', gin, 'Lately', 'Some favourites from this year')
d.stack('abGR', gin, 'horizontal', gap='36px', align='start', name='Favourites')
for k, (img, holder, tilt, name) in enumerate([(U(3), 'tape', '1', 'the first look'), (U(23), 'polaroid', '-2', 'little steps'), (U(40), 'corners', '0', 'caps off'), (U(9), 'polaroid', '2', 'the bouquet')]):
    d.inst(f'abG{k}', 'abGR', 'PhotoHolder', holder=holder, photo=img, name=name, tilt=tilt, width='1fr')
d.button('abCta', gin, 'Book a session', 'seal', '/book', 'lg')
out.append(d.out())
# ---------------- 404
ROOT = 'xqNxQWMli'
d = D(); section = page(d, ROOT)
d.stack('nf', ROOT, 'vertical', align='center', gap='0px', padding='96px 32px 128px 32px', name='Not found')
d.stack('nfIn', 'nf', 'horizontal', gap='72px', align='center', maxWidth='960px', name='Not found content')
d.frame('nfArt', 'nfIn', name='Fallen print', position='relative', width='380px', height='440px')
d.inst('nfP', 'nfArt', 'PhotoHolder', holder='pocket', photo=U(56), name='page 404', position='absolute', width='300px', left='40px', top='60px', right='null', bottom='null')
d.inst('nfP2', 'nfArt', 'PhotoHolder', holder='polaroid', photo=U(21), name='where did it go?', tilt='6', position='absolute', width='190px', left='190px', top='0px', right='null', bottom='null', zIndex='1', rotation='14')
d.stack('nfT', 'nfIn', 'vertical', gap='20px', width='1fr', name='Not found text')
d.text('nfL', 'nfT', 'Error 404', 'Label', 'wood')
d.text('nfH', 'nfT', 'This page slipped out of the album.', 'Display', 'fg', tag='h1')
d.text('nfB', 'nfT', 'It may have moved, or the link has a typo. The albums are all still here.', 'Lead', 'groundMuted')
d.stack('nfBtns', 'nfT', 'horizontal', gap='14px', align='center', name='Actions', stackWrapEnabled=True)
d.button('nfB1', 'nfBtns', 'Back to the start', 'primary', '/')
d.button('nfB2', 'nfBtns', 'See the albums', 'secondary', '/albums')
out.append(d.out())
# ---------------- Away (planned downtime / holiday page)
ROOT = 'I5LwHtpiu'
d = D(); section = page(d, ROOT)
d.stack('aw', ROOT, 'vertical', align='center', gap='0px', padding='112px 32px 144px 32px', name='Away')
d.stack('awIn', 'aw', 'vertical', gap='24px', align='center', maxWidth='640px', name='Away content')
d.inst('awP', 'awIn', 'PhotoHolder', holder='tape', photo=U(52), name='out on a shoot', tilt='-1', width='260px')
d.text('awL', 'awIn', 'Back soon', 'Label', 'wood', textAlignment='center')
d.text('awH', 'awIn', 'We’re out on a shoot.', 'Display', 'fg', tag='h1', textAlignment='center')
d.text('awB', 'awIn', 'The studio is closed until [date]. Bookings and album orders open again then, and every message gets an answer the week we are back.', 'Lead', 'groundMuted', textAlignment='center')
d.button('awBtn', 'awIn', 'Write to [hello@studio.com]', 'secondary', 'mailto:hello@studio.com')
out.append(d.out())
# merge: all creates, then all sets
c = '\n'.join(o.split('\n---\n')[0] for o in out); s = '\n'.join(o.split('\n---\n')[1] for o in out)
print(c + '\n---\n' + s)
