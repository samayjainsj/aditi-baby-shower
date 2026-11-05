# Photos

Drop your photos here using these exact names (lowercase `.jpg`):

```
photos/
  cover.jpg          <- landscape 4:3, about 1600 x 1200, under ~400 KB
  gallery/
    01.jpg           <- any shape (shown as squares), 1600 px long side
    02.jpg
    ...up to 06.jpg
```

- Missing files are skipped automatically: no cover means a cute animal
  scene, no gallery photos means the "Moments" section hides itself.
- Want more or fewer gallery photos, or different names? Edit the
  `photos` list in `content.js`.
- Shrink phone photos first (on a Mac, work on a copy):
  `sips -Z 1600 photo.jpg`
- iPhone `.HEIC`? Convert to JPG first:
  `sips -s format jpeg photo.HEIC --out photo.jpg`
