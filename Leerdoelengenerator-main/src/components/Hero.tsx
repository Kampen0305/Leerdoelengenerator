import React from "react";

export function Hero() {
  const scrollToForm = () => {
    document.getElementById("form-start")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8 py-16 text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
          Leerdoelengenerator
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Genereer toetsbare leerdoelen in helder Nederlands, afgestemd op Npuls-richtlijnen (AI-bewuste toetsing, AI-geletterdheid)
        </p>
        <ul className="mx-auto w-fit list-disc list-inside space-y-2 text-left text-gray-700 dark:text-gray-300">
          <li>Conform Two-Lane approach</li>
          <li>SMART en toetsbaar</li>
          <li>Transparant over AI-gebruik</li>
        </ul>
        <button
          onClick={scrollToForm}
          className="rounded-lg bg-gradient-to-r from-green-600 to-orange-500 px-6 py-3.5 font-medium text-white hover:from-green-700 hover:to-orange-600"
        >
          Aan de slag
        </button>
      </div>
    </section>
  );
}

