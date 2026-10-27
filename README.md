# ToDo на GitHub Pages

Vue 3, Quasar, TypeScript и Pinia. Список задач, поиск, фильтры, настройки и темная тема.

Это статическая учебная версия. Задачи и настройки сохраняются в localStorage текущего браузера. Данные между устройствами не синхронизируются. Вход демонстрационный, настоящей проверки аккаунта нет. Переключатель email-уведомлений сохраняет настройку, но письма не отправляет.

## Публикация из Windows PowerShell

Нужны Git и GitHub CLI. Если их нет:

```powershell
winget install --id Git.Git -e
winget install --id GitHub.cli -e
```

После установки закрой PowerShell и открой заново. Перейди в распакованную папку todo-pages, в которой лежит package.json.

Войди в свой аккаунт через браузер. Токен в чат не нужен:

```powershell
gh auth login --hostname github.com --git-protocol https --web --scopes workflow
gh auth setup-git
```

Создай публичный репозиторий и загрузи проект:

```powershell
git init -b main
git add .
git -c user.name="Student" -c user.email="student@users.noreply.github.com" commit -m "Initial project [skip ci]"
gh repo create todo-quasar-app --public --source=. --remote=origin --push
```

Если репозиторий todo-quasar-app уже существует, укажи другое свободное название в команде gh repo create. Имена файлов и настройки менять не нужно.

Включи Pages и запусти публикацию:

```powershell
$repo = gh repo view --json nameWithOwner --jq .nameWithOwner
gh api --method POST "repos/$repo/pages" -f build_type=workflow
gh workflow run deploy.yml
gh repo view --web
```

На странице репозитория открой Actions, затем Deploy Pages. Дождись зеленого результата. Адрес сайта появится в Settings > Pages и в результате шага Publish.

Если gh api сообщает, что Pages уже включен, выбери Settings > Pages > Source > GitHub Actions вручную, затем повтори gh workflow run deploy.yml.

Если gh workflow run сразу после загрузки еще не находит workflow, открой Actions в браузере и запусти Deploy Pages кнопкой Run workflow, выбрав main.

Адрес сайта: https://YOUR_LOGIN.github.io/REPOSITORY_NAME/

Обычно публикация занимает несколько минут. При последующих push в main сайт обновляется автоматически.

## Локальный запуск

Нужен Node.js 22.22.2 или новее.

```powershell
npm ci
npm run dev
```

## Проверки

```powershell
npm run typecheck
npm run test:unit -- --maxWorkers=2 --minWorkers=1
npm run build
```

Проверка типов и production-сборка пройдены. Все 16 тестов прошли.

## Особенности Pages

Используется hash-маршрутизация, поэтому обновление страниц /#/settings и /#/login работает без серверных редиректов. Пути к ресурсам относительные, проект можно разместить в репозитории с любым именем. Шрифты и стили входят в сборку.

Фактическая публикация выполняется в твоем аккаунте после команд выше. Этот архив сам по себе не означает, что сайт уже опубликован.
