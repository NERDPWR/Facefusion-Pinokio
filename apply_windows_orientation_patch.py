from pathlib import Path
import sys


def main() -> None:
    if not sys.platform.startswith("win"):
        print("Skipping orientation patch (non-Windows platform).")
        return

    vision_path = Path("facefusion/vision.py")
    if not vision_path.exists():
        print("Skipping orientation patch (facefusion/vision.py not found).")
        return

    content = vision_path.read_text(encoding="utf-8")

    imports_old = "import cv2\nimport numpy\nfrom cv2.typing import Size\n"
    imports_new = "import cv2\nimport numpy\nfrom PIL import Image, ImageOps\nfrom cv2.typing import Size\n"

    read_image_old = (
        "\t\tif is_windows():\n"
        "\t\t\timage_buffer = numpy.fromfile(image_path, dtype = numpy.uint8)\n"
        "\t\t\treturn cv2.imdecode(image_buffer, flag)\n"
        "\t\treturn cv2.imread(image_path, flag)"
    )
    read_image_new = (
        "\t\tif is_windows():\n"
        "\t\t\tpil_mode = 'RGBA' if color_mode == 'rgba' else 'RGB'\n"
        "\t\t\twith Image.open(image_path) as pil_image:\n"
        "\t\t\t\tpil_image = ImageOps.exif_transpose(pil_image)\n"
        "\t\t\t\tpil_image = pil_image.convert(pil_mode)\n"
        "\t\t\timage_array = numpy.array(pil_image)\n"
        "\n"
        "\t\t\tif color_mode == 'rgba':\n"
        "\t\t\t\treturn cv2.cvtColor(image_array, cv2.COLOR_RGBA2BGRA)\n"
        "\t\t\treturn cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)\n"
        "\t\treturn cv2.imread(image_path, flag)"
    )

    updated = False

    if "from PIL import Image, ImageOps" not in content and imports_old in content:
        content = content.replace(imports_old, imports_new, 1)
        updated = True

    if read_image_old in content:
        content = content.replace(read_image_old, read_image_new, 1)
        updated = True

    if updated:
        vision_path.write_text(content, encoding="utf-8")
        print("Applied Windows EXIF orientation patch to facefusion/vision.py")
    else:
        print("Orientation patch already applied (or expected block not found).")


if __name__ == "__main__":
    main()
