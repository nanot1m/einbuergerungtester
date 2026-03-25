#!/usr/bin/env python3
import json
from pathlib import Path


DATASETS = [
    Path('data/einbuergerungstest_berlin_310.json'),
    Path('data/einbuergerungstest_berlin_310_ru.json'),
]


IMAGE_MAP = {
    ('general', None, 21): {
        'question_images': [
            {
                'src': './data/images/questions/general_21_question.png',
                'alt': 'Четыре варианта герба, пронумерованные от 1 до 4',
            }
        ],
        'options': ['1', '2', '3', '4'],
        'question_ru': 'Какой из этих гербов является гербом Федеративной Республики Германия?',
        'options_ru': ['1', '2', '3', '4'],
    },
    ('general', None, 55): {
        'question_images': [
            {
                'src': './data/images/questions/general_55_question.jpg',
                'alt': 'Здание Рейхстага в Берлине',
            }
        ],
        'question_ru': 'Что изображено на этой фотографии?',
        'options_ru': [
            'здание Бундестага в Берлине',
            'Федеральный конституционный суд в Карлсруэ',
            'здание Бундесрата в Берлине',
            'Федеральная канцелярия в Берлине',
        ],
    },
    ('general', None, 70): {
        'question_images': [
            {
                'src': './data/images/questions/general_70_question.png',
                'alt': 'Густав Хайнеманн вручает Хельмуту Шмидту грамоту о назначении',
            }
        ],
    },
    ('general', None, 130): {
        'question_images': [
            {
                'src': './data/images/questions/general_130_question.png',
                'alt': 'Четыре бюллетеня для выборов в Бундестаг',
            }
        ],
        'question_ru': 'Какой из этих бюллетеней был бы действительным на выборах в Бундестаг?',
        'options_ru': ['1', '2', '3', '4'],
    },
    ('general', None, 176): {
        'question_images': [
            {
                'src': './data/images/questions/general_176_question.png',
                'alt': 'Карта Германии с четырьмя пронумерованными зонами оккупации',
            }
        ],
    },
    ('general', None, 181): {
        'question_images': [
            {
                'src': './data/images/questions/general_181_question.jpg',
                'alt': 'Вилли Брандт стоит на коленях в Варшаве',
            }
        ],
    },
    ('general', None, 187): {
        'question_images': [
            {
                'src': './data/images/questions/general_187_question.png',
                'alt': 'Флаг с молотом, циркулем и венком из колосьев',
            }
        ],
    },
    ('general', None, 209): {
        'question_images': [
            {
                'src': './data/images/questions/general_209_question.png',
                'alt': 'Четыре варианта герба, пронумерованные от 1 до 4',
            }
        ],
        'options': ['1', '2', '3', '4'],
        'question_ru': 'Какой из этих гербов был гербом Германской Демократической Республики?',
        'options_ru': ['1', '2', '3', '4'],
    },
    ('general', None, 226): {
        'question_images': [
            {
                'src': './data/images/questions/general_226_question.png',
                'alt': 'Четыре флага, пронумерованные от 1 до 4',
            }
        ],
        'options': ['1', '2', '3', '4'],
        'question_ru': 'Какой из этих флагов является флагом Европейского союза?',
        'options_ru': ['1', '2', '3', '4'],
    },
    ('general', None, 216): {
        'question_images': [
            {
                'src': './data/images/questions/general_216_question.jpg',
                'alt': 'Пленарный зал немецкого Бундестага',
            }
        ],
    },
    ('general', None, 235): {
        'question_images': [
            {
                'src': './data/images/questions/general_235_question.jpg',
                'alt': 'Франсуа Миттеран и Гельмут Коль в Вердене',
            }
        ],
    },
    ('state', 'Berlin', 1): {
        'question': 'Welches Wappen gehört zum Bundesland Berlin?',
        'question_images': [
            {
                'src': './data/images/questions/berlin_1_question.png',
                'alt': 'Четыре варианта герба, пронумерованные от 1 до 4',
            }
        ],
        'question_ru': 'Какой из этих гербов принадлежит федеральной земле Берлин?',
        'options': ['1', '2', '3', '4'],
        'options_ru': ['1', '2', '3', '4'],
    },
    ('state', 'Berlin', 8): {
        'question_images': [
            {
                'src': './data/images/questions/berlin_8_question.png',
                'alt': 'Карта Германии с четырьмя пронумерованными отметками',
            }
        ],
        'question_ru': 'Какая из отмеченных на карте федеральных земель является Берлином?',
        'options_ru': ['1', '2', '3', '4'],
    },
}


def load_json(path: Path):
    with path.open('r', encoding='utf-8') as f:
        return json.load(f)


def save_json(path: Path, payload):
    with path.open('w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)


def main() -> None:
    for dataset_path in DATASETS:
        payload = load_json(dataset_path)
        updated = 0

        for card in payload['questions']:
            key = (card['section'], card.get('state'), card['task_number'])
            patch = IMAGE_MAP.get(key)
            if not patch:
                continue

            card.pop('option_images', None)
            card.update(patch)
            updated += 1

        save_json(dataset_path, payload)
        print(f'Updated {updated} cards in {dataset_path}')


if __name__ == '__main__':
    main()
