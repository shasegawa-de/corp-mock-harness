#!/usr/bin/env python3
"""Recover only the four approved original PNGs from the user-uploaded ZIP.

The GitHub Actions checkout has the ZIP but not the four individual PNGs.
Fail closed: never accept a mismatched image, unexpected ZIP entry, symlink,
unapproved asset name, altered dimensions or unsafe path. Requires Python 3.
"""
import hashlib
import json
from pathlib import Path, PurePosixPath
import struct
import sys
import zipfile

ROOT = Path(__file__).resolve().parent.parent
FOLDER = ROOT / "assets" / "architectural-surfaces"
MANIFEST = FOLDER / "approved-manifest.json"
ZIP = FOLDER / "corp-mock-upload-ready.zip"
EXPECTED_IDS = ("MR2", "TX1", "TX2", "MR1")


def check_png(data, spec):
    if len(data) != spec["size_bytes"]:
        raise ValueError(f'{spec["id"]}: unexpected byte length')
    if hashlib.sha256(data).hexdigest() != spec["sha256"]:
        raise ValueError(f'{spec["id"]}: SHA-256 differs from approved original')
    if len(data) < 33 or data[:8] != b"\x89PNG\r\n\x1a\n" or data[12:16] != b"IHDR":
        raise ValueError(f'{spec["id"]}: invalid PNG')
    if struct.unpack(">II", data[16:24]) != (spec["width"], spec["height"]):
        raise ValueError(f'{spec["id"]}: wrong pixel dimensions')


def main():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if (manifest.get("review_status") != "VISUALLY_APPROVED_BY_USER"
            or [s["id"] for s in manifest["images"]] != list(EXPECTED_IDS)):
        raise ValueError("Approval manifest is incomplete or altered")
    specs = manifest["images"]
    wanted = {PurePosixPath(s["path"]).name: s for s in specs}
    if len(wanted) != len(EXPECTED_IDS):
        raise ValueError("Duplicate manifest filename")
    for name, spec in wanted.items():
        if spec["path"] != "assets/architectural-surfaces/" + name:
            raise ValueError("Unsafe manifest path: " + spec["path"])

    if ZIP.is_file():
        with zipfile.ZipFile(ZIP) as archive:
            entries = [z for z in archive.infolist() if not z.is_dir()]
            if len(entries) != len(wanted):
                raise ValueError(f"Expected four PNGs in ZIP, found {len(entries)} entries")
            recovered = {}
            for entry in entries:
                source = PurePosixPath(entry.filename)
                if (source.is_absolute() or ".." in source.parts or
                        source.name not in wanted or entry.filename.startswith("__MACOSX/") or
                        ((entry.external_attr >> 16) & 0o170000) == 0o120000):
                    raise ValueError("Unexpected/unsafe ZIP member: " + entry.filename)
                if source.name in recovered:
                    raise ValueError("Duplicate ZIP filename: " + source.name)
                if entry.file_size > 4_000_000:
                    raise ValueError("Image exceeds expected safe file size")
                data = archive.read(entry)
                check_png(data, wanted[source.name])
                recovered[source.name] = data
            if set(recovered) != set(wanted):
                raise ValueError("ZIP is missing an approved PNG")
        for name, data in recovered.items():
            destination = FOLDER / name
            if destination.exists() and destination.read_bytes() != data:
                raise ValueError("An existing tracked image does not match the approved original: " + name)
            destination.write_bytes(data)
            print("VERIFIED_ARCHIVE_IMAGE", wanted[name]["id"], name, len(data), wanted[name]["sha256"])
    else:
        print("No ZIP found: verifying already-published individual originals")

    for name, spec in wanted.items():
        target = FOLDER / name
        if not target.is_file():
            raise ValueError("Approved PNG is missing: " + name)
        check_png(target.read_bytes(), spec)
        print("VERIFIED_PNG", spec["id"], name, spec["sha256"])


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, zipfile.BadZipFile, KeyError, TypeError) as exc:
        print("APPROVED_IMAGE_IMPORT_FAILED:", str(exc), file=sys.stderr)
        sys.exit(1)
