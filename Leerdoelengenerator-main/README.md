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
