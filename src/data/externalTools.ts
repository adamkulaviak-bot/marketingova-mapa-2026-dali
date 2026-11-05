export interface ToolModuleItem {
  name: string;
  desc: string;
  count?: string;
}

export interface ExternalToolItem {
  id: string;
  category: 'checklists' | 'reclamations' | 'elearning';
  categoryLabel: string;
  group: string; // Jemnejšie logické zoskupenie (napr. 'Starbucks kaviarenské kútiky', 'Prevádzkové kontroly DALIOIL', 'Základné zaškolenie personálu')
  subCategoryId: string;
  subCategoryLabel: string;
  title: string;
  subtitle: string;
  url: string;
  description: string;
  targetRole: 'all' | 'manager' | 'staff' | 'inspector' | 'dispatcher' | 'customer';
  targetRoleLabel: string;
  targetAudience?: string;
  format: 'app' | 'video' | 'presentation' | 'dashboard' | 'drive';
  formatLabel: string;
  frequencyOrFormat?: string;
  estimatedTime: string;
  device: 'Mobil & Tablet' | 'Desktop & Mobil' | 'PC & Dispečing' | 'Všetky zariadenia';
  outputTarget: string; // Kde sa ukladajú dáta alebo kde beží výstup
  actionLabel: string;
  highlights: string[];
  modules?: ToolModuleItem[];
  badgeColor: string;
  badgeText: string;
  iconType: 'coffee' | 'clipboard-check' | 'sparkles' | 'store' | 'qr-code' | 'layout-dashboard' | 'graduation-cap' | 'video' | 'monitor' | 'box';
}

