# Product shots of the albums are plain images: no paper corners, tape or polaroid frame, since they show the
# product and not one of the photographs. Usage: python3 prodimg.py home|order > x.dsl
from common import *
d = D(); w = sys.argv[1]
U1 = 'https://framerusercontent.com/images/mcHoFd2x6SKwxR7SCiN13yjo8ww.jpg'
if w == 'home':
    BP = {'T': 'aWOL2xvI_', 'P': 'QJ8uOwmU9'}
    # id, old holder, parent, image, alt, desktop (w, h, left, top), phone (w, h, left, top)
    shots = [('albI1', 'IcDou5dqX', 'vYOva4Jrz', U1, 'An open linen album on a wooden table', (330, 330, 0, 0), (240, 240, 0, 0)),
             ('albI2', 'BsGhlyw4A', 'vYOva4Jrz', 'https://framerusercontent.com/images/cQUSBZsmt8zNGL1UrWZM8PjAMVc.jpg', 'The stitched spine of a linen album', (190, 238, 250, 182), (140, 175, 180, 145))]
else:
    BP = {'T': 'q_c7uLd4v', 'P': 'dXmMSmSI8'}
    shots = [('oI1', 'RiAXWoHhZ', 'gTFKcBN3s', U1, 'An open linen album on a wooden table', (300, 375, 0, 0), (210, 263, 0, 0)),
             ('oI2', 'THnsccLPt', 'gTFKcBN3s', 'https://framerusercontent.com/images/Ua1dcPb7jTdd6xftpswanMNL8s.jpg', 'An album in its heirloom box', (240, 300, 250, 210), (165, 206, 170, 150))]
for k, (i, old, parent, img, alt, dk, ph) in enumerate(shots):
    d.frame(i, parent, index=k, name='Album photo', fill=img, altText=alt, radius='8px', shadow=['0px 1px 2px 0px rgba(40, 24, 10, 0.12)', '0px 14px 30px 0px rgba(40, 24, 10, 0.18)'], position='absolute',
            width=f'{dk[0]}px', height=f'{dk[1]}px', left=f'{dk[2]}px', top=f'{dk[3]}px', right='null', bottom='null', **({'zIndex': '1'} if k else {}))
    d.raw(f'SET {BP["P"]}+{i} width="{ph[0]}px" height="{ph[1]}px" left="{ph[2]}px" top="{ph[3]}px";')
    d.raw(f'DEL {old};')
# side by side, never overlapping, so every product shot can be seen whole (sizes as applied: 2 × 1fr at 300px high
# on Home, 310px on Printed albums, 200px on Phone, with a 16px gap; see the commit for the exact SETs)
print(d.out())
