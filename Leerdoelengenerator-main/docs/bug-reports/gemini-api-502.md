# 📝 Taak: Oplossen van Gemini API Storing (502 Bad Gateway)

| Categorie  | Waarde                          |
|------------|---------------------------------|
| Prioriteit | Hoog (Serviceverstoring)        |
| Component  | Backend (API-gateway / Gemini-integratie) |
| Statuscode | 502 Bad Gateway                 |

## 1. Probleembeschrijving
De frontend-applicatie ontvangt consequent een HTTP 502 Bad Gateway-fout wanneer de route `/api/gemini-generate:1` wordt aangeroepen. In de browserconsole verschijnt de melding `Error: Upstream Gemini error`, wat erop wijst dat de backend-service geen geldige reactie ontvangt van de externe Gemini API of deze niet kan bereiken.

## 2. Te nemen stappen
1. **Backendlogs controleren** – Onderzoek de serverlogs voor de route `/api/gemini-generate:1` om te achterhalen welke foutstatus en payload de externe Gemini API retourneert (bijv. 401, 408, 500).
2. **Serverstatus verifiëren** – Bevestig dat de applicatieserver die de Gemini-aanroep uitvoert actief is en luistert op de juiste poort.
3. **Netwerk-/proxycontrole uitvoeren** – Bekijk de configuratie en logs van eventuele load balancers of proxy's (zoals Nginx) voor time-outs of verbindingsproblemen.
4. **Oorzaak oplossen** – Los de upstream-fout op op basis van de bevindingen, bijvoorbeeld door API-sleutels te vernieuwen, time-outs te verhogen of code aan te passen voor onverwachte responses.
5. **Testen** – Valideer dat `/api/gemini-generate:1` weer een HTTP 200-respons retourneert en dat de melding `Upstream Gemini error` verdwenen is.

## 3. Referentielogregel
```
Failed to load resource: the server responded with a status of 502 () /api/gemini-generate:1
[Gemini] generateAIReadyObjective error: Error: Upstream Gemini error
```

## 4. Verwachte uitkomst
* De backend kan succesvol communiceren met de Gemini API zonder 502-fout.
* De frontend krijgt een geldige respons terug en toont geen `Upstream Gemini error` meer.
* Monitoring en logging bevatten voldoende informatie om toekomstige incidenten sneller te diagnosticeren.
