import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Tag,
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Fuel,
  Coffee,
  Sun,
  Snowflake,
  Flame,
  Zap,
} from 'lucide-react';
import { Station, AdSpace } from '../types';

interface RetailCrossPromoProps {
  stations: Station[];
  adSpaces: AdSpace[];
  onSelectStationAndOpenDetail: (stationId: number) => void;
}

export const RetailCrossPromo: React.FC<RetailCrossPromoProps> = ({
  stations,
  adSpaces,
  onSelectStationAndOpenDetail,
}) => {
  const [selectedQuarter, setSelectedQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q3');

  const quartersData = {
    Q1: {
      title: 'Q1: Zimná bezpečnosť & Horúce nápoje',
      months: 'Január – Marec',
      icon: Snowflake,
      color: 'sky',
      badge: 'Zima / Bezpečnosť',
      focusSummary:
        'Vodiči hľadajú rýchle zahriatie a funkčné produkty pre zimnú prevádzku auta. Klúčový je vizuálny kontakt pri vchode do predajne.',
      targetProducts: [
        'Zimné zmesi do ostrekovačov (-20°C / -40°C)',
        'Káva a čerstvé pečivo na zahriatie',
        'Rozmrazovače zámkov a stierače',
        'Zimné asistenčné služby a havarijné poistenie',
      ],
      idealClients: [
        { name: 'Dodávatelia autokozmetiky', example: 'Sheron, Dynamax, Sonax' },
        { name: 'Kávové značky & Gastro', example: 'Lavazza, Tchibo, Costa Coffee' },
        { name: 'Komerčné poisťovne', example: 'Allianz, Kooperativa, Generali' },
      ],
      recommendedFormats: [
        { type: 'Zóna 3: Vstupná zóna do shopu', note: 'Zasiahne 100% platiacich zákazníkov idúcich k pokladni' },
        { type: 'Totem / Cenovka (Spodný panel)', note: 'Viditeľný z diaľky pri spomaľovaní na čerpačku' },
        { type: 'Plagát pokladňa (A3 / A2)', note: 'Impulzný nákup drobného tovaru pri čakaní v rade' },
      ],
      salesPitch:
        '„Zákazník v zime nečaká vonku dlhšie než musí. Z výdajného stojanu smeruje rovno do vyhriatej predajne. Reklama na vstupných dverách a pri pokladni dosahuje v Q1 najvyššiu konverziu na nákup.“',
    },
    Q2: {
      title: 'Q2: Jarný reštart & Firemné flotily',
      months: 'Apríl – Jún',
      icon: Sun,
      color: 'emerald',
      badge: 'Jar / B2B Flotily',
      focusSummary:
        'Obdobie prezúvania, čistenia vozidiel po zime a obnovy firemných rozpočov. Prudký nárast využívania autoumyvární.',
      targetProducts: [
        'Autoumyvárne a prémiové voskovanie',
        'Letné pneumatiky a disky',
        'B2B palivové a nabíjacie karty',
        'Energetické nápoje a nealko na dlhé služobné cesty',
      ],
      idealClients: [
        { name: 'Pneuservisy & Autocentrá', example: 'Mikona, BestDrive, Auto Kelly' },
        { name: 'Firemné lízingy a banky', example: 'ČSOB Leasing, Tatra leasing, VÚB' },
        { name: 'Telekomunikační operátori', example: 'Orange, Telekom, O2 B2B' },
      ],
      recommendedFormats: [
        { type: 'Nozzletalker (Výdajné stojany)', note: 'Počas 3–5 minút tankovania priamy očný kontakt vodiča' },
        { type: 'Zóna 10: Autoumyváreň & Portál', note: 'Exkluzívna plocha počas čakania v autoumyvárke' },
        { type: 'Citylight (CLV) pri parkovisku', note: 'Zasiahne firemné flotily a obchodných zástupcov' },
      ],
      salesPitch:
        '„Na jar stúpa počet firemných jázd o 28%. Výdajný stojan je jediné reklamné médium na svete, ktoré vodič drží priamo v ruke celých 3 až 5 minút.“',
    },
    Q3: {
      title: 'Q3: Letný tranzit & Diaľničná dovolenka',
      months: 'Júl – September',
      icon: Flame,
      color: 'amber',
      badge: 'TOP Sezóna / Dovolenky',
      focusSummary:
        'Vrchol celoročnej návštevnosti! Rekordné tranzitné intenzity na D1 a R1. Rodiny, dovolenkári a medzinárodná doprava.',
      targetProducts: [
        'Energetické nápoje, balená minerálna voda, ľadové čaje',
        'Gastro: Hot dogy, bagety, zmrzliny',
        'Diaľničné známky, cestovné poistenie, roaming',
        'Letné festivaly, kúpaliská a aquaparky',
      ],
      idealClients: [
        { name: 'Globálne FMCG značky', example: 'Coca-Cola, Red Bull, Mattoni, Kofola' },
        { name: 'Pivovary (Nealko pivo)', example: 'Birell, Zlatý Bažant Radler 0.0' },
        { name: 'Turizmus & Zábava', example: 'Tatralandia, Bešeňová, Pohoda festival' },
      ],
      recommendedFormats: [
        { type: 'Billboard (5,1x2,4m) na diaľničných ťahoch', note: 'Maximálny dosah stoviek tisíc dovolenkových áut' },
        { type: 'Totemová obojstranná plocha', note: 'Jasný navigačný bod z diaľnice a privádzača' },
        { type: 'Digitálna obrazovka (DOOH) pri káve', note: 'Oddychová zóna s predĺženým časom zotrvania' },
      ],
      salesPitch:
        '„Júl a august generujú viac než 35% ročných impulzných gastro tržieb. Billboard pri vjazde na diaľničnú stanicu DALIOIL rozhoduje o tom, či si rodina dá prestávku práve u nás.“',
    },
    Q4: {
      title: 'Q4: Zimná príprava & Vianočné kampane',
      months: 'Október – December',
      icon: Zap,
      color: 'red',
      badge: 'Vianoce & Vernosť',
      focusSummary:
        'Nákupná horúčka, firemné vianočné odmeny a novoročné diaľničné známky. Vysoká frekvencia návštev lokálnych obyvateľov.',
      targetProducts: [
        'Ročné diaľničné známky na nový rok',
        'Darčekové poukážky a vernostné akcie',
        'Čokolády, bonboniéry a prémiové darčeky na poslednú chvíľu',
        'Zimná výbava vozidla a reťaze',
      ],
      idealClients: [
        { name: 'Veľké E-shopy', example: 'Alza.sk, Mall.sk, Datart' },
        { name: 'Spotrebiteľská elektronika & Darčeky', example: 'Samsung, NAY Elektrodom' },
        { name: 'Prémiové palivové aditíva', example: 'VIF, Castrol, Shell/Dalioil partner' },
      ],
      recommendedFormats: [
        { type: 'Plagát pokladňa & POS stojany', note: 'Nákupy na poslednú chvíľu pred sviatkami' },
        { type: 'Banner na plote / areáli', note: 'Zasiahne tranzit aj miestnych obyvateľov dochádzajúcich za nákupmi' },
        { type: 'Citylight (CLV) s osvetlením', note: 'V zimných mesiacoch je tma už od 16:30 – osvetlené CLV dominujú' },
      ],
      salesPitch:
        '„Od novembra je tma už o 16:30. Naše podsvietené Citylighty a osvetlené totemy sa stávajú najžiarivejším bodom na nočnej ceste, ktorý priťahuje 100% pohľadov.“',
    },
  };

  const currentQ = quartersData[selectedQuarter];
  const IconComponent = currentQ.icon;

  return (
    <div className="space-y-4 text-slate-800 dark:text-slate-100">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-600/10 via-red-600/10 to-amber-600/10 border border-amber-200 dark:border-amber-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-red-600 flex items-center justify-center text-white shadow-md">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Sezónny Retail Plánovač & Cross-Promo Sprievodca</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                Marketing Strategy
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-gray-400">
              Kvartálne retailové trendy, vhodné segmenty inzerentov a overené obchodné argumenty pre predaj plôch
            </p>
          </div>
        </div>

        <div className="flex gap-1 bg-white dark:bg-black/40 p-1 rounded-xl border border-slate-200 dark:border-gray-800">
          {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuarter(q)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedQuarter === q
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Main Quarter Detail View */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-200 dark:border-gray-800 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{currentQ.title}</span>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">({currentQ.months})</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-gray-400">{currentQ.focusSummary}</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            {currentQ.badge}
          </span>
        </div>

        {/* 3 Columns: Target Products, Ideal Clients, Recommended Formats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          {/* Target Products */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-800 space-y-2">
            <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
              <span>Prioritné tovarové kategórie</span>
            </h5>
            <ul className="space-y-1.5 text-slate-600 dark:text-gray-300 text-[11px]">
              {currentQ.targetProducts.map((p, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ideal Clients */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-800 space-y-2">
            <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <Users className="w-3.5 h-3.5 text-sky-500" />
              <span>Kľúčoví inzerenti na oslovenie</span>
            </h5>
            <div className="space-y-2">
              {currentQ.idealClients.map((client, i) => (
                <div key={i} className="p-2 rounded-lg bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800/80">
                  <div className="font-bold text-slate-900 dark:text-white text-[11px]">{client.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-gray-400">Príklady: {client.example}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Formats */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-gray-800 space-y-2">
            <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Odporúčané formáty nosičov</span>
            </h5>
            <div className="space-y-2">
              {currentQ.recommendedFormats.map((fmt, i) => (
                <div key={i} className="p-2 rounded-lg bg-white dark:bg-[#151b27] border border-slate-200 dark:border-gray-800/80">
                  <div className="font-bold text-amber-700 dark:text-amber-400 text-[11px]">{fmt.type}</div>
                  <div className="text-[10px] text-slate-500 dark:text-gray-400">{fmt.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Pitch Quote Box */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/40 text-xs">
          <div className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 tracking-wider mb-1 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Predajný argument pre Area manažéra ({selectedQuarter})</span>
          </div>
          <p className="text-slate-700 dark:text-amber-200 italic font-medium leading-relaxed">
            {currentQ.salesPitch}
          </p>
        </div>
      </div>
    </div>
  );
};
