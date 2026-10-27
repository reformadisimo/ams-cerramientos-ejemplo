import sys, os
import numpy as np
from PIL import Image

src = sys.argv[1]
out = sys.argv[2]
os.makedirs(out, exist_ok=True)

im = Image.open(src).convert("RGB")
a = np.array(im).astype(int)
H, W, _ = a.shape
nonwhite = a.min(axis=2) < 225

def bbox(mask, x0, x1):
    sub = mask[:, x0:x1]
    ys = np.where(sub.any(axis=1))[0]
    xs = np.where(sub.any(axis=0))[0]
    return (x0 + xs.min(), ys.min(), x0 + xs.max() + 1, ys.max() + 1)

split = int(W * 0.68)
bh = bbox(nonwhite, 0, split)
bs = bbox(nonwhite, split, W)
print("horizontal", bh, "cuadrado", bs)

def cut(b, pad=12):
    x0, y0, x1, y1 = b
    return a[max(0, y0 - pad):min(H, y1 + pad), max(0, x0 - pad):min(W, x1 + pad)]

def to_rgba(arr, white_version=False):
    arr = arr.astype(int)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    mn = arr.min(axis=2)
    alpha = np.clip((255 - mn) * 1.35, 0, 255)
    orange = (r - b > 60) & (r > 150)
    rgb = arr.copy()
    if white_version:
        rgb[~orange] = [255, 255, 255]
        rgb[orange] = [246, 125, 46]
    else:
        # limpiar: navy puro y naranja puro, sin halos grises
        rgb[~orange] = [26, 43, 69]
        rgb[orange] = [242, 107, 33]
    rgba = np.dstack([rgb, alpha]).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")

h = cut(bh)
s = cut(bs)
to_rgba(h).save(os.path.join(out, "logo-color.png"))
to_rgba(h, True).save(os.path.join(out, "logo-blanco.png"))
sq = to_rgba(s)
sq.save(os.path.join(out, "logo-cuadrado.png"))

# icono de pestaña y de móvil: versión cuadrada sobre blanco, con margen
def icon(size, pad_ratio=0.08):
    bg = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    inner = int(size * (1 - 2 * pad_ratio))
    sq2 = sq.copy()
    sq2.thumbnail((inner, inner), Image.LANCZOS)
    bg.alpha_composite(sq2, ((size - sq2.width) // 2, (size - sq2.height) // 2))
    return bg
icon(512).save(os.path.join(out, "icono-512.png"))
icon(180).save(os.path.join(out, "apple-touch-icon.png"))
icon(64, 0.04).save(os.path.join(out, "favicon.png"))

for f in sorted(os.listdir(out)):
    print(f, Image.open(os.path.join(out, f)).size, os.path.getsize(os.path.join(out, f)))