export const EXTERNAL_TOOLS: ExternalToolItem[] = [
  // =========================================================================
  // 1. CHECKLISTY A INŠPEKČNÉ AUDITY
  // =========================================================================
  {
    id: 'starbucks-checklists',
    category: 'checklists',
    categoryLabel: 'Checklisty a kontroly',
    group: 'Kaviarenské kútiky Starbucks',
    subCategoryId: 'starbucks_daily',
    subCategoryLabel: 'Denné & periodické kontroly',
    title: 'Kontrolné checklisty Starbucks',
    subtitle: 'Pravidelné previerky kávovarových kútikov Starbucks',
    url: 'https://storied-croissant-e95024.netlify.app',
    description:
      'Mobilná aplikácia pre personál, vedúcich staníc a inšpektorov na denné aj periodické previerky Starbucks kútikov. Overuje čistotu, zásoby a funkčnosť kávovaru a výsledky ihneď ukladá do centrálnej riadiacej tabuľky.',
    targetRole: 'staff',
    targetRoleLabel: 'Obsluha stanice, Vedúci ČS, Area manažér',
    targetAudience: 'Zodpovedný vedúci prevádzky, Area manažér, Externý kontrolór',
    format: 'app',
    formatLabel: 'Mobilná web aplikácia',
    frequencyOrFormat: '4 frekvencie: ranná, priebežná, týždenná a mesačná',
    estimatedTime: '2–4 min',
    device: 'Mobil & Tablet',
    outputTarget: 'Google Sheets: Centrálny Starbucks Log',
    actionLabel: 'Spustiť checklist',
    highlights: [
      '4 úrovne kontroly podľa frekvencie (ranná pred zmenou, priebežná cez deň, týždenná, mesačná)',
      '3 kategórie kontrolórov: obsluha prevádzky, vedúci ČS, area manažér',
      'Jednoduché hodnotenie položiek jedným ťuknutím (splnené / nesplnené)',
      'Priamy fotodôkaz z fotoaparátu mobilu v prípade zistených nedostatkov',
      'Okamžitý zápis do spoločnej tabuľky pre vedenie siete a dodávateľa',
    ],
    modules: [
      { name: 'Ranná kontrola (pred otvorením)', desc: 'Preplach kávovaru, zásoba mlieka, čistota odkvapkávacej misky a pohárov', count: '6 položiek' },
      { name: 'Priebežná kontrola (počas zmeny)', desc: 'Stav kávových zŕn, čistota pracovnej dosky a doplnenie sirupov', count: '5 položiek' },
      { name: 'Týždenná hĺbková údržba', desc: 'Čistenie mliečnych ciest tabletami, kontrola expirácie surovín a filtra', count: '8 položiek' },
      { name: 'Mesačná manažérska inšpekcia', desc: 'Technická kontrola tlaku, stavu POS stojanov a sanitácie', count: '10 položiek' },
    ],
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    badgeText: 'Starbucks denná & mesačná',
    iconType: 'coffee',
  },
  {
    id: 'starbucks-audit',
    category: 'checklists',
    categoryLabel: 'Checklisty a kontroly',
    group: 'Kaviarenské kútiky Starbucks',
    subCategoryId: 'starbucks_audit',
    subCategoryLabel: 'Hĺbkový audit kvality',
    title: 'Audit kvality Starbucks',
    subtitle: 'Hĺbkový 40-otázkový audit štandardov kvality Starbucks',
    url: 'https://admirable-malasada-6b41cd.netlify.app',
    description:
      'Špecializovaný inšpekčný nástroj s 40 konkrétnymi auditnými otázkami pre manažérov kvality. Preveruje presné dodržiavanie štandardov Starbucks, vyčísľuje percentuálne skóre a generuje report s fotodokumentáciou.',
    targetRole: 'inspector',
    targetRoleLabel: 'Manažér kvality, Area manažér, Externý audítor',
    targetAudience: 'Vedúci a manažéri kvality Starbucks kútikov na ČS',
    format: 'app',
    formatLabel: 'Auditný inšpekčný systém',
    frequencyOrFormat: 'Pravidelný mesačný audit / náhodná kontrola',
    estimatedTime: '12–18 min',
    device: 'Mobil & Tablet',
    outputTarget: 'Centrálna tabuľka auditov so skóre a fotogalériou',
    actionLabel: 'Spustiť 40-bodový audit',
    highlights: [
      '40 precízne formulovaných auditných otázok pokrývajúcich všetky kritické štandardy',
      'Detailné preverenie čistoty automatu, teploty mlieka, čerstvosti zŕn a POS vizuálov',
      'Automatický výpočet percentuálneho skóre úspešnosti prevádzky (KPI index)',
      'Priame pripojenie fotodôkazu z mobilu ku každej nevyhovujúcej položke',
      'Benchmarkové porovnávanie výsledkov naprieč celou sieťou čerpacích staníc',
    ],
    modules: [
      { name: '1. Čistota a hygiena kútika', desc: 'Vizuálny stav stolíka, odpadkový kôš, čistota automatu a okolia', count: '10 otázok' },
      { name: '2. Technický stav kávovaru', desc: 'Tlakové parametre, správna teplota nápojov, výdaj pary a čistenie', count: '10 otázok' },
      { name: '3. Zásoby a kvalita surovín', desc: 'Starbucks zrná, trvanlivosť mlieka, originálne sirupy, kelímky a viečka', count: '10 otázok' },
      { name: '4. Merchandising & Zákaznícky komfort', desc: 'Správne umiestnenie cenoviek, letákov, cukru a obrúskov', count: '10 otázok' },
    ],
    badgeColor: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/30',
    badgeText: '40 otázok • Percentuálne skóre',
    iconType: 'clipboard-check',
  },
  {
    id: 'dalioil-general-checklist',
    category: 'checklists',
    categoryLabel: 'Checklisty a kontroly',
    group: 'Prevádzkové kontroly DALIOIL',
    subCategoryId: 'dalioil_general',
    subCategoryLabel: 'Kompletná inšpekcia stanice',
    title: 'Celkový kontrolný checklist Dalioil',
    subtitle: 'Komplexná inšpekcia čerpacej stanice priamo v mobile',
    url: 'https://deluxe-puppy-8c4441.netlify.app',
    description:
      'Univerzálny inšpekčný nástroj rozdelený do 5 samostatných modulov. Umožňuje kontrolórovi vybrať buď celkovú previerku celej stanice, alebo len špecifickú sekciu (exteriér, interiér, umyváreň, reklama, personál).',
    targetRole: 'manager',
    targetRoleLabel: 'Vedúci stanice, Area manažér, Inšpektor prevádzky',
    targetAudience: 'Kontrolóri a manažéri siete čerpacích staníc Dalioil',
    format: 'app',
    formatLabel: 'Modulárna inšpekčná aplikácia',
    frequencyOrFormat: 'Pravidelná inšpekcia stanice (týždenná / mesačná)',
    estimatedTime: '8–15 min',
    device: 'Mobil & Tablet',
    outputTarget: 'Google Sheets: Dalioil_Central_Inspections',
    actionLabel: 'Otvoriť inšpekciu stanice',
    highlights: [
      'Možnosť vybrať len jeden konkrétny modul alebo spustiť celkovú inšpekciu',
      'Jednoduché odpovede: Áno, Nie alebo Nedá sa ohodnotiť + hviezdičkové hodnotenie závažnosti',
      'Okamžité nahratie fotografie z miesta nedostatku a textový komentár',
      '5 samostatných zón: Exteriér, Predajňa, Autoumyváreň, Reklamné nosiče a Správanie personálu',
      'Automatické ukladanie do cloudu pre manažment siete a plánovanie nápravných opatrení',
    ],
    modules: [
      { name: 'Modul 1: Exteriér stanice & Výdajné stojany', desc: 'Čistota ostrovčekov, pištole, hadice, osvetlenie totemu a parkovisko', count: '12 bodov' },
      { name: 'Modul 2: Interiér predajne & Pokladničná zóna', desc: 'Vystavenie tovaru, cenovky, čistota podláh, regály a chladničky', count: '14 bodov' },
      { name: 'Modul 3: Autoumyváreň (Portál & VAP)', desc: 'Stav chémie, funkčnosť trysiek, čistota boxov a kompresora', count: '8 bodov' },
      { name: 'Modul 4: Reklamné nosiče (OOH & POS)', desc: 'Osvetlenie billboardov, nepoškodené plagáty CLV a stojanové polepy', count: '6 bodov' },
      { name: 'Modul 5: Personál a štandardy obsluhy', desc: 'Firemné oblečenie, menovka, ústretovosť, aktívny predaj a čistota', count: '8 bodov' },
    ],
    badgeColor: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
    badgeText: '5 modulov • Exteriér & Interiér',
    iconType: 'sparkles',
  },
  {
    id: 'dalioil-new-station-checklist',
    category: 'checklists',
    categoryLabel: 'Checklisty a kontroly',
    group: 'Prevádzkové kontroly DALIOIL',
    subCategoryId: 'new_station_expansion',
    subCategoryLabel: 'Príprava & otvorenie novej ČS',
    title: 'Interaktívny checklist – otvorenie novej ČS',
    subtitle: 'Riadenie príprav a úloh pred spustením novej prevádzky',
    url: 'https://cheery-kataifi-612731.netlify.app',
    description:
      'Projektový task manažér pre hladké a bezchybné spustenie novej prevádzky. Združuje stovky úloh naprieč oddeleniami (IT, technológie, marketing, personalistika, legislatíva) s priradenými termínmi a zodpovednosťami.',
    targetRole: 'manager',
    targetRoleLabel: 'Projektoví manažéri, Expanzia, Technici, Vedúci novej ČS',
    targetAudience: 'Projektoví manažéri, oddelenia expanzie, technici a vedúci prevádzky',
    format: 'app',
    formatLabel: 'Projektový task manažér',
    frequencyOrFormat: 'Fáza prípravy, výstavby a spustenia novej prevádzky',
    estimatedTime: 'Priebežný projekt',
    device: 'Desktop & Mobil',
    outputTarget: 'Cloudový projektový manažment otvorení ČS',
    actionLabel: 'Zobraziť harmonogram úloh',
    highlights: [
      'Prehľadný rozpis všetkých úloh podľa zodpovedných osôb a oddelení',
      'Filtrovanie podľa stavu: Čaká na vybavenie, Rozpracované, Splnené',
      'Jedným klikom sa úloha označí ako hotová a vizuálne presunie bokom',
      'Okamžitá identifikácia úzkych miest a omeškaných termínov pred kolaudáciou',
      'Nulová potreba neprehľadných Excel tabuliek a zdĺhavých telefonátov',
    ],
    modules: [
      { name: '1. Fáza: Stavebno-technická pripravenosť', desc: 'Revízie nádrží, certifikácia stojanov, elektrina, voda, kolaudácia', count: '14 úloh' },
      { name: '2. Fáza: IT & Pokladničný systém', desc: 'Inštalácia POS pokladníc, internetové pripojenie, tankomaty a kamery', count: '10 úloh' },
      { name: '3. Fáza: Personál & Školenia', desc: 'Nábor obsluhy, zmluvy, školenie BOZP, pokladňa a štandardy servisu', count: '8 úloh' },
      { name: '4. Fáza: Merchandising & Zásoby tovaru', desc: 'Zaskladnenie palív, shopu, kávových zŕn a gastro sortimentu', count: '12 úloh' },
      { name: '5. Fáza: Marketing & Branding', desc: 'Montáž cenového totemu, polepy výdajných stojanov, otvorenie kampane', count: '8 úloh' },
    ],
    badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    badgeText: 'Otvorenie ČS • Task manažment',
    iconType: 'store',
  },

  // =========================================================================
  // 2. REKLAMÁCIE A ZÁKAZNÍCKY SERVIS
  // =========================================================================
  {
    id: 'qr-reclamations',
    category: 'reclamations',
    categoryLabel: 'Reklamácie & Podnety',
    group: 'Zákaznícka spätná väzba',
    subCategoryId: 'customer_qr',
    subCategoryLabel: 'Zákaznícky mobilný formulár',
    title: 'Reklamácie z QR kódov',
    subtitle: 'Verejný zákaznícky reklamačný formulár staníc Dalioil',
    url: 'http://reklamacie.dalioil.sk',
    description:
      'Jednoduchý a rýchly online reklamačný formulár pre motoristov na čerpacej stanici. Zákazník naskenuje QR kód priamo na stojane alebo pri pokladni a behom minúty odošle podnet aj s fotografiou priamo na dispečing.',
    targetRole: 'customer',
    targetRoleLabel: 'Motoristi a zákazníci staníc Dalioil',
    targetAudience: 'Zákazníci a motoristi čerpacích staníc Dalioil',
    format: 'app',
    formatLabel: 'Responzívny verejný formulár',
    frequencyOrFormat: 'Online formulár dostupný 24/7 (vyplnenie do 60 sekúnd)',
    estimatedTime: '1 min',
    device: 'Mobil & Tablet',
    outputTarget: 'Centrálny reklamačný dispečing + e-mailové notifikácie',
    actionLabel: 'Otvoriť zákaznícky formulár',
    highlights: [
      'Okamžité nahlásenie problému: technická porucha stojanu, nesprávne zaúčtovanie, škodová udalosť',
      'Priame naskenovanie QR kódu na výdajnom stojane alebo predajni',
      'Formulár plne optimalizovaný pre mobilné telefóny – vyplnenie za menej než 1 minútu',
      'Možnosť nahrať fotku bločku, poškodenia alebo chybovej hlášky stojanu',
      'Okamžitá e-mailová notifikácia pre riešiteľov a potvrdenie s číslom prípadu pre klienta',
    ],
    modules: [
      { name: 'Krok 1: Výber stanice & zariadenia', desc: 'Lokalizácia ČS a označenie stojanu, umyvárky alebo pokladne', count: 'Automaticky' },
      { name: 'Krok 2: Typ udalosti', desc: 'Finančná nezrovnalosť / Technická porucha / Poistná udalosť / Iné', count: '1 klik' },
      { name: 'Krok 3: Popis & Fotodôkaz', desc: 'Stručný popis situácie s možnosťou priložiť fotografiu z mobilu', count: 'Foto z kamery' },
      { name: 'Krok 4: Kontaktné údaje', desc: 'Meno, telefón a e-mail pre zaslanie potvrdenia a vyriešenie', count: 'Okamžitý zápis' },
    ],
    badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    badgeText: 'QR kód na stanici • Zákazníci',
    iconType: 'qr-code',
  },
  {
    id: 'reclamations-dashboard',
    category: 'reclamations',
    categoryLabel: 'Reklamácie & Podnety',
    group: 'Interný reklamačný dispečing',
    subCategoryId: 'internal_dispatch',
    subCategoryLabel: 'Centrálny riadiaci dispečing',
    title: 'Dashboard pre prijaté reklamácie',
    subtitle: 'Centrálny riadiaci dispečing a riešenie sťažností',
    url: 'https://script.google.com/macros/s/AKfycbxDsOR7YbJEWVdo3-tWheNteSgJTPKBL1vqTuIkJEiHyWGaS6ZZdD9w5Di3P1d9zZWFPg/exec',
    description:
      'Interná riadiaca centrála pre manažérov a technikov Dalioil. Združuje všetky prijaté reklamácie na jednom mieste, umožňuje priradiť riešiteľa, sledovať lehotu vybavenia (SLA) a viesť kompletnú históriu komunikácie.',
    targetRole: 'dispatcher',
    targetRoleLabel: 'Dispečeri, Prevádzkoví manažéri, Finančné oddelenie',
    targetAudience: 'Dispečeri, manažéri prevádzky, finančné a technické oddelenie Dalioil',
    format: 'dashboard',
    formatLabel: 'Live riadiaci dispečing (Google WebApp)',
    frequencyOrFormat: 'Interný live monitoring 24/7 s filtrami',
    estimatedTime: 'Live systém',
    device: 'PC & Dispečing',
    outputTarget: 'Centrálna Google Workspace databáza reklamácií',
    actionLabel: 'Otvoriť riadiaci dispečing',
    highlights: [
      'Kompletný zoznam reklamácií s filtrom podľa stavu: Nová, V riešení, Vyriešená, Zamietnutá',
      'Priradenie konkrétneho zodpovedného riešiteľa a sledovanie dodržania termínu vybavenia (SLA)',
      'Prehľadná kategorizácia podnetov: finančné (platby/karty), technické (stojany/VAP) a poistné',
      'Priamy prístup k fotografiám a bločkom nahraným zákazníkom',
      'Kompletný auditný záznam histórie riešenia a interných poznámok k prípadu',
    ],
    modules: [
      { name: 'Prehľad nových podnetov', desc: 'Čas príchodu, dotknutá ČS, kategória a priorita riešenia', count: 'Live feed' },
      { name: 'Priradenie riešiteľa & SLA', desc: 'Delegovanie na servisného technika alebo účtovníka s termínom', count: 'SLA sledovanie' },
      { name: 'Detail prípadu & Dôkazy', desc: 'Zobrazenie fotiek, znenia sťažnosti a údajov z pokladne', count: 'Archív' },
      { name: 'Uzatvorenie & Odpoveď', desc: 'Zápis výsledku šetrenia a odoslanie vyrozumenia klientovi', count: 'História' },
    ],
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    badgeText: 'Interný dispečing • SLA sledovanie',
    iconType: 'layout-dashboard',
  },

  // =========================================================================
  // 3. E-LEARNINGY A ŠKOLIACE MATERIÁLY
  // =========================================================================
  {
    id: 'elearning-pos-training',
    category: 'elearning',
    categoryLabel: 'E-learning & Školenia',
    group: 'Základné zaškolenie personálu (Onboarding)',
    subCategoryId: 'pos_training',
    subCategoryLabel: 'Pokladničný systém & Predaj',
    title: 'Obsluha pokladničného systému',
    subtitle: 'Interaktívne školenie pre prácu s pokladňou (.pptx + videá)',
    url: 'https://drive.google.com/drive/folders/1QL0Y6lRIf7-VN-4LLe9H-dyKZ1-GLR2q?usp=sharing',
    description:
      'Kľúčový školiaci kurz pre obsluhu pokladnice na čerpacej stanici. Vo formáte interaktívnej PPTX prezentácie s vnorenými videami detailne ukazuje bežný predaj paliva, platby kartami, zľavy, storná a zmenovú uzávierku.',
    targetRole: 'staff',
    targetRoleLabel: 'Nová obsluha ČS, Vedúci zmeny, Brigádnici',
    targetAudience: 'Obsluha čerpacej stanice, noví zamestnanci a vedúci zmeny',
    format: 'presentation',
    formatLabel: 'Prezentácia .PPTX s vnorenými videami',
    frequencyOrFormat: 'Vstupný onboarding + pravidelné doškoľovanie',
    estimatedTime: '30–45 min',
    device: 'Desktop & Mobil',
    outputTarget: 'Google Drive: Priečinok školení pokladne',
    actionLabel: 'Stiahnuť / Spustiť školenie pokladne',
    highlights: [
      'Názorné videoukážky postupu pri obsluhe výdajného terminálu na kase',
      'Predaj paliva, shopového tovaru a gastro sortimentu krok za krokom',
      'Správny postup pri platbách hotovosťou, platobnými kartami a DALI palivovými kartami',
      'Riešenie neštandardných situácií: stornovanie položky, reklamácia a zmenové uzávierky',
      'Ideálny nástroj na okamžité zaškolenie nováčikov bez nutnosti prítomnosti školiteľa',
    ],
    modules: [
      { name: '1. Základy pokladničného rozhrania', desc: 'Prihlásenie pokladníka, orientácia v menu a zobrazenie stojanov', count: 'Video lekcia 1' },
      { name: '2. Výdaj a blokovanie paliva', desc: 'Prijatie stojanu, hotovostná platba, banková karta a palivové karty', count: 'Video lekcia 2' },
      { name: '3. Predaj doplnkového tovaru a gastra', desc: 'Skenovanie čiarových kódov, akcie, zálohovanie obalov a zľavy', count: 'Video lekcia 3' },
      { name: '4. Storná, opravy a zmenová uzávierka', desc: 'Postup pri chybe blokovania, tlač dennej a zmenovej finančnej uzávierky', count: 'Video lekcia 4' },
    ],
    badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    badgeText: 'Prezentácia .pptx s videami',
    iconType: 'monitor',
  },
  {
    id: 'elearning-service-standards',
    category: 'elearning',
    categoryLabel: 'E-learning & Školenia',
    group: 'Základné zaškolenie personálu (Onboarding)',
    subCategoryId: 'service_standards',
    subCategoryLabel: 'Štandardy zákazníckeho servisu',
    title: 'Štandardy zákazníckeho servisu Dalioil',
    subtitle: 'Školiace video zamerané na správanie obsluhy voči zákazníkom',
    url: 'https://drive.google.com/drive/folders/1QL0Y6lRIf7-VN-4LLe9H-dyKZ1-GLR2q?usp=sharing',
    description:
      'Profesionálne inštruktážne video vysvetľujúce kódex správania obsluhy na čerpacích staniciach Dalioil. Zameriava sa na prvý dojem, ústretovosť, aktívny predaj kávy a občerstvenia a riešenie náročných situácií.',
    targetRole: 'staff',
    targetRoleLabel: 'Všetok personál a vedúci staníc Dalioil',
    targetAudience: 'Obsluha a personál všetkých čerpacích staníc Dalioil',
    format: 'video',
    formatLabel: 'Školiace inštruktážne video (Full HD)',
    frequencyOrFormat: 'Základné vstupné školenie servisu',
    estimatedTime: '15 min',
    device: 'Všetky zariadenia',
    outputTarget: 'Google Drive: Video knižnica štandardov',
    actionLabel: 'Prehrať školiace video',
    highlights: [
      'Pravidlá prvého kontaktu: pozdrav, očný kontakt, úsmev a firemná kultúra Dalioil',
      'Princípy aktívneho predaja: ponuka prémiovej kávy, čerstvého pečiva a akciových produktov',
      'Reprezentácia značky: čistota pracoviska, nosenie firemného odevu a menovky',
      'Zvládanie konfliktov a komunikácia s náročným alebo nespokojným motoristom',
      'Budovanie dôvery a dôvodov, prečo sa zákazník na stanicu rád vráti',
    ],
    modules: [
      { name: 'Blok 1: Privítanie & Prvý dojem', desc: 'Pozdrav, ústretový postoj za pultom a udržiavanie čistoty kasy', count: '3 min' },
      { name: 'Blok 2: Aktívna ponuka (Upselling)', desc: 'Ako prirodzene ponúknuť kávu, bagetu alebo sezónnu zľavu bez nátlaku', count: '5 min' },
      { name: 'Blok 3: Riešenie námietok a stresu', desc: 'Zachovanie pokoja, empatické počúvanie a okamžité riešenie problému', count: '4 min' },
      { name: 'Blok 4: Rozlúčka & Vernosť', desc: 'Poďakovanie za návštevu a pozvanie na ďalšie tankovanie', count: '3 min' },
    ],
    badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    badgeText: 'Školiace video servisu',
    iconType: 'video',
  },
  {
    id: 'elearning-ai-video-guides',
    category: 'elearning',
    categoryLabel: 'E-learning & Školenia',
    group: 'Digitálne systémy & AI návody',
    subCategoryId: 'ai_guides',
    subCategoryLabel: 'Videonávody k AI systémom',
    title: 'Videonávody k AI riešeniam',
    subtitle: 'Dashboard reklamácií + Interaktívny checklist otvorenia ČS',
    url: 'https://drive.google.com/drive/folders/1QL0Y6lRIf7-VN-4LLe9H-dyKZ1-GLR2q?usp=sharing',
    description:
      'Séria praktických videonávodov a tutoriálov, ktoré krok po kroku vysvetľujú prácu s digitálnymi nástrojmi siete Dalioil – najmä obsluhu Dashboardu prijatých reklamácií a projektového checklistu pre otváranie prevádzok.',
    targetRole: 'manager',
    targetRoleLabel: 'Manažéri, Dispečeri, Riešitelia reklamácií',
    targetAudience: 'Manažéri, riešitelia reklamácií a vedúci nových projektov',
    format: 'video',
    formatLabel: 'Séria videonávodov & tutoriálov',
    frequencyOrFormat: 'Digitálny manuál pri začatí práce s nástrojmi',
    estimatedTime: '20 min (4 tutoriály)',
    device: 'Desktop & Mobil',
    outputTarget: 'Google Drive: Video manuály k systémom',
    actionLabel: 'Pozrieť videonávody',
    highlights: [
      'Detailný videotutoriál k Dashboardu reklamácií: evidencia, zmena stavu, SLA a odpovede',
      'Videomanuál k Interaktívnemu checklistu: filtrovanie úloh, odškrtávanie a koordinácia tímu',
      'Tipy pre rýchlu orientáciu v automatických tabuľkách a mobilných formulároch',
      'Predchádzanie najčastejším chybám pri správe incidentov',
    ],
    modules: [
      { name: 'Tutoriál 1: Dashboard reklamácií – základy', desc: 'Prihlásenie, orientácia v stĺpcoch a vyhľadávanie podľa stanice', count: '5 min' },
      { name: 'Tutoriál 2: Vybavovanie sťažností & SLA', desc: 'Priradenie technika, zmena statusu a generovanie odpovede', count: '6 min' },
      { name: 'Tutoriál 3: Checklist otvorenia ČS – riadenie úloh', desc: 'Práca s modulmi expanzie, odškrtávanie splnených krokov', count: '5 min' },
      { name: 'Tutoriál 4: Mobilné checklisty Starbucks & Dalioil', desc: 'Ako správne pripojiť fotku a odoslať audit bez chýb', count: '4 min' },
    ],
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    badgeText: 'Videonávody & Manuály',
    iconType: 'sparkles',
  },
  {
    id: 'elearning-google-drive',
    category: 'elearning',
    categoryLabel: 'E-learning & Školenia',
    group: 'Centrálna knižnica & archív',
    subCategoryId: 'master_archive',
    subCategoryLabel: 'Google Drive cloudový archív',
    title: 'Google Drive priečinok materiálov',
    subtitle: 'Kompletný cloudový archív všetkých školení a tutoriálov',
    url: 'https://drive.google.com/drive/folders/1QL0Y6lRIf7-VN-4LLe9H-dyKZ1-GLR2q?usp=sharing',
    description:
      'Centrálny cloudový archív Dalioil na Google Drive, v ktorom sú uložené všetky originálne školiace prezentácie (.pptx), zdrojové Full HD videonávody, štandardy obsluhy, zmluvné vzory a dokumentácia k systémom.',
    targetRole: 'all',
    targetRoleLabel: 'Všetci zamestnanci, Vedúci prevádzok, Manažéri',
    targetAudience: 'Všetci zamestnanci čerpacích staníc, manažéri a školitelia',
    format: 'drive',
    formatLabel: 'Centrálne cloudové úložisko',
    frequencyOrFormat: 'Trvalo dostupný archív 24/7',
    estimatedTime: 'Kompletný archív',
    device: 'Všetky zariadenia',
    outputTarget: 'Google Drive (Zdieľaný priečinok DALIOIL)',
    actionLabel: 'Otvoriť Google Drive priečinok',
    highlights: [
      'Všetky školiace a inštruktážne materiály na jednom bezpečnom mieste v cloude',
      'Obsahuje zdrojové prezentácie .pptx s vysokokvalitnými vloženými videami',
      'Priečinky prehľadne rozdelené podľa oddelení: Pokladňa, Servis, Štandardy, AI systémy',
      'Prístup z mobilu, tabletu aj počítača pre všetkých oprávnených pracovníkov',
    ],
    modules: [
      { name: '📁 Priečinok: Pokladničný systém', desc: 'Prezentácie, inštalačné manuály kase a postupy stornovania', count: '4 súbory' },
      { name: '📁 Priečinok: Štandardy obsluhy', desc: 'Videozáznamy správania personálu, dresscode a interné pravidlá', count: '3 videá' },
      { name: '📁 Priečinok: AI systémy & Checklisty', desc: 'Videomanuály k dashboardu, checklistom a QR kódom', count: '5 tutoriálov' },
      { name: '📁 Priečinok: Starbucks materiály', desc: 'Receptúry nápojov, sanitačné plány a auditné protokoly', count: '6 dokumentov' },
    ],
    badgeColor: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30',
    badgeText: 'Všetky materiály • Google Drive',
    iconType: 'graduation-cap',
  },
  {
    id: 'dalioil-3d-mapping',
    category: 'elearning',
    categoryLabel: 'E-learning & Systémy',
    group: 'Digitálne systémy & AI návody',
    subCategoryId: '3d_mapping',
    subCategoryLabel: '3D priestorové modely',
    title: '3D Mapovanie prevádzok DALIOIL',
    subtitle: 'Interaktívne 3D priestorové modely a digitálne dvojičky prevádzok',
    url: 'http://10.7.0.230/pumpy/',
    description:
      'Interný portál pre interaktívne 3D mapovanie a priestorové digitálne dvojičky čerpacích staníc DALIOIL. Zobrazuje 3D modely výdajných stojanov, prístreškov, totemu, shopu a celého areálu prevádzky s presnými priestorovými väzbami.',
    targetRole: 'all',
    targetRoleLabel: 'Všetci manažéri, technici, projektanti a vedenie',
    targetAudience: 'Vedenie, manažéri sietí, technici, projektanti expanzie a OOH špecialisti',
    format: 'app',
    formatLabel: '3D priestorový webový portál',
    frequencyOrFormat: 'Interný intranetový server (10.7.0.230/pumpy)',
    estimatedTime: 'Interaktívny 3D model',
    device: 'Desktop & Mobil',
    outputTarget: 'Interný server DALIOIL: http://10.7.0.230/pumpy/',
    actionLabel: 'Otvoriť 3D mapovanie',
    highlights: [
      'Priestorové 3D modely a digitálne dvojičky čerpacích staníc DALIOIL',
      'Detailné zobrazenie rozmiestnenia výdajných stojanov, totemu a budovy',
      'Vhodné pre technický audit, plánovanie reklamných nosičov a údržbu',
      'Prístup z firemnej siete DALIOIL (LAN / Wi-Fi / VPN) na http://10.7.0.230/pumpy/',
    ],
    modules: [
      { name: '1. Priestorový 3D areál ČS', desc: 'Virtuálna obhliadka celej prevádzky z ľubovoľného uhla a výšky', count: '3D pohľad' },
      { name: '2. Výdajné stojany & Technológie', desc: 'Zameranie ostrovčekov, prístrešku a tankovacích pozícií', count: 'Stojany' },
      { name: '3. Reklamné zóny & Totem', desc: 'Priestorová poloha nosičov, viditeľnosť z hlavného ťahu', count: 'OOH zóny' },
      { name: '4. Interiér & Zázemie', desc: 'Prehliadka dispozície shopu a obslužných zón stanice', count: 'Dispozícia' },
    ],
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    badgeText: '3D Modely • Intranet 10.7.0.230',
    iconType: 'box',
  },
];

