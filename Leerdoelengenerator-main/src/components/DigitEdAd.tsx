import React from "react";

const DigitEdAd: React.FC = () => {
  return (
    <div
      className="border-2 border-[#247A38] rounded-2xl p-5 max-w-md mx-auto my-6 text-center shadow-sm hover:shadow-md transition-shadow"
    >
      <img
        src="https://digited.nl/wp-content/uploads/2025/05/logo5.png"
        alt="DigitEd logo"
        width={240}
        height={240}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="w-32 h-auto mx-auto mb-4"
        onError={(e) => {
          // Fallback: toon alleen de tekst als het extern logo niet laadt
          (e.currentTarget as HTMLImageElement).style.display = "none";
          const alt = document.createElement("div");
                  alt.innerHTML =
            '<span class="text-[#247A38]">Digit</span><span class="text-[#E3701C]">Ed</span>';
          alt.className = "text-2xl font-semibold mb-4";
          e.currentTarget.parentElement?.insertBefore(alt, e.currentTarget.nextSibling);
        }}
      />
      <h2 className="text-xl font-semibold mb-2">
        <span className="text-[#247A38]">Digit</span>
        <span className="text-[#E3701C]">Ed</span>
      </h2>
      <div className="hidden sm:block text-base leading-relaxed mb-4 text-left">
        <p>
          DigitEd helpt onderwijsprofessionals met praktische trainingen en begeleiding rond digitalisering en AI.
        </p>
        <p className="mt-2">
          <strong>Workshops & trainingen</strong> – AI in de klas, AI-geletterdheid, M365/Teams.
        </p>
        <p>
          <strong>Implementatie & advies</strong> – AI-ready leerdoelen, didactiek, veilige toolkeuze.
        </p>
        <p>
          <strong>Maatwerk & coaching</strong> – jullie eigen casus, templates & borging in de praktijk.
        </p>
      </div>
      <div className="sm:hidden text-base leading-relaxed mb-4 text-left">
        <p>
          <strong>Trainingen:</strong> AI in de klas & AI-geletterdheid.
        </p>
        <p>
          <strong>Advies:</strong> AI-ready leerdoelen & toolkeuze.
        </p>
        <p>
          <strong>Coaching:</strong> eigen casus, direct toepasbaar.
        </p>
      </div>
          alt.textContent = "DigitEd";
          alt.className = "text-2xl font-semibold text-[#247A38] mb-4";
          e.currentTarget.parentElement?.insertBefore(alt, e.currentTarget.nextSibling);
        }}
      />
      <h2 className="text-[#247A38] text-xl font-semibold mb-2">DigitEd</h2>
      <p className="text-base leading-relaxed mb-4">
        DigitEd helpt onderwijsprofessionals met praktische trainingen en begeleiding rond digitalisering en AI.
        Met hands-on workshops en inspirerende tools maak je jouw onderwijs klaar voor de toekomst.
      </p>
      <div className="mt-2 flex flex-col sm:flex-row justify-center gap-3">
        <a
          href="https://digited.nl/contact/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#247A38] text-white px-4 py-2 rounded-md font-bold hover:opacity-90 transition-opacity"
        >
          Neem contact op
        </a>
        <a
          href="https://www.linkedin.com/in/edwinspielhagen"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#E3701C] text-white px-4 py-2 rounded-md font-bold hover:opacity-90 transition-opacity"
        >
          Connect op LinkedIn
        </a>
      </div>
    </div>
  );
};

export default DigitEdAd;
