from common import *
L = json.load(open('./ids-layout.json'))
d = D()
navD, navIn = L['navD'], L['navIn']
d.stack('menuBtn', navIn, 'horizontal', gap='8px', align='center', width='auto', padding='8px 14px', radius='999px', fill=tok('card'), cursor='pointer',
        shadow=[f'inset 0px 0px 0px 1px {tok("border")}', f'0px 2px 0px 0px {tok("border")}'], name='Menu button', visible='false')
d.text('menuBtnT', 'menuBtn', 'Menu', 'Ui', 'cardFg', width='auto')
d.stack('drawer', navD, 'vertical', gap='2px', name='Drawer', padding='12px 0px 8px 0px', visible='false')
for k, (lab, href) in enumerate([('Albums', '/albums'), ('Services', '/services'), ('Printed albums', '/printed-albums'), ('About', '/about')]):
    d.stack(f'dr{k}', 'drawer', 'horizontal', align='center', padding='12px 0px', name=lab, shadow=[f'inset 0px -1px 0px 0px {tok("border")}'])
    d.text(f'dr{k}t', f'dr{k}', lab, 'H4', 'fg', linkStylePreset='Paper/Nav Link', **{'link.href': href})
d.stack('drBook', 'drawer', 'vertical', gap='0px', name='Book row', padding='16px 0px 4px 0px')
d.button('drBookB', 'drBook', 'Book a session', 'seal', '/book', fullWidth='true', width='100%')
c, s = d.out().split('\n---\n')
print(c); print('---'); print(s)
print('---')
print(f'CREATE_VARIANT navP from="{navD}";'); print(f'CREATE_VARIANT navO from="{navD}";')
print('---')
print(f'SET navP name="Phone" width="390px" left="1300px" top="0px" padding="12px 20px";')
print(f'SET navO name="Phone Open" width="390px" left="1760px" top="0px" padding="12px 20px";')
for v in ('navP', 'navO'):
    print(f'SET {v}+{L["links"]} visible="false";')
    print(f'SET {v}+{L["brandN"]} visible="false";')
    print(f'SET {v}+menuBtn visible="true";')
print('SET navP+menuBtn onTap.0.action="SET_VARIANT" onTap.0.controls.variant="navO";')
print('SET navO+menuBtn onTap.0.action="SET_VARIANT" onTap.0.controls.variant="navP";')
print('SET navO+menuBtnT text="Close";')
print('SET navO+drawer visible="true";')
# Later: the drawer stays in the layout, collapsed in Phone (height 0, opacity 0, clipped, no padding) and open in
# Phone Open; both variants animate with transition="spring-duration 0.42s 0.12 0s". Every drawer link, the Book
# button row and the brand set the variant back to Phone, so the menu closes when a page is chosen:
#   SET <Phone Open>+<row> onTap.0.action="SET_VARIANT" onTap.0.controls.variant="<Phone>";
