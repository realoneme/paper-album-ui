from common import *
p1 = ['+ComponentNode sub name="Paper/Submit";', '+FrameNode subD parent="sub";']
d = D()
d._set('subD', dict(name='Default', htmlTag='button', layout='stack', stackDirection='horizontal', stackDistribution='center', stackAlignment='center', gap='8px',
       padding='0px 24px', width='auto', height='48px', radius='6px', fill=tok('primary'), cursor='pointer', left='0px', top='0px',
       shadow=[f'0px 3px 0px 0px {tok("edge")}', '0px 8px 16px 0px rgba(40, 24, 10, 0.25)'],
       **{'hoverEffect.y': '-1px', 'hoverEffect.scale': '1', 'hoverEffect.transition': 'spring-duration 0.15s 0 0s',
          'tapEffect.y': '2px', 'tapEffect.scale': '1', 'tapEffect.shadow': f'0px 3px 0px 0px {tok("edge")}', 'tapEffect.transition': 'spring-duration 0.08s 0 0s'}))
d.raw('+Variable subLabel name="Label" type="string" scope="sub" initialValue="Send";', 'c')
d.text('subT', 'subD', 'var(--variable-subLabel)', 'Ui', 'primaryFg', width='auto')
p3 = []
for vid, name, left, label, fill, col in [('subP', 'Pending', 260, 'Sending…', 'primary', 'primaryFg'), ('subS', 'Success', 520, 'Sent. We’ll write within two days.', 'success', 'primaryFg'),
                                          ('subE', 'Error', 900, 'Something went wrong. Try again?', 'destructive', 'destructiveFg'), ('subI', 'Incomplete', 1260, 'Fill in the fields marked *', 'muted', 'mutedFg')]:
    p3.append(f'CREATE_VARIANT {vid} from="subD";')
    p3.append(f'SET {vid} name="{name}" left="{left}px" top="0px" fill="{tok(fill)}"' + (' boxShadows.0="null" boxShadows.1="null"' if name == 'Incomplete' else '') + ';')
    p3.append(f'SET {vid}+subT text={q(label)} textColor="{tok(col)}";')
out = d.out().split('\n---\n')
print('\n'.join(p1)); print('---'); print(out[0]); print('---'); print(out[1]); print('---'); print('\n'.join(p3))
