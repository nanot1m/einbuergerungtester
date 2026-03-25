#!/usr/bin/env python3
import json
import re
from pathlib import Path

from pypdf import PdfReader

DATASET_PATH = Path('data/einbuergerungstest_berlin_310_ru.json')
ANS300_PATH = Path('data/answers_300.pdf')
ANS_STATES_PATH = Path('data/answers_states.pdf')

LETTER_TO_INDEX = {'A': 0, 'B': 1, 'C': 2, 'D': 3}


def parse_general_answers() -> dict[int, str]:
    text = '\n'.join((p.extract_text() or '') for p in PdfReader(str(ANS300_PATH)).pages)
    pairs = re.findall(r'(\d+)\s*-\s*([ABCD])', text)
    result: dict[int, str] = {}
    for num, letter in pairs:
        n = int(num)
        if 1 <= n <= 300:
            result[n] = letter
    if len(result) != 300:
        raise RuntimeError(f'Expected 300 general answers, got {len(result)}')
    return result


def parse_berlin_answers() -> dict[int, str]:
    text = '\n'.join((p.extract_text() or '') for p in PdfReader(str(ANS_STATES_PATH)).pages)
    text = text.replace('\n', ' ')
    m = re.search(r'Berlin\s+(.*?)(?:Brandenburg|$)', text, flags=re.IGNORECASE)
    if not m:
        raise RuntimeError('Berlin answer block not found')
    block = m.group(1)
    pairs = re.findall(r'(\d+)\s*-\s*([ABCD])', block)
    result = {int(num): letter for num, letter in pairs if 1 <= int(num) <= 10}
    if len(result) != 10:
        raise RuntimeError(f'Expected 10 Berlin answers, got {len(result)}')
    return result


def main() -> None:
    data = json.loads(DATASET_PATH.read_text(encoding='utf-8'))
    general = parse_general_answers()
    berlin = parse_berlin_answers()

    updated = 0
    for q in data['questions']:
        if q['section'] == 'general':
            letter = general[q['task_number']]
        elif q['section'] == 'state' and q['state'] == 'Berlin':
            letter = berlin[q['task_number']]
        else:
            continue

        idx = LETTER_TO_INDEX[letter]
        q['correct_letter'] = letter
        q['correct_index'] = idx
        q['correct_option_de'] = q['options'][idx]
        q['correct_option_ru'] = q['options_ru'][idx]
        updated += 1

    data['answer_key_source'] = {
        'general_300': 'https://deutsch-werden.de/pdf/alle-300-antworten-allgemeiner-fragen-einbuergerungstest.pdf',
        'state_berlin': 'https://deutsch-werden.de/pdf/alle-antworten-aller-bundeslaender.pdf'
    }

    DATASET_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Updated {updated} questions with answer keys in {DATASET_PATH}')


if __name__ == '__main__':
    main()
