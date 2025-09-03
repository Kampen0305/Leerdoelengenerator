Leerdoelengenerator

## UI-conventies Bloom (NL)

Bloom-niveaus worden in de interface weergegeven als Nederlandse labels met een korte uitleg.
Voorbeeld: `Niveau volgens Bloom: Toepassen — de student gebruikt kennis in een praktische situatie.`
Bij meerdere niveaus worden labels en beschrijvingen door komma's en "en" gescheiden.

## Feedback via e-mail

Stel de volgende omgevingsvariabelen in om feedbackmails te ontvangen:

- `RESEND_API_KEY`
- `FEEDBACK_TO_EMAIL`
- `SITE_NAME` (optioneel)

De route `/api/feedback` verstuurt sterrenbeoordelingen en een optionele opmerking naar het opgegeven e-mailadres.
Deze API-route draait op de Node-runtime zodat de Resend-SDK correct werkt.
Met `GET /api/feedback/selftest` kun je een testmail naar hetzelfde adres sturen om de configuratie te controleren.

### Payload

`POST /api/feedback` verwacht JSON met het volgende formaat:

```json
{
  "stars": 1,               // verplicht: aantal sterren (1–5)
  "comment": "...",        // optioneel: extra toelichting
  "path": "/huidige/pagina", // optioneel: pad van de pagina
  "ua": "user-agent"       // optioneel: user agent string
}
```

Bij geldige invoer geeft de server `{ "ok": true }` terug.
Ontbrekende of ongeldige velden leveren een duidelijke foutmelding met HTTP 400.
