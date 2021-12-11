# WZAS- Praktyczne wykorzystanie Web APIs w interakcji z użytkownikiem

Aplikacja umożliwia klientom wykonywać podstawowe akcji (przenieś, kopiuj, zmień nazwę, usuń, podgląd/edycja plików) na katalogach do których przyznano uprawnienia.
Dzięki zastosowaniu File System Access API, aplikacja działa w trybie klienckim, 
użytkownicy przyznają przeglądarce uprawnienia (ro, rw) do katalogów we własnym systemie.  
Pliki użytkownika nie są przechowywane na serwerze.


Zastosowanie niektórych z wykorzystanych API wymaga korzystania z **protokołu https**.  

Ze względu na konieczność wykorzystania **eksperymentalnych wersji WebAPIs** (brak implementacji w części przegląderek) 
sprawdzono poprawność działania **Edge/91** oraz **Chromium/96.0.4664.93**.

## Uruchomienie projektu

Pobranie zależności: `yarn install`

Uruchomienie aplikacji: `yarn start`

Aplikacja dostępna pod adresem:\
[https://localhost:3000](https://localhost:3000)



## Autorzy:

#### [Michał Maksajda](https://github.com/adjaskam) (lider) & [Paweł Guzek](https://github.com/pguzek1)
  - Moduł obsługi plików / katalogów (File System Access API)
  - Przenoszenie plików / katalogów (Drag-and-Drop API)

#### [Dominik Kasierski](https://github.com/DominikKasierski) & [Krzysztof Szcześniak](https://github.com/k-szczesniak)
  - Obsługa plików wideo / audio / kolejki odtwarzania
  - Picture In Picture API

#### [Artur Madaj](https://github.com/Arturro99) & [Wojciech Sowa](https://github.com/WojciechSova)
  - Nagrywanie obrazu z kamery oraz dźwięku z mikrofonu (Media Capture and Streams API)
  - Nagrywanie obrazu oraz dźwięku z pulpitu (Screen Capture API)

## Zrzuty ekranu działającej aplikacji

![Image01](https://github.com/TULbaghia/WZAS-File-Explorer/raw/master/.git_img/img01.png)
![Image02](https://github.com/TULbaghia/WZAS-File-Explorer/raw/master/.git_img/img02.png)
![Image03](https://github.com/TULbaghia/WZAS-File-Explorer/raw/master/.git_img/img03.png)
![Image04](https://github.com/TULbaghia/WZAS-File-Explorer/raw/master/.git_img/img04.png)
