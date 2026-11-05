/**
 * Oficiálne Google Mapy a Google Street View integrácie siete DALIOIL
 * Zdroj: integracie_google__street_mapy_f0fe40d6.pdf
 * Každá stanica má svoj unikátny kód (napr. DALIOIL_001 až DALIOIL_049)
 */

export interface GoogleStationLink {
  stationCode: string;
  name: string;
  googleMapsUrl?: string;
  googleStreetViewUrl?: string;
}

export const GOOGLE_MAPS_DATA: Record<string, GoogleStationLink> = {
  DALIOIL_001: {
    stationCode: 'DALIOIL_001',
    name: 'DALI OIL - Bratislava-Vajnory',
    googleMapsUrl: 'https://maps.app.goo.gl/MEWric5ZkGBbkQKP6',
    googleStreetViewUrl: 'https://maps.app.goo.gl/eXyVf2KUPm6V7zGS6',
  },
  DALIOIL_002: {
    stationCode: 'DALIOIL_002',
    name: 'DALI OIL - Most pri Bratislave',
    googleMapsUrl: 'https://maps.app.goo.gl/AXMdqbEaQRQjrxjL8',
    googleStreetViewUrl: 'https://maps.app.goo.gl/uL1ndZZVnUNmxxZE9',
  },
  DALIOIL_003: {
    stationCode: 'DALIOIL_003',
    name: 'DALI OIL - Rohožník',
    googleMapsUrl: 'https://maps.app.goo.gl/BPau6KK82QibM62o8',
    googleStreetViewUrl: 'https://maps.app.goo.gl/57WYyvLXwFbxrDd57',
  },
  DALIOIL_004: {
    stationCode: 'DALIOIL_004',
    name: 'DALI OIL - Šaštín Stráže',
    googleMapsUrl: 'https://maps.app.goo.gl/ayKNSgHAtQNvpWB36',
    googleStreetViewUrl: 'https://maps.app.goo.gl/LkUReoLVUDvffoY68',
  },
  DALIOIL_005: {
    stationCode: 'DALIOIL_005',
    name: 'DALI OIL - Bučany',
    googleMapsUrl: 'https://maps.app.goo.gl/uLHi2wnwAZmRMo179',
    googleStreetViewUrl: 'https://maps.app.goo.gl/EAc81BzVaT8hFKq7A',
  },
  DALIOIL_006: {
    stationCode: 'DALIOIL_006',
    name: 'DALI OIL - Šintava',
    googleMapsUrl: 'https://maps.app.goo.gl/yTxUCsuC21HUWcBC9',
    googleStreetViewUrl: 'https://maps.app.goo.gl/DP6fa9vuGD139ZfL6',
  },
  DALIOIL_007: {
    stationCode: 'DALIOIL_007',
    name: 'DALI OIL - Čiližská Radvaň',
    googleMapsUrl: 'https://maps.app.goo.gl/NfyZPPDPRYSNRH6p8',
    googleStreetViewUrl: 'https://maps.app.goo.gl/NEN9skw6Jo1YGAsZ7',
  },
  DALIOIL_008: {
    stationCode: 'DALIOIL_008',
    name: 'DALI OIL - Zemianska Olča',
    googleMapsUrl: 'https://maps.app.goo.gl/1CK6zPfvxxrSVsMM6',
    googleStreetViewUrl: 'https://maps.app.goo.gl/5ikaozswk1turBcE7',
  },
  DALIOIL_009: {
    stationCode: 'DALIOIL_009',
    name: 'DALI OIL - Tôň',
    googleMapsUrl: 'https://maps.app.goo.gl/y2HShrUqzzGWHfyF8',
    googleStreetViewUrl: 'https://maps.app.goo.gl/xqX27SaoH3s1r4Yc6',
  },
  DALIOIL_010: {
    stationCode: 'DALIOIL_010',
    name: 'Centrála DALITRANS',
    googleMapsUrl: undefined,
    googleStreetViewUrl: undefined,
  },
  DALIOIL_011: {
    stationCode: 'DALIOIL_011',
    name: 'DALI OIL - Nemšová',
    googleMapsUrl: 'https://maps.app.goo.gl/LmG1m1tYJ96DYMVy5',
    googleStreetViewUrl: 'https://maps.app.goo.gl/uWNhhoXBAiZPTWhu6',
  },
  DALIOIL_012: {
    stationCode: 'DALIOIL_012',
    name: 'DALI OIL - Dubnica nad Váhom',
    googleMapsUrl: 'https://maps.app.goo.gl/rGog2mCYHewbNWDq8',
    googleStreetViewUrl: 'https://maps.app.goo.gl/fVrMdxc9vj7reU2M7',
  },
  DALIOIL_013: {
    stationCode: 'DALIOIL_013',
    name: 'DALI OIL - Nová Dubnica',
    googleMapsUrl: 'https://maps.app.goo.gl/D6k6HxZzgw9A2X2h8',
    googleStreetViewUrl: 'https://maps.app.goo.gl/YgC88FdogGjmphs48',
  },
  DALIOIL_014: {
    stationCode: 'DALIOIL_014',
    name: 'DALI OIL - Považská Teplá',
    googleMapsUrl: 'https://maps.app.goo.gl/EwnzDztetsoTb9nTA',
    googleStreetViewUrl: 'https://maps.app.goo.gl/8B37XVZokBB911gk8',
  },
  DALIOIL_015: {
    stationCode: 'DALIOIL_015',
    name: 'DALI OIL - Dolný Hričov',
    googleMapsUrl: 'https://maps.app.goo.gl/uNvmnfdrHdGoejwy5',
    googleStreetViewUrl: 'https://maps.app.goo.gl/RVDuEx4VgVDBoSbj9',
  },
  DALIOIL_016: {
    stationCode: 'DALIOIL_016',
    name: 'DALI OIL - Krásno nad Kysucou',
    googleMapsUrl: 'https://maps.app.goo.gl/6QZKmcYxFz8b4duDA',
    googleStreetViewUrl: 'https://maps.app.goo.gl/X22CVCe6QYrS32BP9',
  },
  DALIOIL_017: {
    stationCode: 'DALIOIL_017',
    name: 'DALI OIL - Martin',
    googleMapsUrl: 'https://maps.app.goo.gl/vYeJVEmckL4DN1nQ7',
    googleStreetViewUrl: 'https://maps.app.goo.gl/CXtVtBXx68vFDH5v9',
  },
  DALIOIL_018: {
    stationCode: 'DALIOIL_018',
    name: 'DALI OIL - Turany',
    googleMapsUrl: 'https://maps.app.goo.gl/8vb6LA5YrFgZVsJo8',
    googleStreetViewUrl: 'https://maps.app.goo.gl/5VPEJaVQvAHgT9br6',
  },
  DALIOIL_019: {
    stationCode: 'DALIOIL_019',
    name: 'DALI OIL - Turčianske Teplice',
    googleMapsUrl: 'https://maps.app.goo.gl/2XHTUUUUgtn2MsCL6',
    googleStreetViewUrl: 'https://maps.app.goo.gl/VDbi9Pr9HwGyR5GK8',
  },
  DALIOIL_020: {
    stationCode: 'DALIOIL_020',
    name: 'DALI OIL - Ludanice',
    googleMapsUrl: 'https://maps.app.goo.gl/oaZ45pDQoNbhyN7p6',
    googleStreetViewUrl: 'https://maps.app.goo.gl/L4F8cEoN6weojXzo6',
  },
  DALIOIL_021: {
    stationCode: 'DALIOIL_021',
    name: 'DALI OIL - Malé Bielice',
    googleMapsUrl: 'https://maps.app.goo.gl/kjZydA3KNmQHRMzy5',
    googleStreetViewUrl: 'https://maps.app.goo.gl/dtxUSHndgU3fRQyQ8',
  },
  DALIOIL_022: {
    stationCode: 'DALIOIL_022',
    name: 'DALI OIL - Nitrianske Rudno',
    googleMapsUrl: 'https://maps.app.goo.gl/JHsRuz2tBLQBfLzDA',
    googleStreetViewUrl: 'https://maps.app.goo.gl/hR6zuWTiKMJj2VBx6',
  },
  DALIOIL_023: {
    stationCode: 'DALIOIL_023',
    name: 'DALI OIL - Beladice',
    googleMapsUrl: 'https://maps.app.goo.gl/Lc83aPsB3WWJqsyM8',
    googleStreetViewUrl: 'https://maps.app.goo.gl/Jv8ADruYx7eyG8Zp8',
  },
  DALIOIL_024: {
    stationCode: 'DALIOIL_024',
    name: 'DALI OIL - Podhájska',
    googleMapsUrl: 'https://maps.app.goo.gl/xRBaMsj2c5EC6tdR9',
    googleStreetViewUrl: 'https://maps.app.goo.gl/SSxLTaY3v1tvxm9q8',
  },
  DALIOIL_025: {
    stationCode: 'DALIOIL_025',
    name: 'DALI OIL - Tupá',
    googleMapsUrl: 'https://maps.app.goo.gl/cZAz4VLaABzzHYq48',
    googleStreetViewUrl: 'https://maps.app.goo.gl/ktyP9qNqwhGTNwBQ7',
  },
  DALIOIL_026: {
    stationCode: 'DALIOIL_026',
    name: 'DALI OIL - Gbelce',
    googleMapsUrl: 'https://maps.app.goo.gl/XCtdaa2svkUirc9C9',
    googleStreetViewUrl: 'https://maps.app.goo.gl/1J3AzpHx4X1VFtAn7',
  },
  DALIOIL_027: {
    stationCode: 'DALIOIL_027',
    name: 'DALI OIL - Hontianske Nemce',
    googleMapsUrl: 'https://maps.app.goo.gl/oTEFAu6VSVVYbNLb8',
    googleStreetViewUrl: 'https://maps.app.goo.gl/jXmnwuP9KLWJQjoS9',
  },
  DALIOIL_028: {
    stationCode: 'DALIOIL_028',
    name: 'DALI OIL - Hliník nad Hronom',
    googleMapsUrl: 'https://maps.app.goo.gl/fctxfJN1mStDyHrG8',
    googleStreetViewUrl: 'https://maps.app.goo.gl/KApRKkWsGUyBdQYo6',
  },
  DALIOIL_029: {
    stationCode: 'DALIOIL_029',
    name: 'DALI OIL - Banská Bystrica',
    googleMapsUrl: 'https://maps.app.goo.gl/Dw2QGTsQDv5Bzobf9',
    googleStreetViewUrl: 'https://maps.app.goo.gl/MdNeWFLg3AaFbBio6',
  },
  DALIOIL_030: {
    stationCode: 'DALIOIL_030',
    name: 'DALI OIL - Veľké Bierovce',
    googleMapsUrl: 'https://maps.app.goo.gl/uA75HTKHpKUS4m5n6',
    googleStreetViewUrl: 'https://maps.app.goo.gl/XDF4t7zdJ6vynkww6',
  },
  DALIOIL_031: {
    stationCode: 'DALIOIL_031',
    name: 'DALI OIL - Trstená',
    googleMapsUrl: 'https://maps.app.goo.gl/7DspxDowTPm8HtsV9',
    googleStreetViewUrl: 'https://maps.app.goo.gl/TyTf6TLWhF3iMAAT7',
  },
  DALIOIL_032: {
    stationCode: 'DALIOIL_032',
    name: 'DALI OIL - Ivachnová',
    googleMapsUrl: 'https://maps.app.goo.gl/XXcc6vNZzKUoZXf2A',
    googleStreetViewUrl: 'https://maps.app.goo.gl/eLk7Z2aXpFBRKsUv5',
  },
  DALIOIL_033: {
    stationCode: 'DALIOIL_033',
    name: 'DALI OIL - Liptovský Mikuláš',
    googleMapsUrl: 'https://maps.app.goo.gl/1jaSgy16VPwZpA7LA',
    googleStreetViewUrl: 'https://maps.app.goo.gl/pwVTxZhLUvRKoL967',
  },
  DALIOIL_034: {
    stationCode: 'DALIOIL_034',
    name: 'DALI OIL - Poprad',
    googleMapsUrl: 'https://maps.app.goo.gl/ewjRWGBTb7zUMwo57',
    googleStreetViewUrl: 'https://maps.app.goo.gl/NqnfbZEDEcaTLrp78',
  },
  DALIOIL_035: {
    stationCode: 'DALIOIL_035',
    name: 'DALI OIL - Kežmarok',
    googleMapsUrl: 'https://maps.app.goo.gl/s39LDyAogQWZein17',
    googleStreetViewUrl: 'https://maps.app.goo.gl/PGY2s3AV41Z2SBZ58',
  },
  DALIOIL_036: {
    stationCode: 'DALIOIL_036',
    name: 'DALI OIL - Veľká Lomnica',
    googleMapsUrl: 'https://maps.app.goo.gl/EP45sYpS3owJRVmM9',
    googleStreetViewUrl: 'https://maps.app.goo.gl/9NRKTEK78rywxtMd8',
  },
  DALIOIL_037: {
    stationCode: 'DALIOIL_037',
    name: 'DALI OIL - Dobšiná',
    googleMapsUrl: 'https://maps.app.goo.gl/kbcbhynKv7DdAGTy7',
    googleStreetViewUrl: 'https://maps.app.goo.gl/QnC3UVb6uWo5n2kf8',
  },
  DALIOIL_038: {
    stationCode: 'DALIOIL_038',
    name: 'DALI OIL - Košice - Dargovských Hrdinov',
    googleMapsUrl: 'https://maps.app.goo.gl/mCNq58BnPpZ4HfyYA',
    googleStreetViewUrl: 'https://maps.app.goo.gl/81gKa7xpghT6GrPK9',
  },
  DALIOIL_039: {
    stationCode: 'DALIOIL_039',
    name: 'DALI OIL - Michalovce',
    googleMapsUrl: 'https://maps.app.goo.gl/AxuFReeKSaK8Bc1K9',
    googleStreetViewUrl: 'https://maps.app.goo.gl/MfNPpjW57gcHA3pD8',
  },
  DALIOIL_040: {
    stationCode: 'DALIOIL_040',
    name: 'DALI OIL - Strážske',
    googleMapsUrl: 'https://maps.app.goo.gl/87z1sDbRh5wzPJGN6',
    googleStreetViewUrl: 'https://maps.app.goo.gl/oycPq6YzPF8ueB588',
  },
  DALIOIL_041: {
    stationCode: 'DALIOIL_041',
    name: 'DALI OIL - Tisovec',
    googleMapsUrl: 'https://maps.app.goo.gl/iRkRVarvpYXahAZo8',
    googleStreetViewUrl: 'https://maps.app.goo.gl/xWmVvtZyXucM4TcCA',
  },
  DALIOIL_042: {
    stationCode: 'DALIOIL_042',
    name: 'DALI OIL - Kokava nad Rimavicou',
    googleMapsUrl: 'https://maps.app.goo.gl/QoVPchYd6PPqBfBJ7',
    googleStreetViewUrl: 'https://maps.app.goo.gl/4LVMjfuMKhc1dim67',
  },
  DALIOIL_043: {
    stationCode: 'DALIOIL_043',
    name: 'DALI OIL - Bátka',
    googleMapsUrl: 'https://maps.app.goo.gl/5v1nft7hPgV3EXwLA',
    googleStreetViewUrl: 'https://maps.app.goo.gl/9cXbL1CULe5fiMb89',
  },
  DALIOIL_044: {
    stationCode: 'DALIOIL_044',
    name: 'DALI OIL - Lučenec',
    googleMapsUrl: 'https://maps.app.goo.gl/UxjthXBqRvJkvXoa6',
    googleStreetViewUrl: 'https://maps.app.goo.gl/q2J1PQGVA8DEJS2f6',
  },
  DALIOIL_045: {
    stationCode: 'DALIOIL_045',
    name: 'DALI OIL - Fiľakovo – Biskupická',
    googleMapsUrl: 'https://maps.app.goo.gl/Bd2nr1Ss1dxw7pt19',
    googleStreetViewUrl: 'https://maps.app.goo.gl/TyroGbRkSCmPGu9f9',
  },
  DALIOIL_046: {
    stationCode: 'DALIOIL_046',
    name: 'DALI OIL - Fiľakovo – Šavoľská',
    googleMapsUrl: 'https://maps.app.goo.gl/n84hjAVecPSFP9oR7',
    googleStreetViewUrl: 'https://maps.app.goo.gl/mxmqftcNVmYvCRKJ8',
  },
  DALIOIL_047: {
    stationCode: 'DALIOIL_047',
    name: 'DALI OIL - Kraľovany',
    googleMapsUrl: undefined,
    googleStreetViewUrl: undefined,
  },
  DALIOIL_048: {
    stationCode: 'DALIOIL_048',
    name: 'DALI OIL - Podolínec',
    googleMapsUrl: 'https://maps.app.goo.gl/hcvBXWCAax8MCqvNA',
    googleStreetViewUrl: 'https://maps.app.goo.gl/H2sQNx9jZVahL4bs9',
  },
  DALIOIL_049: {
    stationCode: 'DALIOIL_049',
    name: 'DALI OIL - Teplička nad Váhom',
    googleMapsUrl: 'https://maps.app.goo.gl/Fx9WxPUR6HW1T6Q88',
    googleStreetViewUrl: 'https://maps.app.goo.gl/2A5TNkefW3iYi7sw8',
  },
  DALIOIL_050: {
    stationCode: 'DALIOIL_050',
    name: 'DALI OIL - Hriňová',
    googleMapsUrl: 'https://maps.app.goo.gl/9jJJkRv5CD36hQgr5',
    googleStreetViewUrl: 'https://maps.app.goo.gl/1VDbxhJhK4thxERK6',
  },
};

