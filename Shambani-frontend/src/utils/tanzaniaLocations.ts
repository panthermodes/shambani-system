// Tanzania Location Data - Regions, Districts, and Wards

export interface Ward {
  name: string;
  nameSwahili: string;
}

export interface District {
  name: string;
  nameSwahili: string;
  wards: Ward[];
}

export interface Region {
  name: string;
  nameSwahili: string;
  districts: District[];
}

export const tanzaniaLocations: Region[] = [
  {
    name: "Dar es Salaam",
    nameSwahili: "Dar es Salaam",
    districts: [
      {
        name: "Ilala",
        nameSwahili: "Ilala",
        wards: [
          { name: "Buguruni", nameSwahili: "Buguruni" },
          { name: "Chanika", nameSwahili: "Chanika" },
          { name: "Gerezani", nameSwahili: "Gerezani" },
          { name: "Ilala", nameSwahili: "Ilala" },
          { name: "Jangwani", nameSwahili: "Jangwani" },
          { name: "Kariakoo", nameSwahili: "Kariakoo" },
          { name: "Kipawa", nameSwahili: "Kipawa" },
          { name: "Kisutu", nameSwahili: "Kisutu" },
          { name: "Mchikichini", nameSwahili: "Mchikichini" },
          { name: "Upanga East", nameSwahili: "Upanga Mashariki" },
          { name: "Upanga West", nameSwahili: "Upanga Magharibi" },
        ]
      },
      {
        name: "Kinondoni",
        nameSwahili: "Kinondoni",
        wards: [
          { name: "Hananasif", nameSwahili: "Hananasif" },
          { name: "Kijitonyama", nameSwahili: "Kijitonyama" },
          { name: "Kinondoni", nameSwahili: "Kinondoni" },
          { name: "Magomeni", nameSwahili: "Magomeni" },
          { name: "Manzese", nameSwahili: "Manzese" },
          { name: "Mwananyamala", nameSwahili: "Mwananyamala" },
          { name: "Sinza", nameSwahili: "Sinza" },
          { name: "Tandale", nameSwahili: "Tandale" },
          { name: "Ubungo", nameSwahili: "Ubungo" },
        ]
      },
      {
        name: "Temeke",
        nameSwahili: "Temeke",
        wards: [
          { name: "Chang'ombe", nameSwahili: "Chang'ombe" },
          { name: "Keko", nameSwahili: "Keko" },
          { name: "Kurasini", nameSwahili: "Kurasini" },
          { name: "Mbagala", nameSwahili: "Mbagala" },
          { name: "Mtoni", nameSwahili: "Mtoni" },
          { name: "Sandali", nameSwahili: "Sandali" },
          { name: "Temeke", nameSwahili: "Temeke" },
        ]
      },
      {
        name: "Kigamboni",
        nameSwahili: "Kigamboni",
        wards: [
          { name: "Kigamboni", nameSwahili: "Kigamboni" },
          { name: "Kibada", nameSwahili: "Kibada" },
          { name: "Somangira", nameSwahili: "Somangira" },
          { name: "Vijibweni", nameSwahili: "Vijibweni" },
        ]
      },
      {
        name: "Ubungo",
        nameSwahili: "Ubungo",
        wards: [
          { name: "Goba", nameSwahili: "Goba" },
          { name: "Makuburi", nameSwahili: "Makuburi" },
          { name: "Mburahati", nameSwahili: "Mburahati" },
          { name: "Ubungo", nameSwahili: "Ubungo" },
        ]
      }
    ]
  },
  {
    name: "Mwanza",
    nameSwahili: "Mwanza",
    districts: [
      {
        name: "Ilemela",
        nameSwahili: "Ilemela",
        wards: [
          { name: "Bugogwa", nameSwahili: "Bugogwa" },
          { name: "Buhongwa", nameSwahili: "Buhongwa" },
          { name: "Ibanda", nameSwahili: "Ibanda" },
          { name: "Ilemela", nameSwahili: "Ilemela" },
          { name: "Nyamanoro", nameSwahili: "Nyamanoro" },
          { name: "Pasiansi", nameSwahili: "Pasiansi" },
        ]
      },
      {
        name: "Nyamagana",
        nameSwahili: "Nyamagana",
        wards: [
          { name: "Buhongwa", nameSwahili: "Buhongwa" },
          { name: "Igoma", nameSwahili: "Igoma" },
          { name: "Mahina", nameSwahili: "Mahina" },
          { name: "Mkolani", nameSwahili: "Mkolani" },
          { name: "Nyamagana", nameSwahili: "Nyamagana" },
          { name: "Pamba", nameSwahili: "Pamba" },
        ]
      }
    ]
  },
  {
    name: "Arusha",
    nameSwahili: "Arusha",
    districts: [
      {
        name: "Arusha City",
        nameSwahili: "Jiji la Arusha",
        wards: [
          { name: "Elerai", nameSwahili: "Elerai" },
          { name: "Kati", nameSwahili: "Kati" },
          { name: "Lemara", nameSwahili: "Lemara" },
          { name: "Levolosi", nameSwahili: "Levolosi" },
          { name: "Ngarenaro", nameSwahili: "Ngarenaro" },
          { name: "Sekei", nameSwahili: "Sekei" },
          { name: "Sokon I", nameSwahili: "Sokon I" },
          { name: "Sokon II", nameSwahili: "Sokon II" },
          { name: "Terrat", nameSwahili: "Terrat" },
          { name: "Themi", nameSwahili: "Themi" },
          { name: "Unga L.T.D", nameSwahili: "Unga L.T.D" },
        ]
      },
      {
        name: "Meru",
        nameSwahili: "Meru",
        wards: [
          { name: "Kikwe", nameSwahili: "Kikwe" },
          { name: "King'ori", nameSwahili: "King'ori" },
          { name: "Leguruki", nameSwahili: "Leguruki" },
          { name: "Maji ya Chai", nameSwahili: "Maji ya Chai" },
          { name: "Poli", nameSwahili: "Poli" },
        ]
      }
    ]
  },
  {
    name: "Mbeya",
    nameSwahili: "Mbeya",
    districts: [
      {
        name: "Mbeya City",
        nameSwahili: "Jiji la Mbeya",
        wards: [
          { name: "Ghana", nameSwahili: "Ghana" },
          { name: "Ilemi", nameSwahili: "Ilemi" },
          { name: "Itende", nameSwahili: "Itende" },
          { name: "Iyela", nameSwahili: "Iyela" },
          { name: "Mabatini", nameSwahili: "Mabatini" },
          { name: "Mwanjelwa", nameSwahili: "Mwanjelwa" },
          { name: "Nsalaga", nameSwahili: "Nsalaga" },
        ]
      }
    ]
  },
  {
    name: "Dodoma",
    nameSwahili: "Dodoma",
    districts: [
      {
        name: "Dodoma City",
        nameSwahili: "Jiji la Dodoma",
        wards: [
          { name: "Chang'ombe", nameSwahili: "Chang'ombe" },
          { name: "Chamwino", nameSwahili: "Chamwino" },
          { name: "Hazina", nameSwahili: "Hazina" },
          { name: "Hombolo", nameSwahili: "Hombolo" },
          { name: "Kikuyu", nameSwahili: "Kikuyu" },
          { name: "Kizota", nameSwahili: "Kizota" },
          { name: "Makole", nameSwahili: "Makole" },
          { name: "Miyuji", nameSwahili: "Miyuji" },
          { name: "Zuzu", nameSwahili: "Zuzu" },
        ]
      }
    ]
  },
  {
    name: "Morogoro",
    nameSwahili: "Morogoro",
    districts: [
      {
        name: "Morogoro Municipal",
        nameSwahili: "Manispaa ya Morogoro",
        wards: [
          { name: "Bigwa", nameSwahili: "Bigwa" },
          { name: "Kihonda", nameSwahili: "Kihonda" },
          { name: "Kilakala", nameSwahili: "Kilakala" },
          { name: "Kingo", nameSwahili: "Kingo" },
          { name: "Mafiga", nameSwahili: "Mafiga" },
          { name: "Mazimbu", nameSwahili: "Mazimbu" },
          { name: "Mzinga", nameSwahili: "Mzinga" },
        ]
      }
    ]
  },
  {
    name: "Tanga",
    nameSwahili: "Tanga",
    districts: [
      {
        name: "Tanga City",
        nameSwahili: "Jiji la Tanga",
        wards: [
          { name: "Central", nameSwahili: "Kati" },
          { name: "Chumbageni", nameSwahili: "Chumbageni" },
          { name: "Makorora", nameSwahili: "Makorora" },
          { name: "Ngamiani Kaskazini", nameSwahili: "Ngamiani Kaskazini" },
          { name: "Ngamiani Kusini", nameSwahili: "Ngamiani Kusini" },
          { name: "Tongoni", nameSwahili: "Tongoni" },
        ]
      }
    ]
  },
  {
    name: "Mtwara",
    nameSwahili: "Mtwara",
    districts: [
      {
        name: "Mtwara Municipal",
        nameSwahili: "Manispaa ya Mtwara",
        wards: [
          { name: "Chuno", nameSwahili: "Chuno" },
          { name: "Jangwani", nameSwahili: "Jangwani" },
          { name: "Ligula", nameSwahili: "Ligula" },
          { name: "Majengo", nameSwahili: "Majengo" },
          { name: "Mtwara Mjini", nameSwahili: "Mtwara Mjini" },
        ]
      }
    ]
  }
];

// Helper functions
export function getRegionByName(name: string): Region | undefined {
  return tanzaniaLocations.find(r => r.name === name);
}

export function getDistrictsByRegion(regionName: string): District[] {
  const region = getRegionByName(regionName);
  return region ? region.districts : [];
}

export function getWardsByDistrict(regionName: string, districtName: string): Ward[] {
  const region = getRegionByName(regionName);
  if (!region) return [];
  
  const district = region.districts.find(d => d.name === districtName);
  return district ? district.wards : [];
}
