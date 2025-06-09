# Real time биржевые котировки
Проект для построения и real time и исторических дашбордов по котируемым инструментам.

## Оглавление
- [Установка](#установка)
- [Структура проекта](#структура-проекта)
- [Быстрый старт](#быстрый-старт)
- [Запуск в среде Docker](#запуск-в-среде-Docker)
- [Описание переменных окружения](#описание-переменных-окружения)

## Установка
Предварительные требования:
- Node.js >= 20
- npm
- Docker 

## Структура проекта
- app/[api](app/api) - Директория системы роутинга
- app/[components](app/components) - Компоненты интерфейса
- app/[data](app/data) - Директория обеспечивающая пути поставки информации(заглушка или [exchange.org](https://openexchangerates.org))
- app/[db](app/db) - клиенты для работы с базой данных с использованием технологии ORM
- app/[generated](app/generated) - Директория генерируемая prisma. Содержит клиентские типы для работы с сущностями из БД
- app/[ioc](app/ioc) - Реализация паттерна "Инверсия управления". Необходимо для переключения приложения между источниками данных
- app/[lib](app/lib) - Клиент Prismа для работы с БД 
- app/[utilites](app/utilites) - предназначена для хранения вспомогательных модулей, классов и функций
- [prisma](prisma) - Директория хранящая описание схему базы данных, а так историю ее миграций
- [public](public) - статические файлы 
- [.env](.env) - Описание переменных для конфигурации проекта 
- [docker-compose.stock-quotes.yml](docker-compose.stock-quotes.yml) [Dockerfile](Dockerfile) - Файлы для создания докер образа и описания композиции образов для старта приложения 
- [eslint.config.mjs](eslint.config.mjs) [next.config.ts](next.config.ts) [package.json](package.json) [package-lock.json](package-lock.json) [postcss.config.mjs](postcss.config.mjs) [tsconfig.json](tsconfig.json) - файлы описывающие кофигурации инструментов, испозующихся в проекте
- README.md - Текущий файл

## Быстрый старт
Запуск миграций базы данных 
`npm run db:deploy`

Запуск приложения
`npm run dev`


## Запуск в среде Docker
`docker compose -f docker-compose.stock-quotes.yml up -d`

## Описание переменных окружения

| Переменная          | Описание                                                                                                           | Пример                                                                     | Этап внедрения |
|------------|--------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|----------------|
| DATABASE_URL | URL до базы данных postgres                                                                                        | postgresql://user:password@localhost:5432/stock-quotes?schema=stock-quotes | Запуск проекта |
| DATA_SOURCE | Указание источника данных                                                                                          | "STUB" или "EXCHANGE"                                                      | Запуск проекта |
| NEXT_PUBLIC_DYNAMIC_DASHBOARD_LENGTH | Указание длинны динамического графика                                                                              | 100                                                                        | сборка проекта       |
| NEXT_PUBLIC_DYNAMIC_DASHBOARD_REFRESH_DURATION | Указание частоты обновления динамического графика в милисекундах                                                   | 1000                                                                       | сборка проекта |
| NEXT_PUBLIC_DASHBOARD_CURRENCY | Указание валюты, отображаемых на графиках                                                                          | rub                                                                        | сборка проекта |
| NEXT_PUBLIC_SMA_PERIOD_MINUTES | Период расчета скользящего среднего (SMA) в минутах                                                                | 5                                                                          | сборка проекта |
| EXCHANGE_URL | URL для источника данных [exchange.org](https://openexchangerates.org) в случае если DATA_SOURCE=EXCHANGE            | https://openexchangerates.org/api                                                                        | Запуск проекта |
| EXCHANGE_ACCESS_KEY | Ключ доступа для источника данных [exchange.org](https://openexchangerates.org) в случае если DATA_SOURCE=EXCHANGE | 56bb0d460a2e404c91bcf6806e3c5611                                                                        | Запуск проекта |