/**
 * Získa Google Mapy a Google Street View odkaz podľa kódu stanice alebo ID
 */
export function getStationGoogleLinks(stationCodeOrId: string | number, lat?: number, lng?: number): {
  googleMapsUrl?: string;
  googleStreetViewUrl?: string;
  isVerifiedLink: boolean;
} {
  const code = typeof stationCodeOrId === 'number'
    ? `DALIOIL_${String(stationCodeOrId).padStart(3, '0')}`
    : stationCodeOrId;

  const found = GOOGLE_MAPS_DATA[code];
  if (found && (found.googleMapsUrl || found.googleStreetViewUrl)) {
    return {
      googleMapsUrl: found.googleMapsUrl,
      googleStreetViewUrl: found.googleStreetViewUrl,
      isVerifiedLink: true,
    };
  }

  // Fallback podľa GPS súradníc (napríklad pre terminály alebo Centrálu)
  if (typeof lat === 'number' && typeof lng === 'number') {
    return {
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      googleStreetViewUrl: `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`,
      isVerifiedLink: false,
    };
  }

  return {
    googleMapsUrl: undefined,
    googleStreetViewUrl: undefined,
    isVerifiedLink: false,
  };
}

/**
 * Štatistika integrácie Google Máp v sieti DALIOIL
 */
export function getGoogleMapsStats() {
  const totalEntries = Object.keys(GOOGLE_MAPS_DATA).length;
  let withMaps = 0;
  let withStreetView = 0;

  for (const item of Object.values(GOOGLE_MAPS_DATA)) {
    if (item.googleMapsUrl) withMaps++;
    if (item.googleStreetViewUrl) withStreetView++;
  }

  return {
    totalEntries,
    withMaps,
    withStreetView,
  };
}
