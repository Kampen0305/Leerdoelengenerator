import React from "react";

export default function About() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Transparantie &amp; Verantwoording</h1>

      <section>
        <h2 className="text-xl font-semibold mt-4">Hoe werkt de generator</h2>
        <p className="mt-2 text-gray-700">
          Onze tool gebruikt een groot taalmodel om aangeleverde leeruitkomsten te herschrijven.
          De ruwe output gaat daarna door een set regels en controles zodat formuleringen duidelijk,
          haalbaar en passend bij het onderwijsniveau worden.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4">Raamwerken en bronnen</h2>
        <p className="mt-2 text-gray-700">
          We baseren ons op Npuls Visie en Handreikingen, AI-GO en het Referentiekader 2.0 om
          verantwoorde keuzes te maken rond transparantie, inclusie en kwaliteitsbewaking.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4">Privacy &amp; ontwerp</h2>
        <p className="mt-2 text-gray-700">
          De generator verwerkt geen persoonsgegevens. Alles wat je invoert blijft lokaal in je browser
          en wordt niet opgeslagen op onze servers. Met privacy-by-design beperken we gegevens tot het
          strikt noodzakelijke en bouwen we functies zodat delen of exporteren alleen gebeurt op jouw
          initiatief.
        </p>
      </section>
    </main>
  );
}
