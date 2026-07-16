"""
Generates the favicon set from the real brand mark (the cloud+download icon
in public/optimum-logo-clean.png) instead of a placeholder badge.

public/optimum-logo-clean.png is an RGB (no alpha) export with the logo
rendered over a near-black background, so we chroma-key it: any pixel with
max(R,G,B) above `threshold` is treated as opaque logo, everything else
becomes transparent. The cloud icon is then cropped out, centered on a
padded square canvas, and downsampled (never upscaled) to each target size
so edges stay crisp instead of pixelating.

Google requires an icon at least 48x48px (square) to show a favicon next to
a site in search results - see
https://developers.google.com/search/docs/appearance/favicon-in-search
"""
from PIL import Image
import numpy as np
import shutil

SOURCE = 'public/optimum-logo-clean.png'
THRESHOLD = 40
ICON_WIDTH_FRACTION = 0.86  # icon occupies this fraction of the square canvas width
MASTER_SIZE = 512
SIZES = [16, 32, 48, 96, 180, 192, 512]

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
