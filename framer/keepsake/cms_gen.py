import json
d = json.load(open('/tmp/pa-keepsake-images.json'))
flat = [x for v in d.values() for x in v]
U = lambda i: flat[i]['url'].replace('w=1600', 'w=2000')
json.dump({'hero': U(57), 'about': U(52), 'product': [U(44), U(46), U(51), U(49)], 'avatars': [U(53), U(42), U(39)]}, open('/tmp/pa-keepsake-picks.json', 'w'), indent=1)
q = lambda s: '"' + str(s).replace('\\', '\\\\').replace('"', '\\"') + '"'
L = []
add = L.append
# --- Albums
add('+CollectionNode albums name="Albums";')
add('+Variable aTitle name="Title" type="string" scope="albums";')
add('+OptionVariable aCat name="Category" scope="albums" cases="[\\"Wedding\\",\\"Family\\",\\"Portrait\\"]" initialValue="Wedding";')
add('+Variable aCover name="Cover" type="image" scope="albums";')
add('+Variable aPlace name="Place" type="string" scope="albums";')
add('+DateVariable aDate name="Date" scope="albums";')
add('+Variable aExcerpt name="Excerpt" type="string" scope="albums";')
add('+Variable aNote name="Handwritten note" type="string" scope="albums";')
add('+Variable aFeat name="Featured" type="boolean" scope="albums" initialValue="false";')
add('+ArrayVariable aPhotos name="Photos" scope="albums" items.0.type="image" items.0.name="Photo" items.1.type="string" items.1.name="Caption";')
add('+Variable aStory name="Story" type="richtext" scope="albums";')
albums = [
 ('Mara & Theo', 'Wedding', 1, 'Lake Como, Italy', '2026-06-14', 'A lakeside ceremony, a rainstorm at dinner and dancing until the boats stopped running.', 'the rain was the best part', True, [0, 3, 8, 12]),
 ('Ines & Sam', 'Wedding', 2, 'Woodstock, Vermont', '2026-09-20', 'A barn wedding in the first cold week of autumn, with cider and forty guests.', 'cider, wool and a barn', True, [5, 9, 13, 15]),
 ('The Okafors', 'Family', 16, 'Hampstead Heath, London', '2026-05-03', 'A Sunday picnic that turned into a three-hour game of tag.', 'nobody won the game', True, [20, 22, 23, 21]),
 ('Three generations', 'Family', 30, 'Kyoto, Japan', '2026-04-08', 'Grandparents, parents and the youngest Sato in the garden where it all started.', 'the garden, again', False, [29, 28, 30, 21]),
 ('Lena', 'Portrait', 35, 'Lisbon, Portugal', '2026-07-22', 'Late light through a tall window in Alfama, for a book jacket.', 'golden hour, top floor', False, [35, 42, 34]),
 ('Class of 2026', 'Portrait', 40, 'Ann Arbor, Michigan', '2026-05-30', 'Graduation portraits on campus the morning after the ceremony.', 'caps off, finally', False, [40, 41, 43]),
]
story = [
 ('p', 'We met on the terrace the evening before, walked the route from the chapel to the water and decided where everyone would stand when the light dropped behind the hills.'),
 ('h2', 'The day'),
 ('p', 'The ceremony was short and full of laughter. When the storm rolled in over dinner, nobody went inside; the band played under the awning and the photographs from that hour are the ones they framed.'),
 ('h2', 'The album'),
 ('p', 'Eighty pages, linen cover, printed on cotton rag. We chose the sequence together over two calls, one print at a time.'),
]
for n, (title, cat, cover, place, date, ex, note, feat, photos) in enumerate(albums):
    i = f'al{n}'
    add(f'+CollectionItemNode {i} parent="albums" index="{n}";')
