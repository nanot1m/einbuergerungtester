#!/usr/bin/env python3
import json
import re
from datetime import datetime, timezone
from pathlib import Path

from pypdf import PdfReader


PDF_PATH = Path('data/gesamtfragenkatalog.pdf')
OUT_PATH = Path('data/einbuergerungstest_questions.json')
SOURCE_URL = (
    'https://www.bamf.de/SharedDocs/Anlagen/DE/Integration/Einbuergerung/'
    'gesamtfragenkatalog-lebenindeutschland.pdf?__blob=publicationFile&v=23'
)

CHECKBOX_CHARS = ('', '□')


def clean_line(line: str) -> str:
    line = line.replace('\u00ad', '')
    line = re.sub(r'\s+', ' ', line)
    return line.strip()


def is_page_header(line: str) -> bool:
    return bool(re.fullmatch(r'Seite\s+\d+\s+von\s+\d+', line))


def parse_state_name(line: str) -> str | None:
    if 'für das Bundesland' not in line:
        return None
    m = re.search(r'für\s+das\s+Bundesland\s+([A-Za-zÄÖÜäöüß\-]+)', line)
    if m:
        return m.group(1)
    return None


def main() -> None:
    reader = PdfReader(str(PDF_PATH))
    lines: list[str] = []
    for page in reader.pages:
        text = page.extract_text() or ''
        for raw in text.splitlines():
            line = clean_line(raw)
            if not line or is_page_header(line):
                continue
            lines.append(line)

    questions: list[dict] = []
    current_section = 'metadata'
    current_state: str | None = None
    current_q: dict | None = None
    in_options = False

    def flush_question() -> None:
        nonlocal current_q, in_options
        if not current_q:
            return
        current_q['question'] = current_q['question'].strip()
        current_q['options'] = [o.strip() for o in current_q['options'] if o.strip()]
        if current_q['question'] and len(current_q['options']) >= 2:
            questions.append(current_q)
        current_q = None
        in_options = False

    pending_auf_split = False
    for line in lines:
        if line == 'Auf':
            pending_auf_split = True
            continue

        if line == 'Teil I':
            current_section = 'general'
            current_state = None
            pending_auf_split = False
            continue

        if line == 'Teil II':
            flush_question()
            current_section = 'states'
            current_state = None
            pending_auf_split = False
            continue

        state = parse_state_name(line)
        if state:
            flush_question()
            current_section = 'state'
            current_state = state
            pending_auf_split = False
            continue

        task_match = re.match(r'^(?:Aufgabe|ufgabe|gabe)\s+(\d+)$', line)
        if not task_match and pending_auf_split:
            task_match = re.match(r'^gabe\s+(\d+)$', line)
        if task_match:
            flush_question()
            current_q = {
                'section': current_section,
                'state': current_state,
                'task_number': int(task_match.group(1)),
                'question': '',
                'options': [],
                'source': 'BAMF Gesamtfragenkatalog (Stand: 07.05.2025)',
            }
            in_options = False
            pending_auf_split = False
            continue
        pending_auf_split = False

        if not current_q:
            continue

        # Skip standalone image labels that are not answer options.
        if re.fullmatch(r'Bild\s+1\s+Bild\s+2\s+Bild\s+3\s+Bild\s+4', line):
            continue

        is_option = line.startswith(CHECKBOX_CHARS)
        if is_option:
            option_text = line.lstrip(''.join(CHECKBOX_CHARS)).strip()
            current_q['options'].append(option_text)
            in_options = True
            continue

        # Continuation line for a wrapped option.
        if in_options and current_q['options']:
            if not re.match(r'^Aufgabe\s+\d+$', line) and not parse_state_name(line):
                # If this line does not look like a new question/section, attach to last option.
                if not line.startswith('Teil '):
                    if '' in current_q['options']:
                        first_empty_idx = current_q['options'].index('')
                        current_q['options'][first_empty_idx] = line
                    else:
                        current_q['options'][-1] = (current_q['options'][-1] + ' ' + line).strip()
                    continue

        # Otherwise treat as question text (including image captions/credits).
        current_q['question'] = (current_q['question'] + ' ' + line).strip()

    flush_question()

    payload = {
        'dataset': 'Einbuergerungstest / Leben in Deutschland',
        'source_url': SOURCE_URL,
        'source_document': str(PDF_PATH),
        'downloaded_at_utc': datetime.now(timezone.utc).isoformat(),
        'question_count': len(questions),
        'general_question_count': sum(1 for q in questions if q['section'] == 'general'),
        'state_question_count': sum(1 for q in questions if q['section'] == 'state'),
        'questions': questions,
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open('w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f'Wrote {OUT_PATH} with {len(questions)} questions')
    print(
        f"General: {payload['general_question_count']}, "
        f"State: {payload['state_question_count']}"
    )


if __name__ == '__main__':
    main()
