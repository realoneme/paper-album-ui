import sys, json; sys.path.insert(0, '.')
from b import *
A = {'title': 'zJEWLHBBE', 'slug': 'O6k2d8_BE', 'cat': 'Er2jyU3x5', 'cover': 'rk3DzAeiK', 'place': 'oZ6ubwihV', 'date': 'GjB0dR8Nz', 'excerpt': 'R3G6kV02Z',
     'note': 'udarXrdyu', 'feat': 'qCj692r_7', 'photos': 'aXFiW4gQc', 'photo': 'tHXaY3j0w', 'caption': 'Dck7CCRQN', 'story': 'RolSqqd9q'}
PK = {'name': 'E74dCwxNG', 'price': 'YHYbUvUL7', 'unit': 'AwuJoDwxt', 'blurb': 'StkU1LtR6', 'incl': 'lsMIsSDck', 'hi': 'Ml46rQMjr'}
v = lambda k: f'var(--variable-{k})'
def page(d, root):
    def section(i, name, pad='96px 32px', gap='40px', **a):
        d.stack(i, root, 'vertical', align='center', gap='0px', padding=pad, name=name, **a)
        return d.stack(i + 'In', i, 'vertical', gap=gap, maxWidth='1136px', name=name + ' content')
    return section
def heading(d, i, parent, label, title, sub=None, preset='H2', tag='h2', align='start', color='fg', sub_color='groundMuted'):
    d.stack(i, parent, 'vertical', gap='12px', align=align, name='Heading')
    if label: d.text(i + 'L', i, label, 'Label', 'wood', textAlignment='center' if align == 'center' else 'start')
    d.text(i + 'T', i, title, preset, color, tag=tag, textAlignment='center' if align == 'center' else 'start')
    if sub: d.text(i + 'S', i, sub, 'Lead', sub_color, textAlignment='center' if align == 'center' else 'start')

SUBMIT = 'GFITeRpJF'
SUBV = {'pending': 'IfJDs41jX', 'success': 'PnNT8NU69', 'error': 'bJQx2k9PH', 'incomplete': 'M4nY42QP5'}
INPUT = dict(fill=tok('muted'), radius='6px', padding='12px 16px', width='100%', fontName='Instrument Sans', fontWeight='400', fontSize='15px',
             textColor=tok('cardFg'), formInputPlaceholderColor=tok('mutedFg'), formInputFocusedFill=tok('card'),
             formInputFocusedBorderEnabled='true', formInputFocusedBorderWidth='2px', formInputFocusedBorderStyle='solid', formInputFocusedBorderColor=tok('glow'),
             shadow='sunken')
def field(d, i, parent, label, kind='text', name=None, ph='', required=False, ttype='text', options=(), width='1fr', height='48px'):
    d.stack(i, parent, 'vertical', gap='8px', width=width, htmlTag='label', name=label)
    d.text(i + 'L', i, label + (' *' if required else ''), 'Small', 'cardFg')
    node = 'FormSelectNode' if kind == 'select' else 'FormPlainTextInputNode'
    d.c.append(f'+{node} {i}I parent="{i}";')
    a = dict(INPUT, position='relative', height=height if ttype != 'textarea' else '140px', formInputName=name or label.lower().replace(' ', '_'), formInputRequired='true' if required else 'false')
    if kind == 'select':
        a.pop('formInputPlaceholderColor')
        for k, (val, title) in enumerate(options):
            a[f'formSelectOptions.{k}.type'] = 'option'; a[f'formSelectOptions.{k}.value'] = val; a[f'formSelectOptions.{k}.title'] = title
    else:
        a['formTextInputType'] = ttype; a['formInputPlaceholder'] = ph
        if ttype == 'textarea': a['formTextAreaResizable'] = 'true'
    d._set(i + 'I', a)
def choices(d, i, parent, label, name, opts, cols=3, required=True):
    d.stack(i, parent, 'vertical', gap='10px', name=label)
    d.text(i + 'L', i, label + (' *' if required else ''), 'Small', 'cardFg')
    d.frame(i + 'G', i, name='Options', layout='grid', gridColumnCount=str(cols), gridColumnMinWidth='150px', gridRowHeightType='auto', gridAlignment='start', gap='12px',
            position='relative', width='100%', height='auto')
    for k, (val, title, sub) in enumerate(opts):
        o = f'{i}o{k}'
        d.stack(o, i + 'G', 'horizontal', gap='12px', align='start', width='1fr', height='1fr', htmlTag='label', fill=tok('card'), radius='6px', padding='14px 16px', cursor='pointer',
                shadow=[f'inset 0px 0px 0px 1px {tok("border")}'], name=title)
        d.c.append(f'+FormBooleanInputNode {o}R parent="{o}";')
        d._set(o + 'R', dict(formBooleanInputType='radio', formInputName=name, formInputValue=val, formInputRequired='true' if required else 'false', formBooleanInputValue='true' if k == 0 else 'false',
               position='relative', width='20px', height='20px', radius='999px', fill=tok('muted'), shadow='sunken', formInputCheckedFill=tok('primary'),
               formInputCheckedBorderEnabled='true', formInputCheckedBorderWidth='5px', formInputCheckedBorderStyle='solid', formInputCheckedBorderColor=tok('muted')))
        d.stack(o + 'T', o, 'vertical', gap='2px', width='1fr', name='Text')
        d.text(o + 'Tt', o + 'T', title, 'Ui', 'cardFg')
        if sub: d.text(o + 'Ts', o + 'T', sub, 'Caption', 'mutedFg')
def submit(d, i, form, label):
    d.c.append(f'+ComponentInstanceNode {i} component="{SUBMIT}" parent="{form}";')
    d._set(i, {'$control__label': label, 'position': 'relative', 'width': 'auto', 'height': 'auto', 'formButtonPendingVariant': SUBV['pending'],
               'formButtonSuccessVariant': SUBV['success'], 'formButtonErrorVariant': SUBV['error'], 'formButtonIncompleteVariant': SUBV['incomplete']})
