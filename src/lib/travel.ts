// Travel helpers: the film shape the pages read, the world atlas, and
// matching a film to the countries its words mention.

export interface Film {
  id: string;
  title: string;
  description?: string | null;
  summary?: string | null;
  tags?: string[];
  poster: string | null;
  duration_ms: number | null;
  width?: number | null;
  height?: number | null;
  quality?: string | null;
  views?: number;
  state?: string;
  published_at?: string | null;
  created_at?: string | null;
}

export function isUpright(f: Film): boolean {
  return !!f.width && !!f.height && f.height > f.width;
}

export function aspectOf(f: Film): string {
  if (f.width && f.height) return `${f.width} / ${f.height}`;
  return "16 / 9";
}

export function plays(n: number | undefined): string {
  const v = n ?? 0;
  return `${v.toLocaleString()} ${v === 1 ? "play" : "plays"}`;
}

export function filmsLabel(n: number): string {
  return `${n} ${n === 1 ? "film" : "films"}`;
}

export function indexLabel(i: number): string {
  return `N° ${String(i + 1).padStart(2, "0")}`;
}

export interface Region {
  id: string;
  name: string;
  countries: string[];
}

const list = (s: string) => s.split("|");

export const REGIONS: Region[] = [
  {
    id: "africa",
    name: "Africa",
    countries: list(
      "Algeria|Angola|Benin|Botswana|Burkina Faso|Burundi|Cabo Verde|Cameroon|Central African Republic|Chad|Comoros|Congo|DR Congo|Djibouti|Egypt|Equatorial Guinea|Eritrea|Eswatini|Ethiopia|Gabon|Gambia|Ghana|Guinea|Guinea-Bissau|Ivory Coast|Kenya|Lesotho|Liberia|Libya|Madagascar|Malawi|Mali|Mauritania|Mauritius|Morocco|Mozambique|Namibia|Niger|Nigeria|Rwanda|São Tomé and Príncipe|Senegal|Seychelles|Sierra Leone|Somalia|South Africa|South Sudan|Sudan|Tanzania|Togo|Tunisia|Uganda|Zambia|Zimbabwe"
    ),
  },
  {
    id: "americas",
    name: "The Americas",
    countries: list(
      "Antigua and Barbuda|Argentina|Bahamas|Barbados|Belize|Bolivia|Brazil|Canada|Chile|Colombia|Costa Rica|Cuba|Dominica|Dominican Republic|Ecuador|El Salvador|Grenada|Guatemala|Guyana|Haiti|Honduras|Jamaica|Mexico|Nicaragua|Panama|Paraguay|Peru|Saint Kitts and Nevis|Saint Lucia|Saint Vincent and the Grenadines|Suriname|Trinidad and Tobago|United States|Uruguay|Venezuela"
    ),
  },
  {
    id: "asia",
    name: "Asia",
    countries: list(
      "Afghanistan|Armenia|Azerbaijan|Bahrain|Bangladesh|Bhutan|Brunei|Cambodia|China|Georgia|India|Indonesia|Iran|Iraq|Israel|Japan|Jordan|Kazakhstan|Kuwait|Kyrgyzstan|Laos|Lebanon|Malaysia|Maldives|Mongolia|Myanmar|Nepal|North Korea|Oman|Pakistan|Palestine|Philippines|Qatar|Saudi Arabia|Singapore|South Korea|Sri Lanka|Syria|Taiwan|Tajikistan|Thailand|Timor-Leste|Turkey|Turkmenistan|United Arab Emirates|Uzbekistan|Vietnam|Yemen"
    ),
  },
  {
    id: "europe",
    name: "Europe",
    countries: list(
      "Albania|Andorra|Austria|Belarus|Belgium|Bosnia and Herzegovina|Bulgaria|Croatia|Cyprus|Czechia|Denmark|Estonia|Finland|France|Germany|Greece|Hungary|Iceland|Ireland|Italy|Kosovo|Latvia|Liechtenstein|Lithuania|Luxembourg|Malta|Moldova|Monaco|Montenegro|Netherlands|North Macedonia|Norway|Poland|Portugal|Romania|Russia|San Marino|Serbia|Slovakia|Slovenia|Spain|Sweden|Switzerland|Ukraine|United Kingdom|Vatican City"
    ),
  },
  {
    id: "oceania",
    name: "Oceania",
    countries: list(
      "Australia|Fiji|Kiribati|Marshall Islands|Micronesia|Nauru|New Zealand|Palau|Papua New Guinea|Samoa|Solomon Islands|Tonga|Tuvalu|Vanuatu"
    ),
  },
  {
    id: "poles",
    name: "Poles & Open Sea",
    countries: list("Antarctica|Arctic|Greenland|Svalbard|Atlantic Ocean|Pacific Ocean|Indian Ocean"),
  },
];

const ALIASES: Record<string, string[]> = {
  "United States": ["usa", "u.s.a.", "united states of america"],
  "United Kingdom": ["uk", "england", "scotland", "wales", "britain", "great britain"],
  Czechia: ["czech republic"],
  "Ivory Coast": ["côte d'ivoire", "cote d'ivoire"],
  Myanmar: ["burma"],
  Turkey: ["türkiye", "turkiye"],
  "DR Congo": ["democratic republic of the congo", "drc"],
  Eswatini: ["swaziland"],
  Netherlands: ["holland"],
  "Cabo Verde": ["cape verde"],
  "Timor-Leste": ["east timor"],
  Antarctica: ["antarctic"],
};

// Longest names first so "Papua New Guinea" claims its words before "Guinea".
const MATCHERS: { country: string; term: string }[] = REGIONS.flatMap((r) =>
  r.countries.flatMap((c) => [c, ...(ALIASES[c] || [])].map((term) => ({ country: c, term: term.toLowerCase() })))
).sort((a, b) => b.term.length - a.term.length);

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function countriesOf(f: Film): string[] {
  let text = " " + [f.title, f.description, f.summary, ...(f.tags || [])].filter(Boolean).join(" · ").toLowerCase() + " ";
  const found: string[] = [];
  for (const m of MATCHERS) {
    const re = new RegExp(`(^|[^a-z\u00c0-\u024f])${esc(m.term)}(?=[^a-z\u00c0-\u024f]|$)`, "g");
    if (re.test(text)) {
      if (!found.includes(m.country)) found.push(m.country);
      text = text.replace(re, "$1 ");
    }
  }
  return found;
}

export function regionOf(country: string): Region | undefined {
  return REGIONS.find((r) => r.countries.includes(country));
}

export function placeLabel(f: Film): string {
  const c = countriesOf(f);
  return c.length ? c[0] : "Place to come";
}

/** country → films that mention it */
export function atlasOf(films: Film[]): Map<string, Film[]> {
  const map = new Map<string, Film[]>();
  for (const f of films) {
    for (const c of countriesOf(f)) {
      const arr = map.get(c) || [];
      arr.push(f);
      map.set(c, arr);
    }
  }
  return map;
}
