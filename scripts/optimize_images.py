"""Convert public images to WebP when it reduces transfer size.

Run from the repository root with: python scripts/optimize_images.py
"""

from pathlib import Path
import re

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "public" / "images"
SOURCE_EXTENSIONS = {".png", ".jpg", ".jpeg"}
TEXT_EXTENSIONS = {".css", ".js", ".jsx", ".json", ".php"}


def convert(source):
    target = source.with_suffix(".webp")
    if target.exists():
        return None

    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        has_alpha = "A" in image.getbands() or "transparency" in image.info
        image = image.convert("RGBA" if has_alpha else "RGB")
        options = {"format": "WEBP", "method": 6, "exact": has_alpha}
        options.update({"lossless": True} if has_alpha else {"quality": 82})
        image.save(target, **options)

    # Keep tiny icons or detailed graphics in their original format when WebP
    # offers no meaningful saving.
    if target.stat().st_size >= source.stat().st_size * 0.9:
        target.unlink()
        return None
    return target


def main():
    replacements = {}
    original_bytes = webp_bytes = 0
    sources = sorted(
        path for path in IMAGES.rglob("*") if path.suffix.lower() in SOURCE_EXTENSIONS
    )
    for source in sources:
        target = convert(source)
        if target is None:
            continue
        old_url = "/" + source.relative_to(ROOT / "public").as_posix()
        new_url = "/" + target.relative_to(ROOT / "public").as_posix()
        replacements[old_url] = new_url
        original_bytes += source.stat().st_size
        webp_bytes += target.stat().st_size

    # Full public URLs cover normal JSX, CSS, and Blade references. The work
    # project map stores bare filenames, so replace those separately below.
    for path in (ROOT / "resources").rglob("*"):
        if path.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        content = path.read_text(encoding="utf-8")
        updated = content
        for old_url, new_url in replacements.items():
            updated = updated.replace(old_url, new_url)
        if path.name == "workProjects.js":
            for old_url, new_url in replacements.items():
                updated = updated.replace(old_url.rsplit("/", 1)[-1], new_url.rsplit("/", 1)[-1])
        if path.name in {"app.jsx", "AdminBooking.jsx"}:
            logo_urls = [url for url in replacements if re.fullmatch(r"/images/vireda-logo-(light|dark)-420\.png", url)]
            if len(logo_urls) == 2:
                updated = updated.replace("vireda-logo-${variant}-420.png", "vireda-logo-${variant}-420.webp")
        if updated != content:
            path.write_text(updated, encoding="utf-8", newline="")

    for old_url in replacements:
        (ROOT / "public" / old_url.lstrip("/")).unlink()

    missing = []
    image_url = re.compile(r"(?<![A-Za-z0-9])/?images/[A-Za-z0-9_./-]+\.(?:png|jpe?g|webp)")
    for folder in (ROOT / "resources", ROOT / "public" / "build" / "assets"):
        for path in folder.rglob("*"):
            if path.suffix.lower() not in TEXT_EXTENSIONS:
                continue
            for url in image_url.findall(path.read_text(encoding="utf-8")):
                if not (ROOT / "public" / url.lstrip("/")).is_file():
                    missing.append(f"{path.relative_to(ROOT)}: {url}")
    if missing:
        raise RuntimeError("Missing image references:\n" + "\n".join(missing))

    print(f"Converted {len(replacements)} of {len(sources)} source images")
    if original_bytes:
        print(f"Converted bytes: {original_bytes:,} -> {webp_bytes:,} ({(1 - webp_bytes / original_bytes) * 100:.1f}% smaller)")
    print("Image references verified")
    for old_url, new_url in replacements.items():
        print(f"{old_url} -> {new_url}")


if __name__ == "__main__":
    main()
