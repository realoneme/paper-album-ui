# "Bound this year" on Home as a carousel: the featured-albums collection list moves into a top-level row on the
# Home canvas (a horizontal stack, items 300px wide, up to 12) and the Paper/ScrollRow code component shows that row
# with arrow keys and an edge fade. Albums appear when "Featured" is on (7 of the 9 sample albums).
# Applied as /tmp/car1.dsl, car2.dsl and car3.dsl; the slot value is the row's canonical id.
CAR1 = '''+FrameNode featRow parent="augiA20Il";
---
SET featRow name="Featured albums row (in the carousel)" layout="stack" stackDirection="horizontal" gap="32px" width="auto" height="auto" left="3400px" top="0px";
MOVE bJYUe8MiV parent="featRow";
SET bJYUe8MiV layout="stack" stackDirection="horizontal" gap="32px" position="relative" width="auto" height="auto" collectionList.limit="12";
SET p48z9sGxg width="300px";'''
CAR2 = '''+ComponentInstanceNode featCar component="codeFile/BUeAvnJ:default" parent="d29voVERx" index="1";
---
SET featCar name="Albums carousel" position="relative" width="100%" height="auto" $control__content.0="<featRow id>" $control__arrows="below-right";'''
