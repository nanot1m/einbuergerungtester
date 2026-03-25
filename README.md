# Einbuergerungstest Berlin Trainer

Локальный тренажер в стиле Anki для подготовки к Einbürgerungstest (Берлин):
- 310 карточек (300 общих + 10 по Берлину)
- DE + RU для каждого вопроса и варианта ответа
- подсветка ключевых слов
- интервальные повторения (SM-2: Again/Hard/Good/Easy)

## Файлы данных
- `data/einbuergerungstest_berlin_310.json` — исходная колода 310 вопросов (DE)
- `data/einbuergerungstest_berlin_310_ru.json` — колода с переводами и keywords

## Запуск
1. В корне проекта:
   ```bash
   python3 -m http.server 5173
   ```
2. Откройте в браузере:
   - [http://localhost:5173/web/](http://localhost:5173/web/)

## Перегенерация DE→RU
```bash
python3 scripts/prepare_berlin_ru_dataset.py
```