L.append('---')
for n, (title, cat, cover, place, date, ex, note, feat, photos) in enumerate(albums):
    i = f'al{n}'
    parts = [f'$control__aTitle={q(title)}', f'$control__aCat={q(cat)}', f'$control__aCover={q(U(cover))}', f'$control__aPlace={q(place)}',
             f'$control__aDate={q(date)}', f'$control__aExcerpt={q(ex)}', f'$control__aNote={q(note)}', f'$control__aFeat={q("true" if feat else "false")}']
    for k, p in enumerate(photos):
        parts.append(f'$control__aPhotos.{k}.Photo={q(U(p))}')
        parts.append(f'$control__aPhotos.{k}.Caption={q(flat[p]["alt"].capitalize())}')
    add(f'SET {i} ' + ' '.join(parts) + ';')
    for k, (tag, text) in enumerate(story):
        add(f'+TextBlock {i}s{k} parent="{i}/aStory" tag="{tag}";')
L.append('---')
for n in range(len(albums)):
    for k, (tag, text) in enumerate(story):
        add(f'SET al{n}s{k} text={q(text)};')
# --- Testimonials
add('+CollectionNode quotes name="Testimonials";')
add('+Variable tQuote name="Quote" type="string" scope="quotes";')
add('+Variable tName name="Name" type="string" scope="quotes";')
add('+Variable tSession name="Session" type="string" scope="quotes";')
add('+Variable tPhoto name="Photo" type="image" scope="quotes";')
picks = json.load(open('/tmp/pa-keepsake-picks.json'))
quotes = [('We cried at the album more than at the wedding. Every page is a moment we had forgotten we lived.', 'Mara and Theo', 'Wedding, Lake Como'),
          ('Our kids forgot the camera was there after five minutes. That is the whole trick, and [Studio Name] has it.', 'Ada Okafor', 'Family session, London'),
          ('I needed one photo for a book jacket and left with a portrait my mother has on her wall.', 'Lena Duarte', 'Portrait, Lisbon')]
for n, _ in enumerate(quotes): add(f'+CollectionItemNode tq{n} parent="quotes" index="{n}";')
L.append('---')
for n, (qt, nm, ss) in enumerate(quotes):
    add(f'SET tq{n} $control__tQuote={q(qt)} $control__tName={q(nm)} $control__tSession={q(ss)} $control__tPhoto={q(picks["avatars"][n])};')
# --- Packages
add('+CollectionNode packs name="Packages";')
add('+Variable pName name="Name" type="string" scope="packs";')
add('+Variable pPrice name="Price" type="number" scope="packs";')
add('+Variable pUnit name="Price note" type="string" scope="packs";')
add('+Variable pBlurb name="Summary" type="string" scope="packs";')
add('+ArrayVariable pIncl name="Includes" scope="packs" items.0.type="string" items.0.name="Item";')
add('+Variable pHi name="Most booked" type="boolean" scope="packs" initialValue="false";')
packs = [('Portrait', 450, 'per session', 'One hour, one place, for you or for two.', ['1 hour, 1 location', '30 edited photographs', 'Private online gallery', '20 × 25 cm mini album'], False),
         ('Family', 750, 'per session', 'Two hours at home or somewhere you love.', ['2 hours, up to 8 people', '60 edited photographs', 'Private online gallery', '24 × 30 cm linen album, 30 pages'], True),
         ('Wedding', 3800, 'from', 'The whole day, from getting ready to the last dance.', ['8 hours, 2 photographers', '500+ edited photographs', 'Engagement session', '30 × 30 cm heirloom album, 80 pages'], False)]
for n, _ in enumerate(packs): add(f'+CollectionItemNode pk{n} parent="packs" index="{n}";')
L.append('---')
for n, (nm, pr, un, bl, inc, hi) in enumerate(packs):
    parts = [f'$control__pName={q(nm)}', f'$control__pPrice={q(pr)}', f'$control__pUnit={q(un)}', f'$control__pBlurb={q(bl)}', f'$control__pHi={q("true" if hi else "false")}']
    parts += [f'$control__pIncl.{k}.Item={q(x)}' for k, x in enumerate(inc)]
    add(f'SET pk{n} ' + ' '.join(parts) + ';')
# reorder phases: collect creation lines and set lines separately
print('\n'.join(L))
