// Databáza fotiek a Google Drive priečinkov zón čerpacích staníc DALIOIL
// Zdroj: zber_fotiek_ulozisko_-_naparovat.pdf (48 staníc, 12 zón)

export interface StationZoneFolder {
  stationCode: string;
  city: string;
  zoneNumber: number;
  zoneCode: string;
  zoneName: string;
  folderUrl: string;
}

export const ZONE_ICONS_MAP: Record<number, string> = {
  1: "Navigation", // Príjazdová zóna
  2: "Fuel", // Výdajné stojany
  3: "LogIn", // Vstup do shopu
  4: "Receipt", // Pokladničná zóna
  5: "Users", // Toaletná zóna
  6: "Coffee", // Kaviarenský kútik
  7: "Building", // Budova
  8: "SquareParking", // Parkovisko
  9: "ArrowRight", // Odjazdová zóna
  10: "Droplets", // Autoumyváreň
  11: "Umbrella", // Vonkajšia terasa
  12: "Folder", // Ostatné
};

export const STATION_ZONE_FOLDERS: StationZoneFolder[] = [
  {
    "stationCode": "DALIOIL_001",
    "city": "Bratislava",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1O1wOQKJl8NOTNFoTN3lGfbxBT80HFA4w"
  },
  {
    "stationCode": "DALIOIL_001",
    "city": "Bratislava",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1UreU1bo5H5Olfe9EE9jkZXPr4Ky1UYiT"
  },
  {
    "stationCode": "DALIOIL_001",
    "city": "Bratislava",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/163-teRbdKe-gQ9kxxVwI134jytx2St44"
  },
  {
    "stationCode": "DALIOIL_001",
    "city": "Bratislava",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1LUj7KaeqpZOxNOL_KiW0l4zA9GoPQ-FI"
  },
  {
    "stationCode": "DALIOIL_001",
    "city": "Bratislava",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1ApvMTX-otZMRfElvs_Pl5rkzfdusXTwk"
  },
  {
    "stationCode": "DALIOIL_001",
    "city": "Bratislava",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1tWsluYTRE2IoZZBeJl1aeiPwLdhknguX"
  },
  {
    "stationCode": "DALIOIL_001",
    "city": "Bratislava",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1gLQfqtkm6nH7uJgYHO4pfvNkje2euo31"
  },
  {
    "stationCode": "DALIOIL_001",
    "city": "Bratislava",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1YwWWs4pjC62QkjFX-J97bnkH1XNwUTYY"
  },
  {
    "stationCode": "DALIOIL_001",
    "city": "Bratislava",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1FGfVnr9EoVJ0637XLvc9r437LhHALQVc"
  },
  {
    "stationCode": "DALIOIL_001",
    "city": "Bratislava",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1vtAjmPybU15YtPZaLXkoaiGA0bn7BEWE"
  },
  {
    "stationCode": "DALIOIL_001",
    "city": "Bratislava",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1MwmyFdRJT9LxHEIcl6aPAdmeaFNA8-Gm"
  },
  {
    "stationCode": "DALIOIL_001",
    "city": "Bratislava",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1nrNEfvFohG9OoNt8DRvJ955P5nv4RjVg"
  },
  {
    "stationCode": "DALIOIL_002",
    "city": "Most pri Bratislave",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1JlsJp8AILE8Zm1a3gFrD296o7HNL2ZpQ"
  },
  {
    "stationCode": "DALIOIL_002",
    "city": "Most pri Bratislave",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1YqppVwLObOmQlNTSk8DcEA0mVK2MNK9f"
  },
  {
    "stationCode": "DALIOIL_002",
    "city": "Most pri Bratislave",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/11BpcKDJ2CwLUVOqQSDfWDFcvCout-Ryx"
  },
  {
    "stationCode": "DALIOIL_002",
    "city": "Most pri Bratislave",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1VTTBF9IrUEd6TLEvcxjiAoS9lA87GlwT"
  },
  {
    "stationCode": "DALIOIL_002",
    "city": "Most pri Bratislave",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1BA54z39mhu0pW9JSvSXzWvI43B_vpbbs"
  },
  {
    "stationCode": "DALIOIL_002",
    "city": "Most pri Bratislave",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1otV62p1KaFOBzUqFgpk3Y0e1PgrThN2d"
  },
  {
    "stationCode": "DALIOIL_002",
    "city": "Most pri Bratislave",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1NNs9raf46dpokofMVf0RUAX_I4cYtQTW"
  },
  {
    "stationCode": "DALIOIL_002",
    "city": "Most pri Bratislave",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1fIyUbONWDvrjN18gk4fEYPVTtforn7F0"
  },
  {
    "stationCode": "DALIOIL_002",
    "city": "Most pri Bratislave",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1XWtSkUTmhGbub4GERGHz-UyyewnqdWY9"
  },
  {
    "stationCode": "DALIOIL_002",
    "city": "Most pri Bratislave",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1ny7_ORy_v7NBdxZ-4w8w74Ek76Ys7F8M"
  },
  {
    "stationCode": "DALIOIL_002",
    "city": "Most pri Bratislave",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1uXboVxRm4nKVgCIaFq86XgM-BUS9tdL4"
  },
  {
    "stationCode": "DALIOIL_002",
    "city": "Most pri Bratislave",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1i_hYbkv6kOBtDNtDF0mygUE7jZowr-OY"
  },
  {
    "stationCode": "DALIOIL_003",
    "city": "Rohožník",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1Su0_PphJxzgg6bYwCubQI178_KVe-qr2"
  },
  {
    "stationCode": "DALIOIL_003",
    "city": "Rohožník",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/18f8oVqdIW-jSZvr1hBpYZ0s0MmBsN6zV"
  },
  {
    "stationCode": "DALIOIL_003",
    "city": "Rohožník",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1gLTWMRaE1hcmb0g6uV8NBhB279in6EF-"
  },
  {
    "stationCode": "DALIOIL_003",
    "city": "Rohožník",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1jeNUQN5lZhI3bsN6MKzJAsH6gK6kX9gm"
  },
  {
    "stationCode": "DALIOIL_003",
    "city": "Rohožník",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/16XYn6viouWSpgxGn1JwHIhZw7oYPWSKe"
  },
  {
    "stationCode": "DALIOIL_003",
    "city": "Rohožník",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1gWONUbt1D5KCXdGChp_KiS7qSsaes5qm"
  },
  {
    "stationCode": "DALIOIL_003",
    "city": "Rohožník",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/15mMvK33uoqWXWWRH1d8YAsVZE3IP1gFc"
  },
  {
    "stationCode": "DALIOIL_003",
    "city": "Rohožník",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1SK2s9LCw1u5Yk8eDWpUp-J-x8DWLN3Nx"
  },
  {
    "stationCode": "DALIOIL_003",
    "city": "Rohožník",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/12dMiFa6rQlBhFrovswbIaUZ2QvBKW486"
  },
  {
    "stationCode": "DALIOIL_003",
    "city": "Rohožník",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1DLjDE6QlL6VhQ2gsd8Z9tB0cbx0JKk66"
  },
  {
    "stationCode": "DALIOIL_003",
    "city": "Rohožník",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1b9Wf2APmxsQ56OlHHWxVvbvxR8ni78va"
  },
  {
    "stationCode": "DALIOIL_003",
    "city": "Rohožník",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1ynKA5MmmAH9-cTJZUhPTKNwXyprNDXEP"
  },
  {
    "stationCode": "DALIOIL_004",
    "city": "Šaštín Stráže",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1k6wMUOUEvqNhOto-tPLKL9T4jCfv_Dur"
  },
  {
    "stationCode": "DALIOIL_004",
    "city": "Šaštín Stráže",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1RPKn_oy0F5L-tZX7xNRF37y0Z0dpeB8H"
  },
  {
    "stationCode": "DALIOIL_004",
    "city": "Šaštín Stráže",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1OrwRgfJYr0Ki64bNnglPF-iIdT9SnD9w"
  },
  {
    "stationCode": "DALIOIL_004",
    "city": "Šaštín Stráže",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/12fSloXKEO6sLKOvSag6UgH_yDVxQneUG"
  },
  {
    "stationCode": "DALIOIL_004",
    "city": "Šaštín Stráže",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1GQ5nGFNG0pup45y4gYhXfxCSwOud7U4a"
  },
  {
    "stationCode": "DALIOIL_004",
    "city": "Šaštín Stráže",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1rP9gW3kmKx0SG_GL8_gTzOpK8nPpsuY8"
  },
  {
    "stationCode": "DALIOIL_004",
    "city": "Šaštín Stráže",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1rrO6_ALEilpU9D_k5ggUMKewVk5IYdeS"
  },
  {
    "stationCode": "DALIOIL_004",
    "city": "Šaštín Stráže",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1sh2AA1mIEwqdmVrPOaYPW3Ri_ZaU1dkH"
  },
  {
    "stationCode": "DALIOIL_004",
    "city": "Šaštín Stráže",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1DREJS5BiAvn8N30qsDEMVG_SxOQmtNn3"
  },
  {
    "stationCode": "DALIOIL_004",
    "city": "Šaštín Stráže",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/17RR9B4DskaHeuuxe6waW3p42P71oZgia"
  },
  {
    "stationCode": "DALIOIL_004",
    "city": "Šaštín Stráže",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1klS8AvjOJwp2DFjn_A4mIsL-V_SEGyOF"
  },
  {
    "stationCode": "DALIOIL_004",
    "city": "Šaštín Stráže",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1N-zD1ydKV5tgUo9_3_5V5uS9lT0vQogf"
  },
  {
    "stationCode": "DALIOIL_004",
    "city": "Šaštín Stráže",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1k8GMzLxyqRNUaD6G1684Aqf3OjSq2iu_"
  },
  {
    "stationCode": "DALIOIL_005",
    "city": "Bučany",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1hJQ0JgUdWw5chPr4Ophvfecpt_eZUKa7"
  },
  {
    "stationCode": "DALIOIL_005",
    "city": "Bučany",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1ecAGZ187QsCNEiaCfrbuxnAbfzSl3jss"
  },
  {
    "stationCode": "DALIOIL_005",
    "city": "Bučany",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1ze7bbvnMueQ15A8yi8Y4xoghrQicyn3_"
  },
  {
    "stationCode": "DALIOIL_005",
    "city": "Bučany",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1Znbxz7ycGb9OPEqr5ne_DnzjKQYa-nQV"
  },
  {
    "stationCode": "DALIOIL_005",
    "city": "Bučany",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1MH-eE-ZcnlH1WKXfYPwcyYmemZe7uMFo"
  },
  {
    "stationCode": "DALIOIL_005",
    "city": "Bučany",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1feqMD0_jk8nbMKg6A4NMZbMpUSnAL54h"
  },
  {
    "stationCode": "DALIOIL_005",
    "city": "Bučany",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1GP62tP5RetjCmqjRGEbqGVH3I0PP0aSs"
  },
  {
    "stationCode": "DALIOIL_005",
    "city": "Bučany",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1OX97ZcDr92ERW2bZIaPEclJXzZSLg_9q"
  },
  {
    "stationCode": "DALIOIL_005",
    "city": "Bučany",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1CniWwqYQexgYrlI3Z2e9OB3WeZcUBvqf"
  },
  {
    "stationCode": "DALIOIL_005",
    "city": "Bučany",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1CniWwqYQexgYrlI3Z2e9OB3WeZcUBvqf"
  },
  {
    "stationCode": "DALIOIL_005",
    "city": "Bučany",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/10xBpa5uRT76aQpOmXDFp4HlQUpR2isYw"
  },
  {
    "stationCode": "DALIOIL_005",
    "city": "Bučany",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/10YITmj3RvHvry2o-5iH8El_-ysh8ao7i"
  },
  {
    "stationCode": "DALIOIL_005",
    "city": "Bučany",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1XKjxAzHVMLyQeN1Xm9pdiB4oc-u6uAJY"
  },
  {
    "stationCode": "DALIOIL_006",
    "city": "Šintava",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1dLUP1qTlX-p0lBpai3RNM3TfF5_8CMzc"
  },
  {
    "stationCode": "DALIOIL_006",
    "city": "Šintava",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1_AOMxGpplDU-q6kkVQcQEzXoWr9pTMk7"
  },
  {
    "stationCode": "DALIOIL_006",
    "city": "Šintava",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/10Df_pxoy9Nst2P7zWodTBSZEhWYYO7xr"
  },
  {
    "stationCode": "DALIOIL_006",
    "city": "Šintava",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1qz23gvqa4Nv3Ng5_gLdBiP91caN5IQQr"
  },
  {
    "stationCode": "DALIOIL_006",
    "city": "Šintava",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1tEfMopJZZEk9UmeOwy6sV2NyG3EoI2tr"
  },
  {
    "stationCode": "DALIOIL_006",
    "city": "Šintava",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/16lA3Gt3C0stMUll9_0QS0Ykpyu7HC9lq"
  },
  {
    "stationCode": "DALIOIL_006",
    "city": "Šintava",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1oUlWxgGgki9R98EFvzdjdbMnOqi_a8iy"
  },
  {
    "stationCode": "DALIOIL_006",
    "city": "Šintava",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1DcqZk_4NA5yAKsJ7AtgEWXoGldl8kTPg"
  },
  {
    "stationCode": "DALIOIL_006",
    "city": "Šintava",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/13MzhHBDQZpGZEh200ws08T8BqG1xR9pC"
  },
  {
    "stationCode": "DALIOIL_006",
    "city": "Šintava",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/10Xll9tzyUSB2hDMOqozegz42cWPNyR_g"
  },
  {
    "stationCode": "DALIOIL_006",
    "city": "Šintava",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1f6ckrtor2tuQMVStYC2dm4VwJT1421Fb"
  },
  {
    "stationCode": "DALIOIL_006",
    "city": "Šintava",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1OCI3OH4dVWYAf3qCRuTH9E_kKjLYuntA"
  },
  {
    "stationCode": "DALIOIL_007",
    "city": "Čiližská Radvaň",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1UY5v-GyLED20H9JdHIiCh9t9aNj2Hv1v"
  },
  {
    "stationCode": "DALIOIL_007",
    "city": "Čiližská Radvaň",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1NJcTrPYtZPuSbxX1c99oQXwkvtrgIxhg"
  },
  {
    "stationCode": "DALIOIL_007",
    "city": "Čiližská Radvaň",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1GxI5IJfszUogB5chyVbpUePnp3-DvLJE"
  },
  {
    "stationCode": "DALIOIL_007",
    "city": "Čiližská Radvaň",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1Hb6N54w0aff88HhSLce3el2CxWF_Hu-n"
  },
  {
    "stationCode": "DALIOIL_007",
    "city": "Čiližská Radvaň",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/12U0xjHC5EI90wpV8s8ypPHkwEV3fCDn-"
  },
  {
    "stationCode": "DALIOIL_007",
    "city": "Čiližská Radvaň",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1nOLYg1N8zOlBf7Y1xT2jO9bPnVHloLy9"
  },
  {
    "stationCode": "DALIOIL_007",
    "city": "Čiližská Radvaň",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1lYR1wCyjik2gBR4ZjxAweA1WhLf9dei0"
  },
  {
    "stationCode": "DALIOIL_007",
    "city": "Čiližská Radvaň",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1gfDlT3Nk2WswRyr_QGgSvtjuzlzH2hQr"
  },
  {
    "stationCode": "DALIOIL_007",
    "city": "Čiližská Radvaň",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/121ZrsslLVOJz5rXnQ9bfgx-5IQsCeMif"
  },
  {
    "stationCode": "DALIOIL_007",
    "city": "Čiližská Radvaň",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1_XgkM6NJ44K1G9gPRmj1hALWuhW882-d"
  },
  {
    "stationCode": "DALIOIL_007",
    "city": "Čiližská Radvaň",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1sSPqLb6B6XjRRXdyLiPvie9H8ByZFJAG"
  },
  {
    "stationCode": "DALIOIL_007",
    "city": "Čiližská Radvaň",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1-2HJRNq2wkffdlkXSCf6yNL8ccZuiCjP"
  },
  {
    "stationCode": "DALIOIL_008",
    "city": "Zemianska Olča",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1UXItBc0R7PL5VVkqo7XdmMYaDb3yBlca"
  },
  {
    "stationCode": "DALIOIL_008",
    "city": "Zemianska Olča",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/192wcfkwg-Fg8wPa79JK3GQnPv9qoOz2S"
  },
  {
    "stationCode": "DALIOIL_008",
    "city": "Zemianska Olča",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1505CRNvMfA-Lfq3zWd0SC2xBdtmCaJg8"
  },
  {
    "stationCode": "DALIOIL_008",
    "city": "Zemianska Olča",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1pS0wktHXTcbNzCLp467xQHoq-JN5ptna"
  },
  {
    "stationCode": "DALIOIL_008",
    "city": "Zemianska Olča",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1c1ieGlmfrh76FeBUynwZSHcPqACNyK75"
  },
  {
    "stationCode": "DALIOIL_008",
    "city": "Zemianska Olča",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1jvQ7zz1Fsn1rGDg61qSHpmQeC0QXwPXZ"
  },
  {
    "stationCode": "DALIOIL_008",
    "city": "Zemianska Olča",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1xl20AL_JLc0zIVFOcaZi0jmyS7cXac6L"
  },
  {
    "stationCode": "DALIOIL_008",
    "city": "Zemianska Olča",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/17cpWWt8lRSjWWHuMQAelgDTHE9OYqfv7"
  },
  {
    "stationCode": "DALIOIL_008",
    "city": "Zemianska Olča",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1GYN0EB25mT2lzjv5ruZarUZBSVVKgJ6v"
  },
  {
    "stationCode": "DALIOIL_008",
    "city": "Zemianska Olča",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1Wn_3vy88lNfCHbpqlR8PUw7adMelkp56"
  },
  {
    "stationCode": "DALIOIL_008",
    "city": "Zemianska Olča",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1OPVvwq2OS4GyQ9VSc4VImiy-UvfAINEf"
  },
  {
    "stationCode": "DALIOIL_008",
    "city": "Zemianska Olča",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1r7Zvjcaf79xgVBI7f0Vy8UyT7WDDEZSJ"
  },
  {
    "stationCode": "DALIOIL_009",
    "city": "Tôň",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1DS8w-4Hmd5UDgB8jsN0NKSJ5fhcuz904"
  },
  {
    "stationCode": "DALIOIL_009",
    "city": "Tôň",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1Nqn1pZRVudCPhzZ7UyTpbgu_NIvX8VTq"
  },
  {
    "stationCode": "DALIOIL_009",
    "city": "Tôň",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1ko49bMWb57faffDNnExUTzweIXTOWBNY"
  },
  {
    "stationCode": "DALIOIL_009",
    "city": "Tôň",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1-IaVHho-rNvmFrvjQDl7KMpv_H6AGFuZ"
  },
  {
    "stationCode": "DALIOIL_009",
    "city": "Tôň",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1UhKS0CLcjiiYCOk4tkbB2p2khPuZbunN"
  },
  {
    "stationCode": "DALIOIL_009",
    "city": "Tôň",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1f-R45t9sjRCbYRucFyOsMzLBnPceL1-Z"
  },
  {
    "stationCode": "DALIOIL_009",
    "city": "Tôň",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/181bnyXfr2ZBdEFTy0MHifkSFnZIJKxxE"
  },
  {
    "stationCode": "DALIOIL_009",
    "city": "Tôň",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1fH2wyg4QVekmCcgLuS4aQ2Y8_q4EwbvN"
  },
  {
    "stationCode": "DALIOIL_009",
    "city": "Tôň",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/12cOspM5O8XACZ2ZSIOgXBQ6rp-tI9Q2C"
  },
  {
    "stationCode": "DALIOIL_009",
    "city": "Tôň",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1kbCzjS1SV0FkIyO229AWmbG-DnblZrFp"
  },
  {
    "stationCode": "DALIOIL_009",
    "city": "Tôň",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1QaB1Dd6GoQEor7MdQPItDtctTAMvTuPx"
  },
  {
    "stationCode": "DALIOIL_009",
    "city": "Tôň",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1yzEplJ66jLFBTbAGhKY5Ov9lLlK_203a"
  },
  {
    "stationCode": "DALIOIL_010",
    "city": "DALITRANS- Veľké Bierovce",
    "zoneNumber": 0,
    "zoneCode": "",
    "zoneName": "",
    "folderUrl": ""
  },
  {
    "stationCode": "DALIOIL_010",
    "city": "DALITRANS- Veľké Bierovce",
    "zoneNumber": 0,
    "zoneCode": "",
    "zoneName": "",
    "folderUrl": ""
  },
  {
    "stationCode": "DALIOIL_010",
    "city": "DALITRANS- Veľké Bierovce",
    "zoneNumber": 0,
    "zoneCode": "",
    "zoneName": "",
    "folderUrl": ""
  },
  {
    "stationCode": "DALIOIL_010",
    "city": "DALITRANS- Veľké Bierovce",
    "zoneNumber": 0,
    "zoneCode": "",
    "zoneName": "",
    "folderUrl": ""
  },
  {
    "stationCode": "DALIOIL_010",
    "city": "DALITRANS- Veľké Bierovce",
    "zoneNumber": 0,
    "zoneCode": "",
    "zoneName": "",
    "folderUrl": ""
  },
  {
    "stationCode": "DALIOIL_010",
    "city": "DALITRANS- Veľké Bierovce",
    "zoneNumber": 0,
    "zoneCode": "",
    "zoneName": "",
    "folderUrl": ""
  },
  {
    "stationCode": "DALIOIL_010",
    "city": "DALITRANS- Veľké Bierovce",
    "zoneNumber": 0,
    "zoneCode": "",
    "zoneName": "",
    "folderUrl": ""
  },
  {
    "stationCode": "DALIOIL_010",
    "city": "DALITRANS- Veľké Bierovce",
    "zoneNumber": 0,
    "zoneCode": "",
    "zoneName": "",
    "folderUrl": ""
  },
  {
    "stationCode": "DALIOIL_010",
    "city": "DALITRANS- Veľké Bierovce",
    "zoneNumber": 0,
    "zoneCode": "",
    "zoneName": "",
    "folderUrl": ""
  },
  {
    "stationCode": "DALIOIL_010",
    "city": "DALITRANS- Veľké Bierovce",
    "zoneNumber": 0,
    "zoneCode": "",
    "zoneName": "",
    "folderUrl": ""
  },
  {
    "stationCode": "DALIOIL_010",
    "city": "DALITRANS- Veľké Bierovce",
    "zoneNumber": 0,
    "zoneCode": "",
    "zoneName": "",
    "folderUrl": ""
  },
  {
    "stationCode": "DALIOIL_010",
    "city": "DALITRANS- Veľké Bierovce",
    "zoneNumber": 0,
    "zoneCode": "",
    "zoneName": "",
    "folderUrl": ""
  },
  {
    "stationCode": "DALIOIL_011",
    "city": "Nemšová",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1Z_1NC5fvPHLWQ15BHbqdI21i2hBaS8dA"
  },
  {
    "stationCode": "DALIOIL_011",
    "city": "Nemšová",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1DoPyxOttYftZrxvv5fZx96a4NObsbOnm"
  },
  {
    "stationCode": "DALIOIL_011",
    "city": "Nemšová",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1JjslthUPcv0ZB7Ll_tkqsNbA9U7pdPFR"
  },
  {
    "stationCode": "DALIOIL_011",
    "city": "Nemšová",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1gBZLRUrMvNjZWbblSQv_sDjMPYH1cvkY"
  },
  {
    "stationCode": "DALIOIL_011",
    "city": "Nemšová",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/18riu6phsO_dTB1cjCJ65EU14gEAbVUoa"
  },
  {
    "stationCode": "DALIOIL_011",
    "city": "Nemšová",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1QkZNx_g1tNMKntdDY0442mTYtWF2RznV"
  },
  {
    "stationCode": "DALIOIL_011",
    "city": "Nemšová",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1cJRMTJja_hYF3PDMMDwaKc5GUXxB10A-"
  },
  {
    "stationCode": "DALIOIL_011",
    "city": "Nemšová",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1zxgH3t4XQiFNvM2a0eKylSpeCdgzheDO"
  },
  {
    "stationCode": "DALIOIL_011",
    "city": "Nemšová",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1l62vUuMDwHodxexyhaAIRLs_VzqI_D65"
  },
  {
    "stationCode": "DALIOIL_011",
    "city": "Nemšová",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/16e3ODxelGutZh1iX88rVx18rWCrZqHKw"
  },
  {
    "stationCode": "DALIOIL_011",
    "city": "Nemšová",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/16aLxgj5iUb_jGewWx_vUZR72kxls51j6"
  },
  {
    "stationCode": "DALIOIL_011",
    "city": "Nemšová",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/17FWDyF2WyfG4Cn5fi6mMpXNM3L2RYHS_"
  },
  {
    "stationCode": "DALIOIL_012",
    "city": "Dubnica nad Váhom",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1hTtz4HTx3nzk6u-l5nGzKiZD9xiF5kqJ"
  },
  {
    "stationCode": "DALIOIL_012",
    "city": "Dubnica nad Váhom",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1bGZLBhR2LE-zBmGk4Pi3etTnjoyHk4_i"
  },
  {
    "stationCode": "DALIOIL_012",
    "city": "Dubnica nad Váhom",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1gdVsZvacx-6gYw89Jm_FRBnAhUle2iqA"
  },
  {
    "stationCode": "DALIOIL_012",
    "city": "Dubnica nad Váhom",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1CDRr22OfOCb6YpE_EuioyU0LJfOgWdEL"
  },
  {
    "stationCode": "DALIOIL_012",
    "city": "Dubnica nad Váhom",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1LXRbPtIkukKL3x-NvxZyGr2BNTed7PtK"
  },
  {
    "stationCode": "DALIOIL_012",
    "city": "Dubnica nad Váhom",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1qPbS_ZJg4iH9Fy9eXHfpsgq6BVGEbf_h"
  },
  {
    "stationCode": "DALIOIL_012",
    "city": "Dubnica nad Váhom",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1WuGCjcDK7XFeEaPzuLdC8eLWiqgTnMT9"
  },
  {
    "stationCode": "DALIOIL_012",
    "city": "Dubnica nad Váhom",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1CO_fmcndLGRNE0HMaXSVLsMUh-7viADv"
  },
  {
    "stationCode": "DALIOIL_012",
    "city": "Dubnica nad Váhom",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1IuTRhA3caASYRMSLoVySFQJMGwxtlxw8"
  },
  {
    "stationCode": "DALIOIL_012",
    "city": "Dubnica nad Váhom",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/11w2uhc7wDgG7AImruuq9qQcMBxyG8b35"
  },
  {
    "stationCode": "DALIOIL_012",
    "city": "Dubnica nad Váhom",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1K11IevweMqMgsOTA093FTeWCQ9vb2JbS"
  },
  {
    "stationCode": "DALIOIL_012",
    "city": "Dubnica nad Váhom",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1fY2Dc3jNmDq293YK93fVdXW3fysxAkWv"
  },
  {
    "stationCode": "DALIOIL_012",
    "city": "Dubnica nad Váhom",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1mTGX44mlPWzwNfkigMnJrHKc0TYuUtNr"
  },
  {
    "stationCode": "DALIOIL_013",
    "city": "Nová Dubnica",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1PyxYhXq3gsSIzQhvKpzaoMbTirRCOGDo"
  },
  {
    "stationCode": "DALIOIL_013",
    "city": "Nová Dubnica",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1E2HXwsaWkz1bzqqv1d1PROiU5tR57LUB"
  },
  {
    "stationCode": "DALIOIL_013",
    "city": "Nová Dubnica",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1oi7oOKBkr7AbIjfo7Cdd9NWZ-yH3Tt1b"
  },
  {
    "stationCode": "DALIOIL_013",
    "city": "Nová Dubnica",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1oa61IXsX0Pun9T8CNx5hbDmA4_ekVPE3"
  },
  {
    "stationCode": "DALIOIL_013",
    "city": "Nová Dubnica",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1OQssM35_Ltl2K47nDX3hQkBY7NicmQWb"
  },
  {
    "stationCode": "DALIOIL_013",
    "city": "Nová Dubnica",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1EvZG5XhW-twaxi1_ASUok6Z5KGmHdGBu"
  },
  {
    "stationCode": "DALIOIL_013",
    "city": "Nová Dubnica",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/13wxqgmo1lLtXrfKi3zd0CjWIgFsSZmt6"
  },
  {
    "stationCode": "DALIOIL_013",
    "city": "Nová Dubnica",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1Z3WMF4rSPsZ6edKMMuMtbr1VstkWeZ3u"
  },
  {
    "stationCode": "DALIOIL_013",
    "city": "Nová Dubnica",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1Y2rq_foN5BKhh1JBiaVweQOBEfgEITmj"
  },
  {
    "stationCode": "DALIOIL_013",
    "city": "Nová Dubnica",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1H9-9_hZuBh5AZ1rFAvGUmuVK6wKZaPxp"
  },
  {
    "stationCode": "DALIOIL_013",
    "city": "Nová Dubnica",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1iYGNVa1x5QUn72tkjMxfm_YFw52AbKVw"
  },
  {
    "stationCode": "DALIOIL_013",
    "city": "Nová Dubnica",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1gJuOZMdeh-LTyQsMUD0boJXt776wc0XV"
  },
  {
    "stationCode": "DALIOIL_014",
    "city": "Považská Teplá",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1FwvPZ89Pbizd3FkYql4CWmN_jan8wduG"
  },
  {
    "stationCode": "DALIOIL_014",
    "city": "Považská Teplá",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1JVXOgdGmnazj71A5BTQ72zl_Ka0Ev0Z3"
  },
  {
    "stationCode": "DALIOIL_014",
    "city": "Považská Teplá",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1si26ZiJoj-jDnmJE4MT85pDwIUHOxBzh"
  },
  {
    "stationCode": "DALIOIL_014",
    "city": "Považská Teplá",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1gl_QDAOx3aqMESSUbIgVUcAbYeK9SHOV"
  },
  {
    "stationCode": "DALIOIL_014",
    "city": "Považská Teplá",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/15GcWekTylkxmE_5ucn4LaFMwl0yz2HO8"
  },
  {
    "stationCode": "DALIOIL_014",
    "city": "Považská Teplá",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/14ql0j6SDG4eX6-llIkjYoQYRK2XNNHiQ"
  },
  {
    "stationCode": "DALIOIL_014",
    "city": "Považská Teplá",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1EwCc7HWWC3mVKIg_EGlAOGM1fRzBG76G"
  },
  {
    "stationCode": "DALIOIL_014",
    "city": "Považská Teplá",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1TsziGXQWnlXKznES5hbftT0mLEojruqe"
  },
  {
    "stationCode": "DALIOIL_014",
    "city": "Považská Teplá",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1pYOzWq15gxhgZmknc8Nej3SsLEc6C44B"
  },
  {
    "stationCode": "DALIOIL_014",
    "city": "Považská Teplá",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1BRxMdXEQdXuWfFsMJF3jZ87cAstnp-YU"
  },
  {
    "stationCode": "DALIOIL_014",
    "city": "Považská Teplá",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1haXQ9qgv9HL_MsdT9Ss7Xoq6dEJzZ9fS"
  },
  {
    "stationCode": "DALIOIL_014",
    "city": "Považská Teplá",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1kUDOnRGnld43OTfs1Ma9tUY8hrpR_TUp"
  },
  {
    "stationCode": "DALIOIL_015",
    "city": "Dolný Hričov",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1_wQinij3zEDI1gAXcw4a7_CaiA3MP6NM"
  },
  {
    "stationCode": "DALIOIL_015",
    "city": "Dolný Hričov",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1rfvIsE_f3WoF_TiT5Oubo4_wEXNbK6LM"
  },
  {
    "stationCode": "DALIOIL_015",
    "city": "Dolný Hričov",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1Z8f_rhVBDMke88PsxppGOBQCJTb3Nb9z"
  },
  {
    "stationCode": "DALIOIL_015",
    "city": "Dolný Hričov",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/153rXpSilmcZtRdEL4F-zSuumRheViKyB"
  },
  {
    "stationCode": "DALIOIL_015",
    "city": "Dolný Hričov",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1MANMqYanJtbVovTOmmskZGTPns0oIWr-"
  },
  {
    "stationCode": "DALIOIL_015",
    "city": "Dolný Hričov",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/14QR2igLjMCHszH-o5vGhcUjyqlrU14Fd"
  },
  {
    "stationCode": "DALIOIL_015",
    "city": "Dolný Hričov",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/18pXfl7_By_LdYKeoSuaS73xJ_GmRO0HA"
  },
  {
    "stationCode": "DALIOIL_015",
    "city": "Dolný Hričov",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1WvktnY7HeOnoOFiwydRsM1fKRBdlUBmq"
  },
  {
    "stationCode": "DALIOIL_015",
    "city": "Dolný Hričov",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1AtuVtr9pIOY3JFLE9hIocq6Ah4CCuG3m"
  },
  {
    "stationCode": "DALIOIL_015",
    "city": "Dolný Hričov",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/11dmjUyr-aZhvm2BmsUod8RxJPtSNRNbv"
  },
  {
    "stationCode": "DALIOIL_015",
    "city": "Dolný Hričov",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1aySA1SZrBvlg6O1segsnJ5IgnYVG7Lbp"
  },
  {
    "stationCode": "DALIOIL_015",
    "city": "Dolný Hričov",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1ZuR2lQuyjWO0nEyWY5Sk4_FflVRWbE5B"
  },
  {
    "stationCode": "DALIOIL_015",
    "city": "Dolný Hričov",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1dUM1JeL9jqdVgYRP9ugfDwMRuLQTFzT5"
  },
  {
    "stationCode": "DALIOIL_016",
    "city": "Krásno nad Kysucou",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1r7UYc1q4H8FhUH4OIJq9qhDLD4Nn0BFA"
  },
  {
    "stationCode": "DALIOIL_016",
    "city": "Krásno nad Kysucou",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1tKoQGLREUtVsx2iQMY7V1r0NgmnL7hDC"
  },
  {
    "stationCode": "DALIOIL_016",
    "city": "Krásno nad Kysucou",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/12Xvu1va1COz4wzs4tCyWEbbn4VH1NOkf"
  },
  {
    "stationCode": "DALIOIL_016",
    "city": "Krásno nad Kysucou",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1uZXkgdNg1btTQSMeUvRY-Jbwyh5qmQFE"
  },
  {
    "stationCode": "DALIOIL_016",
    "city": "Krásno nad Kysucou",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1Hxqddbs7ZyT1PoqkPcbOXOdALIehG99v"
  },
  {
    "stationCode": "DALIOIL_016",
    "city": "Krásno nad Kysucou",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/16tCDsQ55Np1v1btBKFKBEJLxd5Q8ZMxd"
  },
  {
    "stationCode": "DALIOIL_016",
    "city": "Krásno nad Kysucou",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1YBWys4fjhZnhzN7B3Gb18EgHlH88Mz5G"
  },
  {
    "stationCode": "DALIOIL_016",
    "city": "Krásno nad Kysucou",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/12Ow1aqeJpyHWrzl-QHzySJzNFz47lECb"
  },
  {
    "stationCode": "DALIOIL_016",
    "city": "Krásno nad Kysucou",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1lRQaZJCicApxLE8QhJJvCRXJQb7xfXGN"
  },
  {
    "stationCode": "DALIOIL_016",
    "city": "Krásno nad Kysucou",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1WcIwO0rFgEe5aewaqAltMttP6b0JXr8A"
  },
  {
    "stationCode": "DALIOIL_016",
    "city": "Krásno nad Kysucou",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1E7r05xkngvbXWd-JJgYf_kdQoT4QpWXj"
  },
  {
    "stationCode": "DALIOIL_016",
    "city": "Krásno nad Kysucou",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1hBnBOvchdwxxUXTU57H4YluV3zjZohII"
  },
  {
    "stationCode": "DALIOIL_017",
    "city": "Martin",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1yesxvBzx1AJYJb7WBflT0iR1jITJfT6r"
  },
  {
    "stationCode": "DALIOIL_017",
    "city": "Martin",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1ZKiRfUOAHylFp_EQQwbecN12eIIVLKj5"
  },
  {
    "stationCode": "DALIOIL_017",
    "city": "Martin",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1fFRDLBOJp2ZTwmffvoeeS8WMt3teLxLY"
  },
  {
    "stationCode": "DALIOIL_017",
    "city": "Martin",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1FkVa3tNJ6KUVmffZTev5Tl3M0QQgtfTq"
  },
  {
    "stationCode": "DALIOIL_017",
    "city": "Martin",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1Fetj7Bnk9ERAoi_XRonHQXxEeDaZkwPA"
  },
  {
    "stationCode": "DALIOIL_017",
    "city": "Martin",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1IxxrZkzCXC6y-gT7cDz_FtwWWckgkE_R"
  },
  {
    "stationCode": "DALIOIL_017",
    "city": "Martin",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1HAY94ARLZQKHhGCoV5zeAskTXmaQ9HVn"
  },
  {
    "stationCode": "DALIOIL_017",
    "city": "Martin",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1olAo1QQpmLV98HVzvH9cnSdwg6AViSFR"
  },
  {
    "stationCode": "DALIOIL_017",
    "city": "Martin",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1lQPvYa8h3UrMdK7X8AAkfN7GYZ9e0I0J"
  },
  {
    "stationCode": "DALIOIL_017",
    "city": "Martin",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1cS7JumY3x9jQzTHPf8qUMlnDYxFnX8hJ"
  },
  {
    "stationCode": "DALIOIL_017",
    "city": "Martin",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/12DwPvh6xEli-2LTo2aqcjXIAtNUs6meh"
  },
  {
    "stationCode": "DALIOIL_017",
    "city": "Martin",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1RmmB1csAH4j3YZnlYxBSht6U3IPyl_D-"
  },
  {
    "stationCode": "DALIOIL_018",
    "city": "Turany",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1fMy4j2eWdtH4G_RUDlyDeHmeEFzEUJiv"
  },
  {
    "stationCode": "DALIOIL_018",
    "city": "Turany",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1SkjxUkI1am8SnJw35jITp0BIQ-3AgH3M"
  },
  {
    "stationCode": "DALIOIL_018",
    "city": "Turany",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1Tw2Fh7vPUnxJxijfOVtVLzHWn6UKerQB"
  },
  {
    "stationCode": "DALIOIL_018",
    "city": "Turany",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1Nz_5wSBXkG0gB7MtpcPM-0MPN3U3e9iT"
  },
  {
    "stationCode": "DALIOIL_018",
    "city": "Turany",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1rg1plg4H10P4lonUfym-6938_1iHA2x2"
  },
  {
    "stationCode": "DALIOIL_018",
    "city": "Turany",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1JJrGOTM41JaRyxnPzV3Qt3m6RRGICemU"
  },
  {
    "stationCode": "DALIOIL_018",
    "city": "Turany",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/19k3XnRjsV022hS9hnesLKUxFBz-YfgB1"
  },
  {
    "stationCode": "DALIOIL_018",
    "city": "Turany",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1NGlOquqg0f2TbnkUsWWTGG3X3XbeGYEV"
  },
  {
    "stationCode": "DALIOIL_018",
    "city": "Turany",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1AuGxDRHgVal-p2on901CXhTbPNpF7rZy"
  },
  {
    "stationCode": "DALIOIL_018",
    "city": "Turany",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1ZK7GK0rQXGjqda7WHW240cU14sNwN0vq"
  },
  {
    "stationCode": "DALIOIL_018",
    "city": "Turany",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1egcMnCAG35_sNMSH_1v94ZgH63Yttj_j"
  },
  {
    "stationCode": "DALIOIL_018",
    "city": "Turany",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1lp270Bfo0ogZKdbsyRLBotkUtnarx5Fj"
  },
  {
    "stationCode": "DALIOIL_019",
    "city": "Turčianske Teplice",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1HkyARHSnJVgsNVSHMq2uaQX-cxZzQdbc"
  },
  {
    "stationCode": "DALIOIL_019",
    "city": "Turčianske Teplice",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1IMZ0tIBOg5s4WRvFB4UiffgqiVghpNYa"
  },
  {
    "stationCode": "DALIOIL_019",
    "city": "Turčianske Teplice",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1B-VFCFA6g6XN7rNkfa7UG-wWH8TbB9Tc"
  },
  {
    "stationCode": "DALIOIL_019",
    "city": "Turčianske Teplice",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1FvFzJf2HeJuZlicqo9srNOLYJbuWrJeF"
  },
  {
    "stationCode": "DALIOIL_019",
    "city": "Turčianske Teplice",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1I87T539Cd7o8Oh0Y2tUKvAbeu4LIhYBE"
  },
  {
    "stationCode": "DALIOIL_019",
    "city": "Turčianske Teplice",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1r_Nb2TmEjLya-3b0DzHZmLg1RlAJLPaf"
  },
  {
    "stationCode": "DALIOIL_019",
    "city": "Turčianske Teplice",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1-VeFobYNEVA5Q-Sy-UR6xPCu_NQWoRGm"
  },
  {
    "stationCode": "DALIOIL_019",
    "city": "Turčianske Teplice",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1Ez22cAezoeOYbXfnIdCG2kg4c-ZtIXMj"
  },
  {
    "stationCode": "DALIOIL_019",
    "city": "Turčianske Teplice",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1JP-D0NTqTCDLwaKqrcBUkwbWsHeYdZUp"
  },
  {
    "stationCode": "DALIOIL_019",
    "city": "Turčianske Teplice",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/18F2zFpt-htbV1IMDzkvp63yjiw2phKJ4"
  },
  {
    "stationCode": "DALIOIL_019",
    "city": "Turčianske Teplice",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1MvuWZOpU5z9n6l35ltnrU5JZFTcZmYS8"
  },
  {
    "stationCode": "DALIOIL_019",
    "city": "Turčianske Teplice",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/15gqQ9vy8iqsHaEQQbDL1OsxVqZvSpiT2"
  },
  {
    "stationCode": "DALIOIL_020",
    "city": "Ludanice",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1VWSqoh0C7cVfGU4fhbrE48fIoYn19UBD"
  },
  {
    "stationCode": "DALIOIL_020",
    "city": "Ludanice",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1uZGoOqGcI_aXbkm_pBYCSIfIdNFL1h-B"
  },
  {
    "stationCode": "DALIOIL_020",
    "city": "Ludanice",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1BcY3hnrb8Kcd_ET5KT4PTwyxtskhRPa9"
  },
  {
    "stationCode": "DALIOIL_020",
    "city": "Ludanice",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1-PtvHrxX9Ja-uGpkrXhEkA_IdnslGOJp"
  },
  {
    "stationCode": "DALIOIL_020",
    "city": "Ludanice",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1eadRxyhfvt4vqlpoktgj9f7R20pJWF4g"
  },
  {
    "stationCode": "DALIOIL_020",
    "city": "Ludanice",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1LECZcnPRa3Ii1jFzidHkyl3m3pN4xjU9"
  },
  {
    "stationCode": "DALIOIL_020",
    "city": "Ludanice",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1snFTcIgVbHOoIKkNKwpzT-KzA5jM_G5E"
  },
  {
    "stationCode": "DALIOIL_020",
    "city": "Ludanice",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1namAUpAgUcHXPITNIws70lEOj-Ky_CgN"
  },
  {
    "stationCode": "DALIOIL_020",
    "city": "Ludanice",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/15glYhBG07n7mvLdfsrCeHyETqI1hdoMk"
  },
  {
    "stationCode": "DALIOIL_020",
    "city": "Ludanice",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1ZVJdX7DO6dA5gjnA_skXbxzHQbxF4VJF"
  },
  {
    "stationCode": "DALIOIL_020",
    "city": "Ludanice",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1QyWd5-18h400KnFyjky2MF-4THd-8I4d"
  },
  {
    "stationCode": "DALIOIL_020",
    "city": "Ludanice",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/19TBy5ogmumMLGhtAwYIV5p3L0e6Tt4v-"
  },
  {
    "stationCode": "DALIOIL_021",
    "city": "Male Bielice",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1pZWOQZ2epE7G2ok3cTXvXniKRuwtICQp"
  },
  {
    "stationCode": "DALIOIL_021",
    "city": "Male Bielice",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1PkmIDPupmiqfVZ6Q4eamCT21-6_HiklC"
  },
  {
    "stationCode": "DALIOIL_021",
    "city": "Male Bielice",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/178jyOIcr-k0n9hm4oTMD0hYgwVqamBG1"
  },
  {
    "stationCode": "DALIOIL_021",
    "city": "Male Bielice",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1vWlGeCJJ6WOfpj0BEerXkh9IDjlkWrqN"
  },
  {
    "stationCode": "DALIOIL_021",
    "city": "Male Bielice",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1Ex_jzUZ3uovA6v-cNT1-Wo6EaeTeG1o1"
  },
  {
    "stationCode": "DALIOIL_021",
    "city": "Male Bielice",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/10CWmwMfcGzecVSp88yHaQ0FR3lVXRG5p"
  },
  {
    "stationCode": "DALIOIL_021",
    "city": "Male Bielice",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1hkbdB8gQBI5mh2XkpGErL0K9RHoklEkD"
  },
  {
    "stationCode": "DALIOIL_021",
    "city": "Male Bielice",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/11Do_imaNcd73Dd5UQBI7nrA_oEDelppv"
  },
  {
    "stationCode": "DALIOIL_021",
    "city": "Male Bielice",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1WySZdXH7kUu_5xnZtuFGONrn_x2uuFuh"
  },
  {
    "stationCode": "DALIOIL_021",
    "city": "Male Bielice",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1XO2pjlUatPQUe-9stMbybB8i8W2FTAUb"
  },
  {
    "stationCode": "DALIOIL_021",
    "city": "Male Bielice",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1zjfECsdwgAkCedPiaUZq1LBiALVefhAv"
  },
  {
    "stationCode": "DALIOIL_021",
    "city": "Male Bielice",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1O1gzH9IMzkfURxJYpqAO77pOGCCUpzeo"
  },
  {
    "stationCode": "DALIOIL_022",
    "city": "Nitrianske Rudno",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1eE2BXQn3C78qudCPtNHHvrWFAyfxR9-M"
  },
  {
    "stationCode": "DALIOIL_022",
    "city": "Nitrianske Rudno",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1tx_MaG5qK6cMnTdfwnmfHR6L3ODCUha1"
  },
  {
    "stationCode": "DALIOIL_022",
    "city": "Nitrianske Rudno",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/19gbHwp8FpCC8vhyrFQNzw_t1UD3eCl30"
  },
  {
    "stationCode": "DALIOIL_022",
    "city": "Nitrianske Rudno",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/13YAZrWl5HzHwHI_m1047yXBOINIi6iuq"
  },
  {
    "stationCode": "DALIOIL_022",
    "city": "Nitrianske Rudno",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1gRVHrRC364DBjRa4WrZIu3lw3WmMT-p0"
  },
  {
    "stationCode": "DALIOIL_022",
    "city": "Nitrianske Rudno",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1fcV55r35saT4SbyPhy2XgQ4G_yii138R"
  },
  {
    "stationCode": "DALIOIL_022",
    "city": "Nitrianske Rudno",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1zpgaqBfxByzSOKe06oC82boe5pQzdd58"
  },
  {
    "stationCode": "DALIOIL_022",
    "city": "Nitrianske Rudno",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1WnYdeQ2HM-nWaxAtcqEpQ3A5fI_32627"
  },
  {
    "stationCode": "DALIOIL_022",
    "city": "Nitrianske Rudno",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1LJUA8cuecwfQmrEwKDA5jf8YwP5F6usI"
  },
  {
    "stationCode": "DALIOIL_022",
    "city": "Nitrianske Rudno",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1kKNm84_YCzDW35nYcAmCuEH5bTU6dkuW"
  },
  {
    "stationCode": "DALIOIL_022",
    "city": "Nitrianske Rudno",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1VqulgHFsnUwv3PKZJgYguG3_K3sZ5_9d"
  },
  {
    "stationCode": "DALIOIL_022",
    "city": "Nitrianske Rudno",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1bCYbSV9jt_8m9FwfWSs1SotH3htkD7yF"
  },
  {
    "stationCode": "DALIOIL_023",
    "city": "Beladice",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1MphWP0LJLkrnahTMnEvQswOP--iL16np"
  },
  {
    "stationCode": "DALIOIL_023",
    "city": "Beladice",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1vyo2npej3deuHJtuy3GTbrmnflu3qFBB"
  },
  {
    "stationCode": "DALIOIL_023",
    "city": "Beladice",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1nIjOK0CpZxyQ2qgI6TcMPEBNavyKSp_y"
  },
  {
    "stationCode": "DALIOIL_023",
    "city": "Beladice",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1LwUd-3MFea-CzOGQGjDJoHL_DfQviF_w"
  },
  {
    "stationCode": "DALIOIL_023",
    "city": "Beladice",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1j8hulgkoSQHj7fAcdRI-2YbyVo0Pp9rC"
  },
  {
    "stationCode": "DALIOIL_023",
    "city": "Beladice",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1Kjvr8NbBC7QtXJqMv8EhSFzz0oNAGesz"
  },
  {
    "stationCode": "DALIOIL_023",
    "city": "Beladice",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1X5NJ-r65U8o5fbCylVz1FOXYcvnjfuim"
  },
  {
    "stationCode": "DALIOIL_023",
    "city": "Beladice",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1maoweCQvSrA8zG-_6QEIQjEtdwA-yrpd"
  },
  {
    "stationCode": "DALIOIL_023",
    "city": "Beladice",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/14KOQHTdaFcWWbMlZwal9nZ2D2THNKD7Z"
  },
  {
    "stationCode": "DALIOIL_023",
    "city": "Beladice",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1YISv4-GDM2E_ccKx3OU0-UHZGF6Dx9VW"
  },
  {
    "stationCode": "DALIOIL_023",
    "city": "Beladice",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1wInWbCdN7RtUsbPCFPEU7X5zFPp6-Hbk"
  },
  {
    "stationCode": "DALIOIL_023",
    "city": "Beladice",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1jex5YHjcxL0E91k_-Y9C-PvTTinpY-Rg"
  },
  {
    "stationCode": "DALIOIL_023",
    "city": "Beladice",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/18jMYb-xSZdQaB74yxQA_gJGc-u15PmyD"
  },
  {
    "stationCode": "DALIOIL_024",
    "city": "Podhájska",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/16gF59or1AqajY829bGk1JHQ1Dx3I_qOy"
  },
  {
    "stationCode": "DALIOIL_024",
    "city": "Podhájska",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1gqHEjl2oyQcRRORMyI9SCpyq5lm8UtsT"
  },
  {
    "stationCode": "DALIOIL_024",
    "city": "Podhájska",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1T38t5tmyCWhrIAqH0Qq2qOgnpoNg_MJu"
  },
  {
    "stationCode": "DALIOIL_024",
    "city": "Podhájska",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1eLNLvwmNMWfkQNrJePR1zXogTKlJNveH"
  },
  {
    "stationCode": "DALIOIL_024",
    "city": "Podhájska",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/135RY_diB8k1fc7Cm8GMI2Fs6pSw4j7T7"
  },
  {
    "stationCode": "DALIOIL_024",
    "city": "Podhájska",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1RHDOUbWf8MMw11rNAhh-to3IQBBiAnXa"
  },
  {
    "stationCode": "DALIOIL_024",
    "city": "Podhájska",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1i7HE_OPWb7mkviVysDhNg57ltBPsvCv8"
  },
  {
    "stationCode": "DALIOIL_024",
    "city": "Podhájska",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/191AEEaPguvObcNCld2z4TNhFCG7jm74E"
  },
  {
    "stationCode": "DALIOIL_024",
    "city": "Podhájska",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1x8blPfsHHJhXe5lSrqMaPIixNyWYbntc"
  },
  {
    "stationCode": "DALIOIL_024",
    "city": "Podhájska",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1uMMRfQ1otIJgX16Ky88OrTKGUpdo-jAy"
  },
  {
    "stationCode": "DALIOIL_024",
    "city": "Podhájska",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1FO5GFtZj44J2_WCIeeHKJ5e3_1cTLQkE"
  },
  {
    "stationCode": "DALIOIL_024",
    "city": "Podhájska",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/17C9gsOQWfC4qWhM0EiVoxh4XwY_q6hVr"
  },
  {
    "stationCode": "DALIOIL_025",
    "city": "Tupá",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1K-f3tFY2OncSFfqc2waZfH3We7rHMg2v"
  },
  {
    "stationCode": "DALIOIL_025",
    "city": "Tupá",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/18LyQgXXhaDmPF2dP8RyBYZE-dZb_KAGZ"
  },
  {
    "stationCode": "DALIOIL_025",
    "city": "Tupá",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1hO8cUfu1XVksAzrnxVx2b0_ccLL40orZ"
  },
  {
    "stationCode": "DALIOIL_025",
    "city": "Tupá",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1M-bdDt9NU-H_XCEIkxXspI6SIlZXMSZe"
  },
  {
    "stationCode": "DALIOIL_025",
    "city": "Tupá",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1GIM33_fToyjaQDkvUMZaDasEcgT-qoWz"
  },
  {
    "stationCode": "DALIOIL_025",
    "city": "Tupá",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1Wu86HjIjZ6sWzfF8Lal4jDOeyplr0Vi3"
  },
  {
    "stationCode": "DALIOIL_025",
    "city": "Tupá",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1jn44ZmZcNKG6RJedGp5nnx81SiCQgWLi"
  },
  {
    "stationCode": "DALIOIL_025",
    "city": "Tupá",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1MiglVCmyifDHoNmUKqP8BzAwytx8iKkH"
  },
  {
    "stationCode": "DALIOIL_025",
    "city": "Tupá",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/19zr8sSHyxM8ztoQWlFoEVnKJB5uVsrkp"
  },
  {
    "stationCode": "DALIOIL_025",
    "city": "Tupá",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1MXOuyJKBwGZyN0eHrp7hXe2KD7sf4U32"
  },
  {
    "stationCode": "DALIOIL_025",
    "city": "Tupá",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1Oq8wOAeaq1QhxItEScNOPH7UILLQ84fp"
  },
  {
    "stationCode": "DALIOIL_025",
    "city": "Tupá",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1Of4pYhKlZpDxibZ8XvuSRVMk8xr9rEG2"
  },
  {
    "stationCode": "DALIOIL_026",
    "city": "Gbelce",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1OWnSSefXfJAMQjBZOjZQ65SOPa67YVOG"
  },
  {
    "stationCode": "DALIOIL_026",
    "city": "Gbelce",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1IhnkgI8_B5lRfDCcDau5RBh3vvJIdnOy"
  },
  {
    "stationCode": "DALIOIL_026",
    "city": "Gbelce",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1aw9rLi9vKXfbqE3K1tz7o1SkMd0u_GjX"
  },
  {
    "stationCode": "DALIOIL_026",
    "city": "Gbelce",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1ccD7jaf431b3rYMP-A6FM7vl6BbF2lZC"
  },
  {
    "stationCode": "DALIOIL_026",
    "city": "Gbelce",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1uU2xf6S6Pa_GnUDaHg_Vxy5Xz8iFwbQY"
  },
  {
    "stationCode": "DALIOIL_026",
    "city": "Gbelce",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1xqJFd5pajftocNHMHKNknGyz2F9tsEV-"
  },
  {
    "stationCode": "DALIOIL_026",
    "city": "Gbelce",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1golMgT1EiW5-YtZw1vg4Op7TjYBaEFH3"
  },
  {
    "stationCode": "DALIOIL_026",
    "city": "Gbelce",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1tmtuf30Rv-7O5IxeWH6_pbtUYBpDjIzI"
  },
  {
    "stationCode": "DALIOIL_026",
    "city": "Gbelce",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1POGQQBeNAwRWP-a77cF0th4zd4fMf8kk"
  },
  {
    "stationCode": "DALIOIL_026",
    "city": "Gbelce",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1-cc3_ZyFV5L7wufP6-4NG6A4MhVVFmrT"
  },
  {
    "stationCode": "DALIOIL_026",
    "city": "Gbelce",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/11-j_bTqMUVA-oVffl8UG5yh4_kqLQdtg"
  },
  {
    "stationCode": "DALIOIL_026",
    "city": "Gbelce",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1gZQ-X8zMPBE0Byby_fq381_6pTE69cRu"
  },
  {
    "stationCode": "DALIOIL_026",
    "city": "Gbelce",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1A3RXZTrPHHDTmXt72po5bZz_42KUqdDx"
  },
  {
    "stationCode": "DALIOIL_027",
    "city": "Hontianske Nemce",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1VQuKMtJ6BaUYn_wM5nvLC49vOOiQLajy"
  },
  {
    "stationCode": "DALIOIL_027",
    "city": "Hontianske Nemce",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1v1LOqEMKkxcHmk4LQlK5RrpZJ-zWWrDM"
  },
  {
    "stationCode": "DALIOIL_027",
    "city": "Hontianske Nemce",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1Yv9TXmFvF3teIL4ewX3xyKLA7hzW358S"
  },
  {
    "stationCode": "DALIOIL_027",
    "city": "Hontianske Nemce",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1hez8ohAgbm9sehklbXt36cRDTcqZ8D9l"
  },
  {
    "stationCode": "DALIOIL_027",
    "city": "Hontianske Nemce",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1k4RghReyRgmHfyyRcyZwn-8-6bMxcHCG"
  },
  {
    "stationCode": "DALIOIL_027",
    "city": "Hontianske Nemce",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1U4CCeF0e17IqUEK3aW7JXAVPpU5O-HkX"
  },
  {
    "stationCode": "DALIOIL_027",
    "city": "Hontianske Nemce",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1TwvJhSQHbSIR0HTj1F5YLpoocm8cXThR"
  },
  {
    "stationCode": "DALIOIL_027",
    "city": "Hontianske Nemce",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/15vBrnjv0KciI09JwHVMEx8_aFeki8WOn"
  },
  {
    "stationCode": "DALIOIL_027",
    "city": "Hontianske Nemce",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1RSCdjibQq4VrzigIaGk39dJvf4Squ5Zj"
  },
  {
    "stationCode": "DALIOIL_027",
    "city": "Hontianske Nemce",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1RWRV3wpl78g4bD5J5D2FF9k6Bk7_0f9r"
  },
  {
    "stationCode": "DALIOIL_027",
    "city": "Hontianske Nemce",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1emUChv_r7sgFRtvn2VRT_w9AFuEDZPVj"
  },
  {
    "stationCode": "DALIOIL_027",
    "city": "Hontianske Nemce",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1tBM8SgWZObt2mFt62k_i_jvt_Pd2Xl_R"
  },
  {
    "stationCode": "DALIOIL_028",
    "city": "Hliník nad Hronom",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1zjpJSaXhXFaZbU1GW_25LS7BKnhI9ICB"
  },
  {
    "stationCode": "DALIOIL_028",
    "city": "Hliník nad Hronom",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1JdNvkFozaLebl3YO1sY_wunuoy4zBDDW"
  },
  {
    "stationCode": "DALIOIL_028",
    "city": "Hliník nad Hronom",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1wqhj_vMfILdic3p05notO8w-9I-SqLdp"
  },
  {
    "stationCode": "DALIOIL_028",
    "city": "Hliník nad Hronom",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1esX5fg7OT_QmjHxqJGNJmAReXLRCJh3l"
  },
  {
    "stationCode": "DALIOIL_028",
    "city": "Hliník nad Hronom",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/167pHB8uGvyNtwQXU_zWYYd8aZ_uH5UJj"
  },
  {
    "stationCode": "DALIOIL_028",
    "city": "Hliník nad Hronom",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1g5fzIPYw1iR5zyhBiSN8Udu_QXAUPfTt"
  },
  {
    "stationCode": "DALIOIL_028",
    "city": "Hliník nad Hronom",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1xuCM36N8Fa5ZNa9sS82tuYRf8x79L_Vl"
  },
  {
    "stationCode": "DALIOIL_028",
    "city": "Hliník nad Hronom",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1TF7SMro6ymuRw-NKv3WLJYqG6hcUi0_6"
  },
  {
    "stationCode": "DALIOIL_028",
    "city": "Hliník nad Hronom",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/10iesnbKbY81VNOHQCLedxGSHlOWPczaU"
  },
  {
    "stationCode": "DALIOIL_028",
    "city": "Hliník nad Hronom",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1lL1zSMHXH8NQbDiWtSwO5SxFNcjc9Qjt"
  },
  {
    "stationCode": "DALIOIL_028",
    "city": "Hliník nad Hronom",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1KbkYy_N383u_Hi3sg-EsF4BAdma_eFOZ"
  },
  {
    "stationCode": "DALIOIL_028",
    "city": "Hliník nad Hronom",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1c93Xu1Yxfo7KkWX2cGkTVzxZ0uuVSb24"
  },
  {
    "stationCode": "DALIOIL_029",
    "city": "Banská Bystrica",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1jPTB9DADUlWOjFusSt3RYUK-Z8sV26Ju"
  },
  {
    "stationCode": "DALIOIL_029",
    "city": "Banská Bystrica",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/19L5H6LYNl9Wf2b3jGgDyQ9ZGg1OtTtFb"
  },
  {
    "stationCode": "DALIOIL_029",
    "city": "Banská Bystrica",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1JgSl582xAIRpw-GZKr4eEGUiNoasoFhO"
  },
  {
    "stationCode": "DALIOIL_029",
    "city": "Banská Bystrica",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1dDVh-zU8qdBlymY1ufJPrTBbpzfHAFH7"
  },
  {
    "stationCode": "DALIOIL_029",
    "city": "Banská Bystrica",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1cYoOmIhpbKq94yj9kFvz0ERkFKHTETs0"
  },
  {
    "stationCode": "DALIOIL_029",
    "city": "Banská Bystrica",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1uzSTtcmhhbi45OB8Z9hhWg_wR8u5JnyY"
  },
  {
    "stationCode": "DALIOIL_029",
    "city": "Banská Bystrica",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1sw3ivoh9jAV3-X8LnNGvFW5sC8L6Nn8a"
  },
  {
    "stationCode": "DALIOIL_029",
    "city": "Banská Bystrica",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1aYPVV2uJ2lBaUATmDi4INPCrFTbgxRXm"
  },
  {
    "stationCode": "DALIOIL_029",
    "city": "Banská Bystrica",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1JgqoGzrUpXG0acAVj_pRoDbVTdC2ofSA"
  },
  {
    "stationCode": "DALIOIL_029",
    "city": "Banská Bystrica",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1GTjFPjUHyrrp1S8GZ0-Wx_lP-Apv0-7E"
  },
  {
    "stationCode": "DALIOIL_029",
    "city": "Banská Bystrica",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1CZlaWlAConJELxLrYWBbDpGWH9ayBpTB"
  },
  {
    "stationCode": "DALIOIL_029",
    "city": "Banská Bystrica",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1MEbz5TGTQ2Ej_L_ZMsJlpaM-zkWsEl6V"
  },
  {
    "stationCode": "DALIOIL_030",
    "city": "Veľké Bierovce",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1f_JuwbyoH4Bb0zi46dJstpIR_gD5jyfr"
  },
  {
    "stationCode": "DALIOIL_030",
    "city": "Veľké Bierovce",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1xVyd-pN322L4zhDX15qw4lXAcbuUMxpO"
  },
  {
    "stationCode": "DALIOIL_030",
    "city": "Veľké Bierovce",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1UFRsaNfKFfaazJfuyTOYz1C6p5Ze_iy2"
  },
  {
    "stationCode": "DALIOIL_030",
    "city": "Veľké Bierovce",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1hM241z8B409QxaBA0O0iKivZXraCzWIe"
  },
  {
    "stationCode": "DALIOIL_030",
    "city": "Veľké Bierovce",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1Dhn1aa-VY25TA3lxsLdwTRFRwaCiiPOD"
  },
  {
    "stationCode": "DALIOIL_030",
    "city": "Veľké Bierovce",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1_a6aQqzXLAYcqko8iDoiCVl9BymPW_x3"
  },
  {
    "stationCode": "DALIOIL_030",
    "city": "Veľké Bierovce",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1U4dJzgOfyeN4Qz1ZAVbX4znrefxoEKqF"
  },
  {
    "stationCode": "DALIOIL_030",
    "city": "Veľké Bierovce",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1VLaNlePtZwvc64s-51xylzjxoFC_HQuU"
  },
  {
    "stationCode": "DALIOIL_030",
    "city": "Veľké Bierovce",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1rU8zWFoEekqmlTjpcDyJ_4E-17VEZmn6"
  },
  {
    "stationCode": "DALIOIL_030",
    "city": "Veľké Bierovce",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1Y3ttEZBVHdVEgOF2nKB7NWHyNfW2gizS"
  },
  {
    "stationCode": "DALIOIL_030",
    "city": "Veľké Bierovce",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1IuYnHWdX9fV3AisB2kNIpH7GLe1hlKXk"
  },
  {
    "stationCode": "DALIOIL_030",
    "city": "Veľké Bierovce",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/10uCb7_JW8089b0S2cDPy2nIAhPJ8CRwX"
  },
  {
    "stationCode": "DALIOIL_031",
    "city": "Trstená",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1BiEgCSjumITcmS9Hre1gyynPQ7O11yPg"
  },
  {
    "stationCode": "DALIOIL_031",
    "city": "Trstená",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1gwvapRVSmq9nGpg7Guv3KiSbSLMN7QQ_"
  },
  {
    "stationCode": "DALIOIL_031",
    "city": "Trstená",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1IiphSRkQV6GP81a7YlvkUkZOUBz96MZL"
  },
  {
    "stationCode": "DALIOIL_031",
    "city": "Trstená",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1nsaYA5p7Jwv1JaaarvJpBPOLJOTIHU0A"
  },
  {
    "stationCode": "DALIOIL_031",
    "city": "Trstená",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1nFDDm6jA54lprf-DhkZqx2Av3IUyjwGC"
  },
  {
    "stationCode": "DALIOIL_031",
    "city": "Trstená",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1cpRo7wMrj7ZM_ZMQe6R0BKaiSrk6z4tk"
  },
  {
    "stationCode": "DALIOIL_031",
    "city": "Trstená",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1CQEvlGkLJ-aYIzSZw8Bxv_PSRy5qZh9i"
  },
  {
    "stationCode": "DALIOIL_031",
    "city": "Trstená",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1rGdRaEJX8INaXCRgxfBcAi4Rqa8qHdig"
  },
  {
    "stationCode": "DALIOIL_031",
    "city": "Trstená",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1vkUUoyhLA-AsvmIzzX4t6VK-dvgR87Od"
  },
  {
    "stationCode": "DALIOIL_031",
    "city": "Trstená",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/15RlUjx_jfsnBuePe6Af0wENBT-_OpZAN"
  },
  {
    "stationCode": "DALIOIL_031",
    "city": "Trstená",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1VguhFa0yUGPT98kBg9hzXGOwkZe6kBde"
  },
  {
    "stationCode": "DALIOIL_031",
    "city": "Trstená",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1DTns9HRjVT9RGa8xyRM2boSPEzMaWugV"
  },
  {
    "stationCode": "DALIOIL_032",
    "city": "Kozí Vršok – Ivachnová",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1PNjINTtyNLVy6FHlw3m97i-PDXbK85C5"
  },
  {
    "stationCode": "DALIOIL_032",
    "city": "Kozí Vršok – Ivachnová",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1L3vbTvCqdf38ug1W5WI6UaM5Tz3w2Crx"
  },
  {
    "stationCode": "DALIOIL_032",
    "city": "Kozí Vršok – Ivachnová",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1gtd7eM5brWQ90gxFuX9h3GFFtcn7p-CK"
  },
  {
    "stationCode": "DALIOIL_032",
    "city": "Kozí Vršok – Ivachnová",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/16gMZCkVwNWfb1ShCnBD0Pd7P7eVlqFw8"
  },
  {
    "stationCode": "DALIOIL_032",
    "city": "Kozí Vršok – Ivachnová",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/14mP_v2XQ20bg-N8PRcfO6o0DOqNn30Z6"
  },
  {
    "stationCode": "DALIOIL_032",
    "city": "Kozí Vršok – Ivachnová",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1STsGPojAAweT17kPyEEKnKzanQ-orErO"
  },
  {
    "stationCode": "DALIOIL_032",
    "city": "Kozí Vršok – Ivachnová",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1wNoCP5kl37XDNgMi6tAYUoRr9f6Dsgep"
  },
  {
    "stationCode": "DALIOIL_032",
    "city": "Kozí Vršok – Ivachnová",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1lmJlilc4ji9GAhxQR84Ta8QooqNyyS0D"
  },
  {
    "stationCode": "DALIOIL_032",
    "city": "Kozí Vršok – Ivachnová",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1Sy-7QOJo_FkHUsbLkGM2UDRZZ6tvOV2O"
  },
  {
    "stationCode": "DALIOIL_032",
    "city": "Kozí Vršok – Ivachnová",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1aZ0lQng4WYW9YJ9sLbNKJLir0pV1bFEN"
  },
  {
    "stationCode": "DALIOIL_032",
    "city": "Kozí Vršok – Ivachnová",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1rRK-Q0FwgzHTUFZUSUyjrRq5-v3nHXlA"
  },
  {
    "stationCode": "DALIOIL_032",
    "city": "Kozí Vršok – Ivachnová",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/11DjqjHUDMr_i0vG26DiQuCcgHlxxnzne"
  },
  {
    "stationCode": "DALIOIL_033",
    "city": "Liptovský Mikuláš",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1KDzwNGMasxt5_EIXBcrjN8D2Sysir71J"
  },
  {
    "stationCode": "DALIOIL_033",
    "city": "Liptovský Mikuláš",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/19OWnwaG2z4EjSwqpNht88z8vxqPionEB"
  },
  {
    "stationCode": "DALIOIL_033",
    "city": "Liptovský Mikuláš",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1eYypPV25Cu10g1Q5tuwfnt1PTGCYEOQr"
  },
  {
    "stationCode": "DALIOIL_033",
    "city": "Liptovský Mikuláš",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1_yci7oQmIfvHQoPUP_jpzB0XOYcC9bjv"
  },
  {
    "stationCode": "DALIOIL_033",
    "city": "Liptovský Mikuláš",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1SYU-l66VuAAHbxj1Spfw9Hk5xyPPyZKY"
  },
  {
    "stationCode": "DALIOIL_033",
    "city": "Liptovský Mikuláš",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1cZTiTACJVi025wX0m-615Ljf1zdX2olb"
  },
  {
    "stationCode": "DALIOIL_033",
    "city": "Liptovský Mikuláš",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/12-3SseT9MK30HXTmYI4E9pcqRsfielNW"
  },
  {
    "stationCode": "DALIOIL_033",
    "city": "Liptovský Mikuláš",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1cxX95GSWgqfXdthULLCv3xIXCq_k0-fQ"
  },
  {
    "stationCode": "DALIOIL_033",
    "city": "Liptovský Mikuláš",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/16tlzoqZwJx8hVwQCRZgtyPXhatenbffW"
  },
  {
    "stationCode": "DALIOIL_033",
    "city": "Liptovský Mikuláš",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1rCj--mW2FR3aPYfETfA1pukAmxXYkeUC"
  },
  {
    "stationCode": "DALIOIL_033",
    "city": "Liptovský Mikuláš",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1e-Y5nOrUri7Am7m5k76APoZ872wRUlG-"
  },
  {
    "stationCode": "DALIOIL_033",
    "city": "Liptovský Mikuláš",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1P2FEgub7lhvquP5fYV5GVAv9eZ-_FI79"
  },
  {
    "stationCode": "DALIOIL_034",
    "city": "Poprad",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1xNXquhKMYAbfn-_hLh78tDIBCITm-Zon"
  },
  {
    "stationCode": "DALIOIL_034",
    "city": "Poprad",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1ZFltgzbR5Bb9ZOgPUXI7jbIBVwoX2cYv"
  },
  {
    "stationCode": "DALIOIL_034",
    "city": "Poprad",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1FciMtmhgf3EtavfCUFwgzr9ZcIEyfHiV"
  },
  {
    "stationCode": "DALIOIL_034",
    "city": "Poprad",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1CwGv2F-NuqafH7ejz2VqOhE5jaBpGf88"
  },
  {
    "stationCode": "DALIOIL_034",
    "city": "Poprad",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1iTPYLnnrOpJt48mDXpfBrhN6NLx3Qi52"
  },
  {
    "stationCode": "DALIOIL_034",
    "city": "Poprad",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1b_9WWNwbZGZuGvosgum_x2HSihqPBhC8"
  },
  {
    "stationCode": "DALIOIL_034",
    "city": "Poprad",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1PALysidZzZX1od9SiBX7cr98LqR05dsJ"
  },
  {
    "stationCode": "DALIOIL_034",
    "city": "Poprad",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1UExOgEUDn-XfPY-aOs42WiE2PXKOwUlT"
  },
  {
    "stationCode": "DALIOIL_034",
    "city": "Poprad",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1N9mYKMJzwV2l8vfsZFYW7h3c_83d4eAh"
  },
  {
    "stationCode": "DALIOIL_034",
    "city": "Poprad",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1br2jrTAbAXngEA0O7wQECP2uwTN47K6K"
  },
  {
    "stationCode": "DALIOIL_034",
    "city": "Poprad",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1BlGqAgCpaHDPN6hjxSHbF6dMtmfgK4mk"
  },
  {
    "stationCode": "DALIOIL_034",
    "city": "Poprad",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/19QoL3ne44YGAAV2570cXxbd_rEDZagHc"
  },
  {
    "stationCode": "DALIOIL_034",
    "city": "Poprad",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1MM7N7vD--adKU2nqX2JXLF-7bA6TGpdS"
  },
  {
    "stationCode": "DALIOIL_035",
    "city": "Kežmarok",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1Qd8FmzlydVxWEtDOGxGklQcn9ngikp_r"
  },
  {
    "stationCode": "DALIOIL_035",
    "city": "Kežmarok",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1cBGq7mLdVCv789Yfi5XsFqInE15sYdyp"
  },
  {
    "stationCode": "DALIOIL_035",
    "city": "Kežmarok",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1pKay9dHf2NInoAgU4GdW-Zkx8nVAbCw9"
  },
  {
    "stationCode": "DALIOIL_035",
    "city": "Kežmarok",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1bLAjqXV2s3LS2jo3-lf7o9Mnso_1Bqn5"
  },
  {
    "stationCode": "DALIOIL_035",
    "city": "Kežmarok",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/197dr6BxwaLpWmw3MO3ljmD7tmRlx1Fpa"
  },
  {
    "stationCode": "DALIOIL_035",
    "city": "Kežmarok",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1TR47AhetRX0Kc5OHt_gwSWdWW8hyZG0W"
  },
  {
    "stationCode": "DALIOIL_035",
    "city": "Kežmarok",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1eR71iyf2k_dqY5PSxkJnrkWvfAV_SLp_"
  },
  {
    "stationCode": "DALIOIL_035",
    "city": "Kežmarok",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1qfStOl3i3M8-KDJ1aLU5_3pxj8ejs151"
  },
  {
    "stationCode": "DALIOIL_035",
    "city": "Kežmarok",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1XxH1d09NWqz-B_7tdol-Uz3jxdiA6ir4"
  },
  {
    "stationCode": "DALIOIL_035",
    "city": "Kežmarok",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1CG1ybX8OdjS41JZK7S14iPIy3M8I8Vau"
  },
  {
    "stationCode": "DALIOIL_035",
    "city": "Kežmarok",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1tVgaX7Br0m_UZc2pOprbi8Ybh96YemiE"
  },
  {
    "stationCode": "DALIOIL_035",
    "city": "Kežmarok",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/10kzY-wr-37qyhqquumS0jDufPJgPTslI"
  },
  {
    "stationCode": "DALIOIL_036",
    "city": "Veľká Lomnica",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1FEzCn03yPMUl9IJU8WIYFKrOMU2m7voz"
  },
  {
    "stationCode": "DALIOIL_036",
    "city": "Veľká Lomnica",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1U_UU_Z3eJH7UJL387rohlg9aeB11iyA7"
  },
  {
    "stationCode": "DALIOIL_036",
    "city": "Veľká Lomnica",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1mdjWtfMmRH9h5fA-cCK-ntSdnLPK8zEs"
  },
  {
    "stationCode": "DALIOIL_036",
    "city": "Veľká Lomnica",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1IGjIizwNmXekKdGb4sd0WPsfZckBzNIA"
  },
  {
    "stationCode": "DALIOIL_036",
    "city": "Veľká Lomnica",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1ON8QIn8EXskjmCIpdrFznorQMF3xqBb3"
  },
  {
    "stationCode": "DALIOIL_036",
    "city": "Veľká Lomnica",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/19lRSRcDc1UdVJLEOS7uKBTH2Kzmy1tY_"
  },
  {
    "stationCode": "DALIOIL_036",
    "city": "Veľká Lomnica",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1LzA6p7xR5McTkXGAfEc2Z2tfRLCVmlok"
  },
  {
    "stationCode": "DALIOIL_036",
    "city": "Veľká Lomnica",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1Mo6LMwkAHcv5vD-qPE-Nop351Yo3lnZy"
  },
  {
    "stationCode": "DALIOIL_036",
    "city": "Veľká Lomnica",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1kLc6DEn8WvfqjO75Arc8ZiZJ1AzKnnt2"
  },
  {
    "stationCode": "DALIOIL_036",
    "city": "Veľká Lomnica",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1Qz-XuQ8SNx0SpmhJ4y4BwyqnuPyucs8Z"
  },
  {
    "stationCode": "DALIOIL_036",
    "city": "Veľká Lomnica",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1qjtQZtf6kb3WadG6sa_RhC2dB72v-j_s"
  },
  {
    "stationCode": "DALIOIL_036",
    "city": "Veľká Lomnica",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1MUKDn3DPODDya5KU0xlha-MVWWSk6A7P"
  },
  {
    "stationCode": "DALIOIL_037",
    "city": "Dobšiná",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1Lrkytc88Rkm6mWrGo1Nxryu_cy0yjTV3"
  },
  {
    "stationCode": "DALIOIL_037",
    "city": "Dobšiná",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1E6w9TnZ36XeyFUv-9kufZQC7FFR1-fMA"
  },
  {
    "stationCode": "DALIOIL_037",
    "city": "Dobšiná",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1PwCL4BgU2os0Yq-V0JdUef37aLrf4ciZ"
  },
  {
    "stationCode": "DALIOIL_037",
    "city": "Dobšiná",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1qetzoTK1glx5v0ogMVcK-P8cYwf4AInW"
  },
  {
    "stationCode": "DALIOIL_037",
    "city": "Dobšiná",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1B6eKjSDzV0Yy9RVCBxJSZTcLb1GzR3jk"
  },
  {
    "stationCode": "DALIOIL_037",
    "city": "Dobšiná",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/12A0f_CUu-STfJ0hmKhBAmVGZ7BflZmCP"
  },
  {
    "stationCode": "DALIOIL_037",
    "city": "Dobšiná",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1bZjCOCJGymbPw-U6J10Jhg02-pimrcZi"
  },
  {
    "stationCode": "DALIOIL_037",
    "city": "Dobšiná",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1KUPI1AV2Lu5jNpiLlRfUepND1I4d4MD-"
  },
  {
    "stationCode": "DALIOIL_037",
    "city": "Dobšiná",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1mxhQMmyVcI3OkSHztPB7PSa0HWtfT1RZ"
  },
  {
    "stationCode": "DALIOIL_037",
    "city": "Dobšiná",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1k1o-KXKGnBnmnHaXtPPkVnep-KcwB7ob"
  },
  {
    "stationCode": "DALIOIL_037",
    "city": "Dobšiná",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1hSuqXfUUr0frNLgED8lLrDZI47ibfbb1"
  },
  {
    "stationCode": "DALIOIL_037",
    "city": "Dobšiná",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1O7KmeHKVXxtwjCAZhQTI3AcuBneXd5aR"
  },
  {
    "stationCode": "DALIOIL_038",
    "city": "Košice",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1LSwailyvrMry-kY6OHW5vGVzTow3ZmZL"
  },
  {
    "stationCode": "DALIOIL_038",
    "city": "Košice",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1Ujc3Ytk0iOCh40HOPZBiSXLFwoGpPye6"
  },
  {
    "stationCode": "DALIOIL_038",
    "city": "Košice",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/141-4BVCY51PAKeEuVkpkCVTgG1cQT1wR"
  },
  {
    "stationCode": "DALIOIL_038",
    "city": "Košice",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/15ZS8nQh9xt8hZMRG0rNKKQIv3fGwDjD0"
  },
  {
    "stationCode": "DALIOIL_038",
    "city": "Košice",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/16ozqXA9SBycBu601kR7yYc-mfrdkwbnW"
  },
  {
    "stationCode": "DALIOIL_038",
    "city": "Košice",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1_N00ln4l6KmOC-mDd4LcrTVaBP4QFaUn"
  },
  {
    "stationCode": "DALIOIL_038",
    "city": "Košice",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1D1FboFNjhysRWI55Rwp_zcHGNNsEYFN_"
  },
  {
    "stationCode": "DALIOIL_038",
    "city": "Košice",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1Vqz-ZeQu1DH0XyhrhTw8p9PMqv_DB5yS"
  },
  {
    "stationCode": "DALIOIL_038",
    "city": "Košice",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1C7_nUCim7QGXGloSmW55QVCKkU6HxDeG"
  },
  {
    "stationCode": "DALIOIL_038",
    "city": "Košice",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1ESLtiKdurQVHCCAZwnRbcp0OekGZLpco"
  },
  {
    "stationCode": "DALIOIL_038",
    "city": "Košice",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1tFq-scLgnUB7oEsXbZuLwMdjll9mBOBh"
  },
  {
    "stationCode": "DALIOIL_038",
    "city": "Košice",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1GEQqOnPIWpiXOJ570hDP1Ke6TcL0Gpiw"
  },
  {
    "stationCode": "DALIOIL_038",
    "city": "Košice",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1mo7apGl4jMKqyC8QwUklSAWeYtU-C9-s"
  },
  {
    "stationCode": "DALIOIL_039",
    "city": "Michalovce",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1aZfr3quVrjlLCJf0bdFBa6E5IRTf510U"
  },
  {
    "stationCode": "DALIOIL_039",
    "city": "Michalovce",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1y0bTnPBswngllcU_H_OevfYE-ynfKWqJ"
  },
  {
    "stationCode": "DALIOIL_039",
    "city": "Michalovce",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1VcmEGvklXGoOYuy3ZnXQXBEo5lVUrr28"
  },
  {
    "stationCode": "DALIOIL_039",
    "city": "Michalovce",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1g5xUWCsq4a-UAv3fn5toOvprVvZWVcMG"
  },
  {
    "stationCode": "DALIOIL_039",
    "city": "Michalovce",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1WcCliNK6o_u1sjUEtkcQwmTsq7-GFUpq"
  },
  {
    "stationCode": "DALIOIL_039",
    "city": "Michalovce",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1vGSt-GZUjXwA5Fu9vu40cpJc1wKL1vc2"
  },
  {
    "stationCode": "DALIOIL_039",
    "city": "Michalovce",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1I6_r6QRTIlwYgsB5HyO8et38UL-O_Jbi"
  },
  {
    "stationCode": "DALIOIL_039",
    "city": "Michalovce",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/129ZwOB3EkJoHPWEYtSolslS068UccbHM"
  },
  {
    "stationCode": "DALIOIL_039",
    "city": "Michalovce",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1yftgpxEG3uvNk8bME8QelNUuPU0H1oe-"
  },
  {
    "stationCode": "DALIOIL_039",
    "city": "Michalovce",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1rKUZzmPXK643RqyA7L0heyvyIaBa90bu"
  },
  {
    "stationCode": "DALIOIL_039",
    "city": "Michalovce",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1KUdgHdY2Qj0FyfCHgKFXl96P6c8NB45I"
  },
  {
    "stationCode": "DALIOIL_039",
    "city": "Michalovce",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1ch-LcsR1rF5KxiYfTHzflvK0JhX6Rl0x"
  },
  {
    "stationCode": "DALIOIL_040",
    "city": "Strážske",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1FWbEK71MmpU_Vmabc_fO8gkVBwt4pKGZ"
  },
  {
    "stationCode": "DALIOIL_040",
    "city": "Strážske",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1WGfsuUwZctOY5SQJLhsOOK8kbkhQjiTj"
  },
  {
    "stationCode": "DALIOIL_040",
    "city": "Strážske",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1wnS0S6G3xhLDrBsYkVZER80bYiLBKobv"
  },
  {
    "stationCode": "DALIOIL_040",
    "city": "Strážske",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1FFtetTMXK2fvOjh5cOkOu6aRD_9W3Mye"
  },
  {
    "stationCode": "DALIOIL_040",
    "city": "Strážske",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1wDr7ZbAPbq5hsqAmzFk4vhZyoIx2kMcU"
  },
  {
    "stationCode": "DALIOIL_040",
    "city": "Strážske",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1xqVtDqwmEpQX5ZIf6X46iLNPGEsAE1lt"
  },
  {
    "stationCode": "DALIOIL_040",
    "city": "Strážske",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1brKgfZpw7GLBdAdxeMPxpwovUeTQzKL9"
  },
  {
    "stationCode": "DALIOIL_040",
    "city": "Strážske",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1LpbWr_oUEaIRByYLcOCzEucYF5ZgKUin"
  },
  {
    "stationCode": "DALIOIL_040",
    "city": "Strážske",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/131euD_kwdUa0fed46VpzHW9pfoZPGEza"
  },
  {
    "stationCode": "DALIOIL_040",
    "city": "Strážske",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1p4c8QdMk9HlIQF1rHtvCQJd7al61svxb"
  },
  {
    "stationCode": "DALIOIL_040",
    "city": "Strážske",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1KysZKX-rlG4G6HZsQNEpqq0Gjq94sXqQ"
  },
  {
    "stationCode": "DALIOIL_040",
    "city": "Strážske",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1PuCwZLIyaNTyi8_YXdqp91hiu86S7s3d"
  },
  {
    "stationCode": "DALIOIL_041",
    "city": "Tisovec",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1GcRfpE1NW1DOJDnWjAkzcYAeMsrhdma9"
  },
  {
    "stationCode": "DALIOIL_041",
    "city": "Tisovec",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1lgdUA3Dk9pQ36gu7WeRmn-V29ot3zP1l"
  },
  {
    "stationCode": "DALIOIL_041",
    "city": "Tisovec",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1Tx7Bo8Spk3RCsQzMym6u-BPOMcsg6OV0"
  },
  {
    "stationCode": "DALIOIL_041",
    "city": "Tisovec",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1NSu9GqRHqJipcuqt_jwmY8WKzADMrfqd"
  },
  {
    "stationCode": "DALIOIL_041",
    "city": "Tisovec",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1qyFzDjr_aEFnaxRfXPbDJcq4N8UxHDY8"
  },
  {
    "stationCode": "DALIOIL_041",
    "city": "Tisovec",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1T40z0jROIiSFWdbIO7B-bZBY3g5I03Dr"
  },
  {
    "stationCode": "DALIOIL_041",
    "city": "Tisovec",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1bt6VXMp26uAj5ZPRo4NJcS7DdR0w7eFx"
  },
  {
    "stationCode": "DALIOIL_041",
    "city": "Tisovec",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/18ZlfL78m3zerrZZVk8HLlsGCx_rmvyQ8"
  },
  {
    "stationCode": "DALIOIL_041",
    "city": "Tisovec",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1IgXq4o0yxNePaYdz9dnngEBQUzRZbOCG"
  },
  {
    "stationCode": "DALIOIL_041",
    "city": "Tisovec",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1eShUqLoQ5qEn1W1wpi7ImV9Wm-aeStuQ"
  },
  {
    "stationCode": "DALIOIL_041",
    "city": "Tisovec",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1sGcVXhxqudPjmJ_dK9PGXgIlL11Zjnki"
  },
  {
    "stationCode": "DALIOIL_041",
    "city": "Tisovec",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1GQn3lajqo7h2Rq18R7FHAmcvqWs4xv41"
  },
  {
    "stationCode": "DALIOIL_042",
    "city": "Kokava nad Rimavicou",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1u60_pwwOZVMQJQWI5q4KnqVsFPsTypGB"
  },
  {
    "stationCode": "DALIOIL_042",
    "city": "Kokava nad Rimavicou",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1ZbpBxOd2zpzeqyTkIeVQA9CaUL-AcnmS"
  },
  {
    "stationCode": "DALIOIL_042",
    "city": "Kokava nad Rimavicou",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1z97R5eCsP_B18ZNefK8_MB9mYAF95XAl"
  },
  {
    "stationCode": "DALIOIL_042",
    "city": "Kokava nad Rimavicou",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1OK6j1BgemoQdvWO4GAHEwOsWeHNxFCPC"
  },
  {
    "stationCode": "DALIOIL_042",
    "city": "Kokava nad Rimavicou",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1uPK6K9UF7ezCxsGd_vPXYU7ivR5I9KeT"
  },
  {
    "stationCode": "DALIOIL_042",
    "city": "Kokava nad Rimavicou",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1W7lQs6HnjN7TtjWAWGhNay3Ga4jtu_qa"
  },
  {
    "stationCode": "DALIOIL_042",
    "city": "Kokava nad Rimavicou",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1uL2mjAJo4Jqvv4xxeTFJpqD9WrekZ_2Z"
  },
  {
    "stationCode": "DALIOIL_042",
    "city": "Kokava nad Rimavicou",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1JwLxtmq3iIiJbX8dnRowxHqkl3zgD5Au"
  },
  {
    "stationCode": "DALIOIL_042",
    "city": "Kokava nad Rimavicou",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/11WnUrWKQ2ijBvBl86tD05fPTtE_b_6PR"
  },
  {
    "stationCode": "DALIOIL_042",
    "city": "Kokava nad Rimavicou",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1Dtvg2TFHEfM6Cc_4eZ0IiSqtVMGhNjXk"
  },
  {
    "stationCode": "DALIOIL_042",
    "city": "Kokava nad Rimavicou",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1oL7sW3kvTmDeclPwLn3ZXnmIr-iIh9lF"
  },
  {
    "stationCode": "DALIOIL_042",
    "city": "Kokava nad Rimavicou",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1fgz7HZRtL5kYEss49h6hSg0-Z-Lt5TFu"
  },
  {
    "stationCode": "DALIOIL_043",
    "city": "Bátka",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1h93uqchKlUThsQwZRnLIQteEfBru0p0f"
  },
  {
    "stationCode": "DALIOIL_043",
    "city": "Bátka",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1FXytBJEJ0p92EzjoN4I0Yaen7fuYdqxk"
  },
  {
    "stationCode": "DALIOIL_043",
    "city": "Bátka",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1kenLfcipDfAn6BE2YrtcLgdhwnpD5BE9"
  },
  {
    "stationCode": "DALIOIL_043",
    "city": "Bátka",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1e8lTunizS8fSjl-ZmcJu-WzJfHDoDJtr"
  },
  {
    "stationCode": "DALIOIL_043",
    "city": "Bátka",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1SXRddc87cRyKgUpmEYCeyoDOlWi0atAw"
  },
  {
    "stationCode": "DALIOIL_043",
    "city": "Bátka",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/11eWXpntVy0dHo3CyMyI4LuL9qseeZsOO"
  },
  {
    "stationCode": "DALIOIL_043",
    "city": "Bátka",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1Gw_HGpX2Tz6kWyK5Trzae-B58cSaGoq1"
  },
  {
    "stationCode": "DALIOIL_043",
    "city": "Bátka",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1_rBxzmGKIPLAIcxxY9E1LC4ErkJVC6p1"
  },
  {
    "stationCode": "DALIOIL_043",
    "city": "Bátka",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1zaMncJrY7yaRDRryfM6aqwIrDsBNJAoO"
  },
  {
    "stationCode": "DALIOIL_043",
    "city": "Bátka",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1qyC9i9Ril5cupeCDRECB9CGrxO2bgbEB"
  },
  {
    "stationCode": "DALIOIL_043",
    "city": "Bátka",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1Y9r30b9DhCxD_VALKDL2JTGli6H7i6ox"
  },
  {
    "stationCode": "DALIOIL_043",
    "city": "Bátka",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1lWbiEAYpU5BWbFPco0JCYSH7j8p06FSg"
  },
  {
    "stationCode": "DALIOIL_044",
    "city": "Lučenec",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1YeK8ZdnD1zGIff2FOhgWoNnP9sCDLtx5"
  },
  {
    "stationCode": "DALIOIL_044",
    "city": "Lučenec",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1lZHj-xBEknBi-jnov4rzytVdXKk0MWis"
  },
  {
    "stationCode": "DALIOIL_044",
    "city": "Lučenec",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1y_RNzeNsK6WyrQC9nMoDnikDJsiClUKa"
  },
  {
    "stationCode": "DALIOIL_044",
    "city": "Lučenec",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1p5y_TqZxx3QZdCPHN8-tbmBhQ1wQY0zI"
  },
  {
    "stationCode": "DALIOIL_044",
    "city": "Lučenec",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1zydR5Em98hMUoZUBm9zJ0nsJChwTcBWd"
  },
  {
    "stationCode": "DALIOIL_044",
    "city": "Lučenec",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1ux7qXl4MVYyCYlQqgT7gA4aRONEtu7Mp"
  },
  {
    "stationCode": "DALIOIL_044",
    "city": "Lučenec",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/14CBl_9YIgTL3S37ykM9O2-0PNFy2K5bN"
  },
  {
    "stationCode": "DALIOIL_044",
    "city": "Lučenec",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1OyeORft1jnNUrQARBZL8_j4p3dUvyS48"
  },
  {
    "stationCode": "DALIOIL_044",
    "city": "Lučenec",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/11nfzOt3xRuXKWj6Qq7QreUySz6SqUc1R"
  },
  {
    "stationCode": "DALIOIL_044",
    "city": "Lučenec",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/11J12UHEi79mA0jVoU-6EtB7ScTtbaN53"
  },
  {
    "stationCode": "DALIOIL_044",
    "city": "Lučenec",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1F9-dqNWeU3bMk3vosJVdLhK9LGdglbpU"
  },
  {
    "stationCode": "DALIOIL_044",
    "city": "Lučenec",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1KV9Z4Czv0L1y9e2L5H_8iS2P7QJT7muB"
  },
  {
    "stationCode": "DALIOIL_045",
    "city": "Fiľakovo- Biskupická",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1sYCcJBtlOYqqUmW7H3o9Xudw2pjNr3tc"
  },
  {
    "stationCode": "DALIOIL_045",
    "city": "Fiľakovo- Biskupická",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1fUpB2R-Up2VZbjZH2eIhgIk2KKiGHZCw"
  },
  {
    "stationCode": "DALIOIL_045",
    "city": "Fiľakovo- Biskupická",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1ZrIk0LLRjQ6Ayh8uCdx5pgviNLfzx4J5"
  },
  {
    "stationCode": "DALIOIL_045",
    "city": "Fiľakovo- Biskupická",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1S3wznxV6LCak_-feH5sUDIXJbnr8cJ4D"
  },
  {
    "stationCode": "DALIOIL_045",
    "city": "Fiľakovo- Biskupická",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/10mWZAvj7w4jYDTJEqDYT-zb-uNKIZKSi"
  },
  {
    "stationCode": "DALIOIL_045",
    "city": "Fiľakovo- Biskupická",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1og5DaRlWcPz2ox6WfHlFMn9VCLIfFSNu"
  },
  {
    "stationCode": "DALIOIL_045",
    "city": "Fiľakovo- Biskupická",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1S1fHoSt6KWGsh6vInz6oYPMqoG61A1fW"
  },
  {
    "stationCode": "DALIOIL_045",
    "city": "Fiľakovo- Biskupická",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1lsdFLMuX-xxskSYD20_esb40SaDU89Zk"
  },
  {
    "stationCode": "DALIOIL_045",
    "city": "Fiľakovo- Biskupická",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/14HEwnWeV5ZxO3va72INrNAYe_o3iJJVw"
  },
  {
    "stationCode": "DALIOIL_045",
    "city": "Fiľakovo- Biskupická",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/13YnWXQ-TBwbxc6dwWEPuAdK649Rf5Uge"
  },
  {
    "stationCode": "DALIOIL_045",
    "city": "Fiľakovo- Biskupická",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1C9zV48KmlnqPOYIQjyiR2iNKSDMBe7To"
  },
  {
    "stationCode": "DALIOIL_045",
    "city": "Fiľakovo- Biskupická",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1Wm47XYvcJyRJ0OaYtDnCv6U06YjZsBVs"
  },
  {
    "stationCode": "DALIOIL_046",
    "city": "Fiľakovo- Šavoľská",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1NXIUu7CjOvEVLdkFhwtw6Wq5a8U-KJ6l"
  },
  {
    "stationCode": "DALIOIL_046",
    "city": "Fiľakovo- Šavoľská",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1mypunpKauGCTvqFJchXu0uI-XlPhS-t0"
  },
  {
    "stationCode": "DALIOIL_046",
    "city": "Fiľakovo- Šavoľská",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/17ccjUVAV_iGDltSjW__u3l0TeTh4UxLw"
  },
  {
    "stationCode": "DALIOIL_046",
    "city": "Fiľakovo- Šavoľská",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1C76QOUy5DDEP4i94B95W0grEI9sG9UdS"
  },
  {
    "stationCode": "DALIOIL_046",
    "city": "Fiľakovo- Šavoľská",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1H2EIjFCfWtKL-0_lidu6nvyaQTuBzlz9"
  },
  {
    "stationCode": "DALIOIL_046",
    "city": "Fiľakovo- Šavoľská",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1wWTWOC1lmbIrzWy17ohBV-1zu9rT_cK4"
  },
  {
    "stationCode": "DALIOIL_046",
    "city": "Fiľakovo- Šavoľská",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1r4jit6YXfXihJT_k6Fo4NbYMZc4k83YV"
  },
  {
    "stationCode": "DALIOIL_046",
    "city": "Fiľakovo- Šavoľská",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1UxiaLa1XwVvMfnxDeChJ9bcblJSvVFDf"
  },
  {
    "stationCode": "DALIOIL_046",
    "city": "Fiľakovo- Šavoľská",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1Rr6IWgbkzFQxLmo-08KUwM9RYEJAuQiz"
  },
  {
    "stationCode": "DALIOIL_046",
    "city": "Fiľakovo- Šavoľská",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1IwmFYSEyt5kWn8hrgqrJ_OE4go5D_2R9"
  },
  {
    "stationCode": "DALIOIL_046",
    "city": "Fiľakovo- Šavoľská",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/141hQwaIQ3VgPwO7cAZrB8YLuDOBERjGP"
  },
  {
    "stationCode": "DALIOIL_046",
    "city": "Fiľakovo- Šavoľská",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1qMV_jJtr3D3VA1OqSUN1U-KN-yVA-h26"
  },
  {
    "stationCode": "DALIOIL_047",
    "city": "Kráľovany",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1WdlTXkZTsz3M-nJxXOUmYyE5Rdf-sR69"
  },
  {
    "stationCode": "DALIOIL_047",
    "city": "Kráľovany",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1GmeWeJnkPI9NsYFJIzerSNdVXNTSIzNC"
  },
  {
    "stationCode": "DALIOIL_047",
    "city": "Kráľovany",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/1YANPQswJ9VqXgxp4PrLoweqxNxpXpp5n"
  },
  {
    "stationCode": "DALIOIL_047",
    "city": "Kráľovany",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1rG1bY3NYhC-KJb5I1qELk84tMKyzjQ1T"
  },
  {
    "stationCode": "DALIOIL_047",
    "city": "Kráľovany",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/15N35HoZZQdwK_MTb5OhcDRp6kGMOxwYS"
  },
  {
    "stationCode": "DALIOIL_047",
    "city": "Kráľovany",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1T9Aq9dNRUku6rg7MofT3zTSacgV10rU7"
  },
  {
    "stationCode": "DALIOIL_047",
    "city": "Kráľovany",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1fqFGfubXx8mfZgE2ScmzwNzgxRSGE2Oa"
  },
  {
    "stationCode": "DALIOIL_047",
    "city": "Kráľovany",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1Qghx5ePFFB-R_g6N-87KbkN5xZOqOoIH"
  },
  {
    "stationCode": "DALIOIL_047",
    "city": "Kráľovany",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1wVq4HOaFV2vgTMPOUjzoWIuqfJjVu6Sp"
  },
  {
    "stationCode": "DALIOIL_047",
    "city": "Kráľovany",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/1tXFa3AbA6-bYc59pA8cRT5nqG_ckGVYv"
  },
  {
    "stationCode": "DALIOIL_047",
    "city": "Kráľovany",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1e6CkHObkGNAcX2HraEgaxMwNIB_RRuSr"
  },
  {
    "stationCode": "DALIOIL_047",
    "city": "Kráľovany",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/1EqrcwqIsZAr8ETpRl7qXAm-JuOZohbYo"
  },
  {
    "stationCode": "DALIOIL_048",
    "city": "Podolínec",
    "zoneNumber": 1,
    "zoneCode": "1_Prijazdova zona od cesty",
    "zoneName": "Príjazdová zóna od cesty",
    "folderUrl": "https://drive.google.com/drive/folders/1q6xBxJYOpurmB8OXf1tazQhRiabXPybf"
  },
  {
    "stationCode": "DALIOIL_048",
    "city": "Podolínec",
    "zoneNumber": 2,
    "zoneCode": "2_Zona pri vydajnych stojanoch",
    "zoneName": "Zóna pri výdajných stojanoch",
    "folderUrl": "https://drive.google.com/drive/folders/1YMrJTzmQXk-1cPZCU7Z8WbzixGayea8w"
  },
  {
    "stationCode": "DALIOIL_048",
    "city": "Podolínec",
    "zoneNumber": 3,
    "zoneCode": "3_Vstupna zona do shopu",
    "zoneName": "Vstupná zóna do shopu",
    "folderUrl": "https://drive.google.com/drive/folders/110rBdgIAkBSDsOjH1L18tTpJGTwiEPk9"
  },
  {
    "stationCode": "DALIOIL_048",
    "city": "Podolínec",
    "zoneNumber": 4,
    "zoneCode": "4_Pokladnicna zona",
    "zoneName": "Pokladničná zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1PjB7X6LA2y8_M39Lvfr6wY3ttU_PRHZC"
  },
  {
    "stationCode": "DALIOIL_048",
    "city": "Podolínec",
    "zoneNumber": 5,
    "zoneCode": "5_Toaletna zona",
    "zoneName": "Toaletná zóna (WC)",
    "folderUrl": "https://drive.google.com/drive/folders/1cmr4Jj9_6o4mx1GVlSsuvcUqcr00hGpI"
  },
  {
    "stationCode": "DALIOIL_048",
    "city": "Podolínec",
    "zoneNumber": 6,
    "zoneCode": "6_Kaviarensky kutik",
    "zoneName": "Kaviarenský kútik (Dali Cafe)",
    "folderUrl": "https://drive.google.com/drive/folders/1kyyzGzSIKEkKVzamZV_fhr4gEm6nGDZz"
  },
  {
    "stationCode": "DALIOIL_048",
    "city": "Podolínec",
    "zoneNumber": 7,
    "zoneCode": "7_Budova",
    "zoneName": "Budova / Fasáda",
    "folderUrl": "https://drive.google.com/drive/folders/1-lx4LGWDfCRTXg_aE7GEL8CbNRtLTz2v"
  },
  {
    "stationCode": "DALIOIL_048",
    "city": "Podolínec",
    "zoneNumber": 8,
    "zoneCode": "8_Parkovisko a ostatny priestor",
    "zoneName": "Parkovisko a ostatný priestor",
    "folderUrl": "https://drive.google.com/drive/folders/1RwVe0JF86xWUldB-YYvTz2hCnTqtUz5t"
  },
  {
    "stationCode": "DALIOIL_048",
    "city": "Podolínec",
    "zoneNumber": 9,
    "zoneCode": "9_Odjazdova zona",
    "zoneName": "Odjazdová zóna",
    "folderUrl": "https://drive.google.com/drive/folders/1Ylz5OEsx6oYqsA9TjEzJusNoKS0VgBxq"
  },
  {
    "stationCode": "DALIOIL_048",
    "city": "Podolínec",
    "zoneNumber": 10,
    "zoneCode": "10_Autoumyvaren",
    "zoneName": "Autoumyváreň",
    "folderUrl": "https://drive.google.com/drive/folders/11Lr4sQoJLKwcjZwWT0Xl-MT282BZ2wR5"
  },
  {
    "stationCode": "DALIOIL_048",
    "city": "Podolínec",
    "zoneNumber": 11,
    "zoneCode": "11_Vonkajsia terasa",
    "zoneName": "Vonkajšia terasa",
    "folderUrl": "https://drive.google.com/drive/folders/1nA5AP18GINraNKuA7UgMacnp2cPZOnXd"
  },
  {
    "stationCode": "DALIOIL_048",
    "city": "Podolínec",
    "zoneNumber": 12,
    "zoneCode": "12_Ostatne",
    "zoneName": "Ostatné priestory",
    "folderUrl": "https://drive.google.com/drive/folders/15_jnxLkhZSg_fAkE6EuGnnytHCCN4lMs"
  }
];

