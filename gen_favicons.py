from PIL import Image, ImageDraw, ImageFont
import shutil

def create_favicon(w, h):
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Red rounded rectangle background
    draw.rounded_rectangle([0, 0, w, h], radius=w*0.2, fill=(220, 38, 38, 255))
    # White 'OP' text in center
    font_size = int(w * 0.45)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', font_size)
    except:
        font = ImageFont.load_default()
    text = 'OP'
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    x = (w - tw) // 2
    y = (h - th) // 2
    draw.text((x, y), text, font=font, fill=(255, 255, 255, 255))
    return img

# Generate favicons
sizes = {
    'favicon-32x32.png': (32, 32),
    'favicon-16x16.png': (16, 16),
    'apple-touch-icon.png': (180, 180),
}

for name, (w, h) in sizes.items():
    favicon = create_favicon(w, h)
    favicon.save(f'public/{name}')
    print(f'Created public/{name} ({w}x{h})')

# Create ICO format
favicon32 = create_favicon(32, 32)
favicon16 = create_favicon(16, 16)
favicon32.save('public/favicon.ico', sizes=[(32, 32), (16, 16)])
print('Created public/favicon.ico (32x32 + 16x16)')

# Copy to dist
for f in ['favicon.ico', 'favicon-32x32.png', 'favicon-16x16.png', 'apple-touch-icon.png']:
    shutil.copy(f'public/{f}', f'dist/{f}')
    print(f'Copied to dist/{f}')

print('Done!')
