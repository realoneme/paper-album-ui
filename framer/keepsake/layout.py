import sys; sys.path.insert(0, '.')
from b import *
# phase 1: scopes and primary frames only; phase 2: everything inside; phase 3: styles that need the scopes
p1 = ['+LinkStylePresetNode navLink name="Paper/Nav Link";', '+LinkStylePresetNode footLink name="Paper/Footer Link";',
      '+ComponentNode nav name="Paper/Nav";', '+FrameNode navD parent="nav";', '+LayoutTemplateNode lt name="Main";']
d = D()
d._set('navLink', {'link.textColor': tok('fg'), 'link.textDecoration': 'none', 'link.hover.textColor': tok('fg'), 'link.hover.textDecoration': 'underline',
       'link.hover.textDecorationColor': tok('wood'), 'link.hover.textDecorationThickness': '2px', 'link.hover.textDecorationOffset': '6px',
       'link.current.textDecoration': 'underline', 'link.current.textDecorationColor': tok('seal'), 'link.current.textDecorationThickness': '2px',
       'link.current.textDecorationOffset': '6px', 'link.transition': 'tween ease 0.2s 0s'})
d._set('footLink', {'link.textColor': tok('primaryFg'), 'link.textDecoration': 'none', 'link.hover.textColor': tok('glow'), 'link.transition': 'tween ease 0.2s 0s'})
d._set('navD', dict(name='Desktop', layout='stack', stackDirection='vertical', stackDistribution='start', stackAlignment='center', padding='14px 32px',
       width='1200px', height='auto', fill=tok('bg'), shadow=[f'0px 1px 0px 0px {tok("border")}']))
d.stack('navIn', 'navD', 'horizontal', align='center', dist='space-between', maxWidth='1136px', name='Nav content')
d.stack('brand', 'navIn', 'horizontal', gap='10px', align='center', width='auto', name='Brand', **{'link.href': '/'})
d.text('brandT', 'brand', '[Studio Name]', 'H4', 'fg', width='auto')
d.text('brandN', 'brand', 'photographs & albums', 'Note Sm', 'wood', width='auto', rotation='-3')
d.stack('links', 'navIn', 'horizontal', gap='28px', align='center', width='auto', name='Links')
for i, (lab, href) in enumerate([('Albums', '/albums'), ('Services', '/services'), ('Printed albums', '/printed-albums'), ('About', '/about')]):
    d.text(f'lk{i}', 'links', lab, 'Ui', 'fg', width='auto', linkStylePreset='Paper/Nav Link', **{'link.href': href})
d.button('navBook', 'links', 'Book a session', 'seal', '/book', 'sm')
# layout template primary
d._set('lt-primary-variant', dict(fill=tok('bg'), layout='stack', stackDirection='vertical', stackDistribution='start', stackAlignment='center', gap='0px',
       overflow='clip', width='1200px', height='auto'))
d.raw('+ComponentInstanceNode navI component="nav" parent="lt-primary-variant" index="0";', 'c')
d._set('navI', {'position': 'sticky', 'top': '0px', 'zIndex': '5', 'width': '100%', 'height': 'auto'})
# footer
d.stack('foot', 'lt-primary-variant', 'vertical', align='center', gap='0px', fill=tok('primary'), padding='64px 32px 28px 32px', name='Footer', shadow='layer')
d.stack('footIn', 'foot', 'vertical', gap='40px', maxWidth='1136px', name='Footer content')
d.stack('footTop', 'footIn', 'horizontal', gap='48px', align='start', name='Footer columns')
d.stack('fBrand', 'footTop', 'vertical', gap='12px', width='1fr', name='Footer brand')
d.text('fBrandT', 'fBrand', '[Studio Name]', 'H3', 'primaryFg')
d.text('fBrandS', 'fBrand', 'Weddings, families, portraits and the days in between, in [City]. Every session ends in an album you can hold.', 'Body', 'primaryFg', opacity='0.8')
cols = [('Visit', [('Albums', '/albums'), ('Services', '/services'), ('Printed albums', '/printed-albums'), ('About', '/about')]),
        ('Book', [('Book a session', '/book'), ('[hello@studio.com]', 'mailto:hello@studio.com'), ('[+1 555 0100]', 'tel:+15550100')]),
        ('Follow', [('Instagram', 'https://instagram.com/'), ('Pinterest', 'https://pinterest.com/')])]
for c, (title, links) in enumerate(cols):
    d.stack(f'fc{c}', 'footTop', 'vertical', gap='10px', width='auto', name=f'Footer {title}')
    d.text(f'fc{c}t', f'fc{c}', title, 'Label', 'glow', width='auto')
    for k, (lab, href) in enumerate(links):
        d.text(f'fc{c}l{k}', f'fc{c}', lab, 'Small', 'primaryFg', width='auto', linkStylePreset='Paper/Footer Link', **{'link.href': href})
d.stack('footBot', 'footIn', 'horizontal', align='center', dist='space-between', name='Footer base', padding='20px 0px 0px 0px',
        shadow=[f'inset 0px 1px 0px 0px rgba(246, 238, 219, 0.18)'])
d.text('fCopy', 'footBot', '© 2026 [Studio Name]. All photographs belong to their families.', 'Caption', 'primaryFg', width='auto', opacity='0.7')
d.text('fMade', 'footBot', 'Keepsake template', 'Note Sm', 'glow', width='auto')
out = d.out().split('\n---\n')
print('\n'.join(p1)); print('---'); print(out[0]); print('---'); print(out[1])