// Rýchla indexová mapa podľa stationCode -> zoznam priečinkov zón a priamy index podľa zóny
export const STATION_ZONE_FOLDERS_MAP: Record<string, StationZoneFolder[]> = {};
export const STATION_ZONE_INDEX: Record<string, Record<number, StationZoneFolder>> = {};

for (const item of STATION_ZONE_FOLDERS) {
  if (!item.stationCode || item.zoneNumber === 0) continue;
  if (!STATION_ZONE_FOLDERS_MAP[item.stationCode]) {
    STATION_ZONE_FOLDERS_MAP[item.stationCode] = [];
    STATION_ZONE_INDEX[item.stationCode] = {};
  }
  const existingIdx = STATION_ZONE_FOLDERS_MAP[item.stationCode].findIndex(
    (existing) => existing.zoneNumber === item.zoneNumber
  );
  if (existingIdx === -1) {
    STATION_ZONE_FOLDERS_MAP[item.stationCode].push(item);
    STATION_ZONE_INDEX[item.stationCode][item.zoneNumber] = item;
  } else if (!STATION_ZONE_FOLDERS_MAP[item.stationCode][existingIdx].folderUrl && item.folderUrl) {
    STATION_ZONE_FOLDERS_MAP[item.stationCode][existingIdx] = item;
    STATION_ZONE_INDEX[item.stationCode][item.zoneNumber] = item;
  }
}

