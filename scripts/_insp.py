from PIL import Image
import numpy as np
im = Image.open('assets-source/dress.jpg').convert('RGB')
a = np.array(im).astype(int)
h, w, _ = a.shape
print('source:', im.size)
# histogram of luminance to see how much is background
lum = np.array(im.convert('L'))
print('luminance: min %d  max %d  mean %.1f' % (lum.min(), lum.max(), lum.mean()))
print('pixels that are essentially white (>=250): %.1f%%' % (100 * (lum >= 250).mean()))
# what the dress colour actually is
bb = (286, 230, 738, 795)  # the bounding box measured earlier
subject = a[bb[1]:bb[3], bb[0]:bb[2]]
m = np.abs(subject - 255).sum(axis=2) > 40
px = subject[m]
print('subject pixels: %d' % len(px))
print('subject mean colour: rgb%s' % tuple(px.mean(axis=0).round().astype(int)))
# bright vs dark split within the subject (is it a flat colour or shaded?)
l = px.mean(axis=1)
print('subject luminance: mean %.0f  std %.0f  (flat art = low std)' % (l.mean(), l.std()))