export interface SubGroupMeta {
  id: string;
  category: 'checklists' | 'reclamations' | 'elearning';
  name: string;
  badge: string;
  description: string;
  iconType: 'coffee' | 'clipboard-check' | 'sparkles' | 'store' | 'qr-code' | 'layout-dashboard' | 'graduation-cap' | 'video' | 'monitor' | 'folder' | 'box';
  accentTheme: 'emerald' | 'red' | 'indigo' | 'amber' | 'violet' | 'rose' | 'blue';
}

export const TOOL_SUBGROUPS: SubGroupMeta[] = [
  // Checklisty
  {
    id: 'starbucks_corners',
    category: 'checklists',
    name: 'Kaviarenské kútiky Starbucks',
    badge: 'Starbucks štandardy',
    description: 'Denná operatíva personálu, hygiena kávovaru a hĺbkový 40-bodový audit kvality pre manažérov.',
    iconType: 'coffee',
    accentTheme: 'emerald',
  },
  {
    id: 'dalioil_operations',
    category: 'checklists',
    name: 'Prevádzkové kontroly DALIOIL',
    badge: 'Inšpekcie & Expanzia',
    description: 'Komplexná inšpekcia 5 zón prevádzky stanice a projektový task-manažér otvorenia nových ČS.',
    iconType: 'store',
    accentTheme: 'red',
  },

  // E-learning
  {
    id: 'staff_onboarding',
    category: 'elearning',
    name: 'Základné zaškolenie personálu (Onboarding)',
    badge: 'Onboarding & Kasa',
    description: 'Interaktívna výučba obsluhy pokladničného systému s videami a kódex zákazníckeho servisu Dalioil.',
    iconType: 'graduation-cap',
    accentTheme: 'indigo',
  },
  {
    id: 'digital_ai_tutorials',
    category: 'elearning',
    name: 'Digitálne systémy & AI návody',
    badge: 'Systémy & Videá',
    description: 'Praktické videotutoriály pre správu reklamácií, SLA a mobilných inšpekčných nástrojov.',
    iconType: 'sparkles',
    accentTheme: 'amber',
  },
  {
    id: 'cloud_drive_archive',
    category: 'elearning',
    name: 'Centrálna knižnica & archív',
    badge: 'Google Drive cloud',
    description: 'Kompletný cloudový Google Drive archív so zdrojovými prezentáciami .pptx a Full HD videami.',
    iconType: 'folder',
    accentTheme: 'violet',
  },

  // Reklamácie
  {
    id: 'customer_qr_reclamations',
    category: 'reclamations',
    name: 'Zákaznícka spätná väzba',
    badge: 'QR kód na stojane',
    description: 'Verejný zákaznícky mobilný formulár dostupný po naskenovaní QR kódu na stojane alebo predajni.',
    iconType: 'qr-code',
    accentTheme: 'rose',
  },
  {
    id: 'internal_reclamations_dispatch',
    category: 'reclamations',
    name: 'Interný reklamačný dispečing',
    badge: 'Live dispečing & SLA',
    description: 'Centrálna riadiaca centrála pre manažérov, priradenie technikov a sledovanie termínov (SLA).',
    iconType: 'layout-dashboard',
    accentTheme: 'blue',
  },
];

export const TOOL_CATEGORIES = [
  {
    id: 'checklists',
    label: 'Checklisty & Kontroly',
    count: 4,
    description: 'Starbucks kontroly, audity kvality, Dalioil inšpekcie a príprava otvárania ČS',
    icon: 'clipboard-check',
    color: 'emerald',
    subgroups: ['Kaviarenské kútiky Starbucks', 'Prevádzkové kontroly DALIOIL'],
  },
  {
    id: 'elearning',
    label: 'E-learning & Školenia',
    count: 5,
    description: '3D mapovanie prevádzok, pokladničný systém, štandardy servisu, AI videonávody a Google Drive',
    icon: 'graduation-cap',
    color: 'violet',
    subgroups: ['Základné zaškolenie personálu (Onboarding)', 'Digitálne systémy & AI návody', 'Centrálna knižnica & archív'],
  },
  {
    id: 'reclamations',
    label: 'Reklamácie & QR',
    count: 2,
    description: 'Zákaznícky reklamačný formulár z QR kódov a centrálny riadiaci dispečing',
    icon: 'qr-code',
    color: 'rose',
    subgroups: ['Zákaznícka spätná väzba', 'Interný reklamačný dispečing'],
  },
] as const;

