# Draws the iPhone app icon and launch image from the same barbell as the Android icon,
# sharp at full size (the Android files are too small to scale up).
# Usage: python3 tools/ios-assets.py  ->  native/ios-src/AppIcon-1024.png, native/ios-src/Splash-2732.png
import os

from PIL import Image, ImageDraw

BG = (14, 18, 23)
RED = (229, 84, 74)
BLUE = (79, 132, 238)
STEEL = (200, 208, 217)
SS = 4  # drawn 4x larger, then reduced, for smooth edges

# The Android foreground icon is a 432 px canvas; the barbell's shapes in those units:
# (x0, y0, x1, y1, corner radius, colour), drawn in this order.
SHAPES = [
    (91, 204, 341, 229, 7, STEEL),    # the bar
    (182, 189, 193, 243, 4, STEEL),   # collars
    (239, 189, 250, 243, 4, STEEL),
    (149, 116, 182, 317, 11, RED),    # big plates
    (250, 116, 283, 317, 11, RED),
    (118, 155, 145, 278, 9, BLUE),    # small plates
    (287, 155, 315, 278, 9, BLUE),
]
CX, CY = 216, 216.5  # the barbell's centre on that canvas


def draw(size, barbell_width):
    """A square image of `size` px with the barbell `barbell_width` px wide in the middle."""
    big = Image.new('RGB', (size * SS, size * SS), BG)
    d = ImageDraw.Draw(big)
    k = barbell_width / (341 - 91) * SS
    ox, oy = size * SS / 2 - CX * k, size * SS / 2 - CY * k
    for x0, y0, x1, y1, r, c in SHAPES:
        d.rounded_rectangle((ox + x0 * k, oy + y0 * k, ox + x1 * k, oy + y1 * k), radius=r * k, fill=c)
    return big.resize((size, size), Image.LANCZOS)


here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, '..', 'native', 'ios-src')
os.makedirs(out, exist_ok=True)
# App Store icons must be square, opaque and without rounded corners (iOS rounds them itself).
draw(1024, 600).save(os.path.join(out, 'AppIcon-1024.png'), optimize=True)
# The launch image is shown "aspect fill": on a phone only the middle third is visible.
draw(2732, 620).save(os.path.join(out, 'Splash-2732.png'), optimize=True)
print('ok')
