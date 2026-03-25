#!/usr/bin/env python3
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


SRC_DIR = Path('data/images/extracted')
OUT_DIR = Path('data/images/questions')


def fit_image(img: Image.Image, max_size: tuple[int, int]) -> Image.Image:
    copy = img.copy()
    copy.thumbnail(max_size, Image.Resampling.LANCZOS)
    return copy


def draw_labeled_grid(src_paths: list[Path], out_path: Path) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    cell_w = 320
    cell_h = 320
    pad = 24
    top_pad = 56
    cols = 2
    rows = 2
    canvas = Image.new('RGB', (cols * cell_w + pad * 3, rows * cell_h + pad * 3), 'white')
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()

    for idx, src in enumerate(src_paths, start=1):
        img = Image.open(src).convert('RGBA')
        fitted = fit_image(img, (cell_w - 40, cell_h - 82))
        col = (idx - 1) % cols
        row = (idx - 1) // cols
        x = pad + col * (cell_w + pad)
        y = pad + row * (cell_h + pad)

        draw.rounded_rectangle((x, y, x + cell_w, y + cell_h), radius=18, outline='#d9e3e7', width=2, fill='#f8fbfb')
        label = str(idx)
        bbox = draw.textbbox((0, 0), label, font=font)
        label_w = bbox[2] - bbox[0]
        label_h = bbox[3] - bbox[1]
        label_x = x + (cell_w - label_w) // 2
        label_y = y + 18
        draw.text((label_x, label_y), label, fill='#223741', font=font)

        img_x = x + (cell_w - fitted.width) // 2
        img_y = y + top_pad + (cell_h - top_pad - fitted.height) // 2
        canvas.paste(fitted, (img_x, img_y), fitted)

    canvas.save(out_path, quality=95)


def copy_question_image(src_path: Path, out_path: Path) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    img = Image.open(src_path).convert('RGB')
    img.save(out_path, quality=95)


def main() -> None:
    copy_question_image(SRC_DIR / 'page_21_1_Im1.jpg', OUT_DIR / 'general_55_question.jpg')
    copy_question_image(SRC_DIR / 'page_27_1_Im1.png', OUT_DIR / 'general_70_question.png')
    copy_question_image(SRC_DIR / 'page_48_1_Im1.png', OUT_DIR / 'general_130_question.png')
    copy_question_image(SRC_DIR / 'page_64_1_Im1.jp2', OUT_DIR / 'general_176_question.png')
    copy_question_image(SRC_DIR / 'page_67_1_Im1.jpg', OUT_DIR / 'general_181_question.jpg')
    copy_question_image(SRC_DIR / 'page_70_1_Im1.png', OUT_DIR / 'general_187_question.png')
    copy_question_image(SRC_DIR / 'page_81_1_Im1.jpg', OUT_DIR / 'general_216_question.jpg')
    copy_question_image(SRC_DIR / 'page_88_1_Im1.jpg', OUT_DIR / 'general_235_question.jpg')
    copy_question_image(SRC_DIR / 'page_125_1_Im1.jp2', OUT_DIR / 'berlin_8_question.png')

    draw_labeled_grid(
        [
            SRC_DIR / 'page_9_1_Im1.png',
            SRC_DIR / 'page_9_2_Im2.png',
            SRC_DIR / 'page_9_3_Im3.png',
            SRC_DIR / 'page_9_4_Im4.png',
        ],
        OUT_DIR / 'general_21_question.png',
    )
    draw_labeled_grid(
        [
            SRC_DIR / 'page_78_1_Im1.png',
            SRC_DIR / 'page_78_2_Im2.png',
            SRC_DIR / 'page_78_3_Im3.png',
            SRC_DIR / 'page_78_4_Im4.png',
        ],
        OUT_DIR / 'general_209_question.png',
    )
    draw_labeled_grid(
        [
            SRC_DIR / 'page_85_1_Im1.png',
            SRC_DIR / 'page_85_2_Im2.jpg',
            SRC_DIR / 'page_85_3_Im3.jpg',
            SRC_DIR / 'page_85_4_Im4.jpg',
        ],
        OUT_DIR / 'general_226_question.png',
    )
    draw_labeled_grid(
        [
            SRC_DIR / 'page_122_1_Im1.png',
            SRC_DIR / 'page_122_2_Im2.png',
            SRC_DIR / 'page_122_3_Im3.png',
            SRC_DIR / 'page_122_4_Im4.png',
        ],
        OUT_DIR / 'berlin_1_question.png',
    )
    print('Built question image assets')


if __name__ == '__main__':
    main()
