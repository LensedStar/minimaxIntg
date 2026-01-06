Конечно. Ниже — **единый готовый текст**, без эмодзи и без лишних пояснений. Его можно **просто скопировать и вставить** заказчику или их технической команде.

---

Интеграция с Minimax выполнена и протестирована. Подключение работает через REST API с использованием OAuth2 (password grant).

Для работы интеграции необходимы следующие данные:

1. `client_id`
2. `client_secret`
3. `username` внешнего приложения
4. `password` внешнего приложения

`username` и `password` создаются в Minimax в разделе:
Profile → “Gesla za dostop zunanjih aplikacij”.

Получение access token выполняется следующим образом.

Endpoint:

```
POST https://moj.minimax.si/si/aut/oauth20/token
```

Заголовок:

```
Content-Type: application/x-www-form-urlencoded
```

Тело запроса:

```
grant_type=password
client_id=...
client_secret=...
username=...
password=...
scope=api
```

В ответ возвращается объект с `access_token`, `token_type` и `expires_in`.

Дальнейшие запросы к Minimax REST API выполняются с использованием полученного `access_token`.

Base URL API:

```
https://moj.minimax.si/si/api
```

Обязательный заголовок для всех запросов:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

Пример вызова REST API (GET):

```
GET https://moj.minimax.si/si/api/...
Authorization: Bearer <access_token>
```

В рамках тестирования использовался серверный подход (Node.js), при котором:

* токен получается на сервере;
* токен хранится на сервере;
* все REST-запросы к Minimax выполняются сервером с подставленным `Authorization` заголовком.

Рекомендуемый подход для production:

* хранить `client_id`, `client_secret`, `username`, `password` в переменных окружения;
* учитывать срок жизни токена (`expires_in`) и обновлять его при необходимости;
* ограничить список доступных REST-эндпоинтов (whitelist);
* логировать ошибки и ответы Minimax для диагностики.

REST API подтверждено работает, получение токена и выполнение GET-запросов успешно протестированы.


Пример GET полный 


{
  "url": "https://moj.minimax.si/si/api/currentuser/profile",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer <access_token>",
    "Content-Type": "application/json"
  },
  "body": null
}

