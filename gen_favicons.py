"""
Generates the favicon set from the real brand mark (the cloud+download icon
in public/optimum-logo-clean.png) instead of a placeholder badge.

public/optimum-logo-clean.png is an RGB (no alpha) export with the logo
rendered over a near-black background, so we chroma-key it: any pixel with
max(R,G,B) above `threshold` is treated as opaque logo, everything else
becomes transparent. The cloud icon is then cropped out, centered on a
padded square canvas, and downsampled (never upscaled) to each target size
so edges stay crisp instead of pixelating.

The download arrow inside the cloud is rendered the same blue as the cloud
outline in this source file, so it's split out from the cloud via connected-
component analysis (the arrow's two shapes don't touch the cloud outline)
rather than by color, then recolored to match the site's red accent - the
same red used for the arrow in the main logo lockup.

Google requires an icon at least 48x48px (square) to show a favicon next to
a site in search results - see
https://developers.google.com/search/docs/appearance/favicon-in-search
"""
from PIL import Image
import numpy as np
from collections import deque
import shutil

SOURCE = 'public/optimum-logo-clean.png'
THRESHOLD = 40
ICON_WIDTH_FRACTION = 0.86  # icon occupies this fraction of the square canvas width
MASTER_SIZE = 512
SIZES = [16, 32, 48, 96, 180, 192, 512]
RED = (240, 20, 30)

im = Image.open(SOURCE).convert('RGB')
arr = np.array(im)
alpha = np.where(arr.max(axis=2) > THRESHOLD, 255, 0).astype(np.uint8)
keyed = Image.fromarray(np.dstack([arr, alpha]), mode='RGBA')

# The icon lives in the left ~27% of the logo lockup; crop it out, then trim
# to its tight bounding box.
w, h = keyed.size
icon_region = keyed.crop((0, 0, int(w * 0.27), h))
region_arr = np.array(icon_region)
region_alpha = region_arr[:, :, 3]
rows = np.where((region_alpha > 10).any(axis=1))[0]
cols = np.where((region_alpha > 10).any(axis=0))[0]
icon = icon_region.crop((cols.min(), rows.min(), cols.max() + 1, rows.max() + 1))

# Split the arrow out from the cloud outline via connected components (same
# blue, but the arrow's shapes don't touch the cloud's stroke) and recolor
# just those pixels to red.
icon_arr = np.array(icon).astype(int)
ih, iw = icon_arr.shape[0], icon_arr.shape[1]
is_opaque = icon_arr[:, :, 3] > 40

visited = np.zeros_like(is_opaque, dtype=bool)
components = []
for y in range(ih):
    for x in range(iw):
        if is_opaque[y, x] and not visited[y, x]:
            q = deque([(y, x)]); visited[y, x] = True; pts = []
            while q:
                cy, cx = q.popleft(); pts.append((cy, cx))
                for dy, dx in [(-1,0),(1,0),(0,-1),(0,1),(-1,-1),(-1,1),(1,-1),(1,1)]:
                    ny, nx = cy + dy, cx + dx
                    if 0 <= ny < ih and 0 <= nx < iw and is_opaque[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True; q.append((ny, nx))
            components.append(pts)

components.sort(key=lambda c: -len(c))
# the cloud outline is by far the largest component; every other component
# (the arrow shaft+head, and the arrow's tray) gets recolored to red
for comp in components[1:]:
    for (y, x) in comp:
        icon_arr[y, x, 0:3] = RED

icon = Image.fromarray(icon_arr.astype('uint8'), 'RGBA')

# Center the icon on a padded square canvas, scaling down only.
iw, ih = icon.size
target_w = int(MASTER_SIZE * ICON_WIDTH_FRACTION)
scale = target_w / iw
target_h = int(ih * scale)
resized = icon.resize((target_w, target_h), Image.LANCZOS)
master = Image.new('RGBA', (MASTER_SIZE, MASTER_SIZE), (0, 0, 0, 0))
master.paste(resized, ((MASTER_SIZE - target_w) // 2, (MASTER_SIZE - target_h) // 2), resized)

renders = {size: master.resize((size, size), Image.LANCZOS) for size in SIZES}

renders[16].save('public/favicon-16x16.png')
renders[32].save('public/favicon-32x32.png')
renders[48].save('public/favicon-48x48.png')
renders[96].save('public/favicon-96x96.png')
renders[180].save('public/apple-touch-icon.png')
renders[192].save('public/favicon-192x192.png')
renders[512].save('public/favicon-512x512.png')
renders[48].save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
print('Generated favicon set in public/')

for f in [
    'favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'favicon-48x48.png',
    'favicon-96x96.png', 'favicon-192x192.png', 'favicon-512x512.png', 'apple-touch-icon.png',
]:
    shutil.copy(f'public/{f}', f'dist/{f}')
    print(f'Copied to dist/{f}')

print('Done!')
