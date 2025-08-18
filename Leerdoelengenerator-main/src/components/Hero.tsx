import React from "react";

export function Hero() {
  const scrollToForm = () => {
    document.getElementById("form-start")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-prose px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Leerdoelengenerator
        </h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Genereer toetsbare leerdoelen in helder Nederlands, afgestemd op Npuls-richtlijnen (AI-bewuste toetsing, AI-geletterdheid)
        </p>
        <ul className="mt-6 mx-auto w-fit list-disc list-inside space-y-2 text-left text-gray-700 dark:text-gray-300">
          <li>Conform Two-Lane approach</li>
          <li>SMART en toetsbaar</li>
          <li>Transparant over AI-gebruik</li>
        </ul>
        <button
          onClick={scrollToForm}
          className="mt-8 rounded-lg bg-gradient-to-r from-green-600 to-orange-500 px-6 py-3 font-medium text-white hover:from-green-700 hover:to-orange-600"
        >
          Aan de slag
        </button>
      </div>
    </section>
  );
}