/**
 * Získa všetky priečinky fotiek zón pre danú stanicu
 */
export function getStationZoneFolders(stationCode: string): StationZoneFolder[] {
  return STATION_ZONE_FOLDERS_MAP[stationCode] || [];
}

/**
 * Získa Google Drive odkaz na konkrétnu zónu (1-12) danej stanice (O(1))
 */
export function getZoneFolderUrl(stationCode: string, zoneNumber: number): string | undefined {
  return STATION_ZONE_INDEX[stationCode]?.[zoneNumber]?.folderUrl;
}

/**
 * Extrahuje Google Drive folder ID z URL odkazu
 */
export function getFolderIdFromUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : undefined;
}

/**
 * Vygeneruje oficiálnu Google Drive iframe embed URL pre priame zobrazenie fotiek v aplikácii
 */
export function getEmbeddedFolderViewUrl(
  url?: string,
  mode: 'grid' | 'list' = 'grid'
): string | undefined {
  const folderId = getFolderIdFromUrl(url);
  if (!folderId) return undefined;
  return `https://drive.google.com/embeddedfolderview?id=${folderId}#${mode}`;
}

/**
 * Získa konkrétny StationZoneFolder objekt pre danú zónu (1-12) (O(1))
 */
export function getStationZoneFolder(
  stationCode: string,
  zoneNumber: number
): StationZoneFolder | undefined {
  return STATION_ZONE_INDEX[stationCode]?.[zoneNumber];
}

