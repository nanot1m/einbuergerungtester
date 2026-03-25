#!/usr/bin/env python3
import json
import re
import time
import urllib.parse
import urllib.request
from collections import Counter
from pathlib import Path

SRC_PATH = Path('data/einbuergerungstest_berlin_310.json')
OUT_PATH = Path('data/einbuergerungstest_berlin_310_ru.json')
CACHE_PATH = Path('data/translation_cache_de_ru.json')

STOPWORDS_DE = {
    'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'eines', 'einem', 'einen',
    'und', 'oder', 'aber', 'doch', 'denn', 'sondern', 'auch', 'nur', 'nicht', 'kein', 'keine',
    'ist', 'sind', 'war', 'waren', 'wird', 'werden', 'hat', 'haben', 'kann', 'können', 'darf',
    'dürfen', 'muss', 'müssen', 'soll', 'sollen', 'im', 'in', 'am', 'an', 'auf', 'aus', 'bei',
    'mit', 'von', 'vor', 'nach', 'zu', 'zum', 'zur', 'für', 'über', 'unter', 'durch', 'gegen',
    'ohne', 'um', 'als', 'wie', 'wenn', 'weil', 'dass', 'welche', 'welcher', 'welches', 'was',
    'wer', 'wo', 'wann', 'warum', 'wieso', 'wieviel', 'wieviele', 'heißt', 'heissen', 'gehört',
    'gehören', 'deutschland', 'deutschen', 'deutscher', 'bundesrepublik', 'bundesland', 'land',
    'heute', 'früher', 'diese', 'dieser', 'dieses', 'jenes', 'jener', 'jeden', 'jeder', 'jedes',
    'man', 'menschen', 'person', 'personen', 'stadt', 'staat', 'frage', 'aufgabe', 'bild'
}

TOKEN_RE = re.compile(r"[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß\-]{2,}")


def load_json(path: Path, default):
    if path.exists():
        with path.open('r', encoding='utf-8') as f:
            return json.load(f)
    return default


def save_json(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def translate(text: str, cache: dict[str, str], sleep_sec: float = 0.03) -> str:
    text = text.strip()
    if not text:
        return ''
    if text in cache:
        return cache[text]

    params = urllib.parse.urlencode(
        {
            'client': 'gtx',
            'sl': 'de',
            'tl': 'ru',
            'dt': 't',
            'q': text,
        }
    )
    url = f'https://translate.googleapis.com/translate_a/single?{params}'

    for attempt in range(2):
        try:
            with urllib.request.urlopen(url, timeout=8) as resp:
                payload = json.loads(resp.read().decode('utf-8'))
            translated = ''.join(chunk[0] for chunk in payload[0] if chunk and chunk[0])
            translated = translated.strip() or text
            cache[text] = translated
            time.sleep(sleep_sec)
            return translated
        except Exception:
            time.sleep((attempt + 1) * 0.25)

    cache[text] = text
    return text


def extract_keywords_de(question: str, options: list[str], limit: int = 4) -> list[str]:
    text = f"{question} {' '.join(options)}"
    tokens = TOKEN_RE.findall(text)

    scored = Counter()
    for token in tokens:
        low = token.lower()
        if low in STOPWORDS_DE:
            continue
        if len(low) < 4:
            continue
        score = 1.0
        if token[0].isupper():
            score += 0.5
        if '-' in token:
            score += 0.2
        if len(token) >= 9:
            score += 0.2
        scored[token] += score

    ordered = [word for word, _ in scored.most_common()]
    uniq = []
    seen = set()
    for w in ordered:
        lw = w.lower()
        if lw in seen:
            continue
        seen.add(lw)
        uniq.append(w)
        if len(uniq) == limit:
            break
    return uniq


def main():
    src = load_json(SRC_PATH, {})
    if not src:
        raise FileNotFoundError(f'Missing {SRC_PATH}')

    cache = load_json(CACHE_PATH, {})
    cards = src['questions']
    total_strings = len(cards) * 5
    translated_count = 0

    for i, card in enumerate(cards, start=1):
        q_de = card['question']
        options_de = card['options']

        q_ru = translate(q_de, cache)
        opts_ru = [translate(opt, cache) for opt in options_de]

        keywords_de = extract_keywords_de(q_de, options_de)
        keywords_ru = [translate(k, cache) for k in keywords_de]

        card['question_ru'] = q_ru
        card['options_ru'] = opts_ru
        card['keywords_de'] = keywords_de
        card['keywords_ru'] = keywords_ru

        translated_count += 5
        if i % 20 == 0:
            print(f'Processed {i}/{len(cards)} cards ({translated_count}/{total_strings} strings)')
            save_json(CACHE_PATH, cache)

    result = {
        **src,
        'language': {
            'question_primary': 'de',
            'question_secondary': 'ru',
            'option_primary': 'de',
            'option_secondary': 'ru'
        },
        'questions': cards,
    }

    save_json(CACHE_PATH, cache)
    save_json(OUT_PATH, result)
    print(f'Wrote {OUT_PATH}')
    print(f'Cached translations: {len(cache)}')


if __name__ == '__main__':
    main()