/**
 * Štandardné názvy 12 zón podľa nového PDF archívu 2026
 */
export const OFFICIAL_ZONE_NAMES: Record<number, string> = {
  1: "Príjazdová zóna od cesty (Pylón / Totem)",
  2: "Zóna pri výdajných stojanoch",
  3: "Vstupná zóna do shopu (Vstupné dvere & Výklad)",
  4: "Pokladničná zóna (Shop & Pokladne)",
  5: "Toaletná zóna (WC priestory)",
  6: "Kaviarenský kútik (Dali Cafe / Gastro)",
  7: "Budova / Fasáda a atika",
  8: "Parkovisko a ostatný priestor",
  9: "Odjazdová zóna",
  10: "Autoumyváreň (Portál & VAP boxy)",
  11: "Vonkajšia terasa (Bannery na terase)",
  12: "Ostatné priestory",
};

/**
 * Namapuje reklamný nosič na kompletný StationZoneFolder objekt z nového PDF archívu 12 zón
 */
export function getDriveFolderForAd(
  stationCode: string,
  zone?: string | number,
  adCategory?: string
): StationZoneFolder | undefined {
  if (!stationCode) return undefined;
  let zoneNum = 2; // Predvolená: Zóna 2 (výdajné stojany)

  if (typeof zone === 'number' && zone >= 1 && zone <= 12) {
    zoneNum = zone;
  } else if (typeof zone === 'string') {
    const match = zone.match(/\d+/);
    if (match) {
      const parsed = parseInt(match[0], 10);
      if (parsed >= 1 && parsed <= 12) zoneNum = parsed;
    } else if (zone.includes('vchod') || zone.includes('vstup') || adCategory === 'Vstup') {
      zoneNum = 3;
    } else if (zone.includes('terasa')) {
      zoneNum = 11;
    } else if (zone.includes('wc') || zone.includes('toalet') || adCategory === 'Sociálne zariadenia') {
      zoneNum = 5;
    } else if (zone.includes('umyvaren') || zone.includes('umyvark') || adCategory === 'Umyváreň') {
      zoneNum = 10;
    } else if (zone.includes('prijazd') || zone.includes('totem') || zone.includes('pylon')) {
      zoneNum = 1;
    } else if (zone.includes('stojan')) {
      zoneNum = 2;
    } else if (zone.includes('pokladn') || zone.includes('kasa') || adCategory === 'Interiér') {
      zoneNum = 4;
    } else if (zone.includes('cafe') || zone.includes('kaviaren') || zone.includes('gastro')) {
      zoneNum = 6;
    } else if (zone.includes('budov') || zone.includes('fasad')) {
      zoneNum = 7;
    } else if (zone.includes('parkovisk')) {
      zoneNum = 8;
    } else if (zone.includes('odjazd')) {
      zoneNum = 9;
    } else if (zone.includes('ostatn')) {
      zoneNum = 12;
    }
  }

  const found = getStationZoneFolder(stationCode, zoneNum);
  if (found && found.folderUrl) return found;
  // Fallback: nájdi prvú dostupnú zložku stanice s URL
  const allFolders = STATION_ZONE_FOLDERS_MAP[stationCode] || [];
  return allFolders.find((f) => f.folderUrl);
}

/**
 * Namapuje reklamnú plochu na priamy Google Drive priečinok zóny (1-12)
 */
export function getDriveFolderForAdZone(
  stationCode: string,
  zone?: string | number,
  adCategory?: string
): string | undefined {
  const folder = getDriveFolderForAd(stationCode, zone, adCategory);
  return folder?.folderUrl;
}


