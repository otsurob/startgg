#!/usr/bin/env node
// Fetch tournament pools via start.gg GraphQL and write to src/poolDatas/<tournament>.json
// - Arg1: tournament slug (e.g., "12-kagaribi-12")
// - Uses event slug "singles"
// - Aggregates players from JSON files in src/players/*.json

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENDPOINT_URL = 'https://api.start.gg/gql/alpha';

function loadEnvToken() {
  // Priority: process.env, else try reading from project .env (VITE_ID_TOKEN=...)
  if (process.env.VITE_ID_TOKEN) return process.env.VITE_ID_TOKEN;
  try {
    const rootDir = path.resolve(__dirname, '..', '..');
    const envPath = path.join(rootDir, '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split(/\r?\n/)) {
        const m = line.match(/^\s*VITE_ID_TOKEN\s*=\s*(.+)\s*$/);
        if (m) {
          let val = m[1].trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          return val;
        }
      }
    }
  } catch {}
  return undefined;
}

function unique(arr) {
  return Array.from(new Set(arr));
}

function loadPlayerGroups() {
  // Return map of groupName -> names[] from src/players/*.json
  const playersDir = path.resolve(__dirname, '..', 'players');
  const groups = {};
  if (fs.existsSync(playersDir)) {
    const files = fs.readdirSync(playersDir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      try {
        const raw = fs.readFileSync(path.join(playersDir, f), 'utf8');
        const json = JSON.parse(raw);
        if (Array.isArray(json?.names)) {
          const key = path.basename(f, '.json');
          groups[key] = unique(json.names);
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }
  return groups;
}

function setPools(poolResponses) {
  // Port of src/features/logic.ts to aggregate pools
  const letterMap = new Map();
  for (const { pool, gamerTag } of poolResponses) {
    const letter = pool[0];
    if (!letterMap.has(letter)) {
      letterMap.set(letter, { letter, poolNums: [] });
    }
    const block = letterMap.get(letter);
    let poolObj = block.poolNums.find(p => p.poolNum === pool);
    if (!poolObj) {
      poolObj = { poolNum: pool, players: [] };
      block.poolNums.push(poolObj);
    }
    if (!poolObj.players.includes(gamerTag)) {
      poolObj.players.push(gamerTag);
    }
  }
  return Array.from(letterMap.values())
    .map(b => ({
      ...b,
      poolNums: b.poolNums.sort((a, b) => {
        const [aWave, aPool] = [a.poolNum[0], parseInt(a.poolNum.slice(1), 10)];
        const [bWave, bPool] = [b.poolNum[0], parseInt(b.poolNum.slice(1), 10)];
        if (aWave < bWave) return -1;
        if (aWave > bWave) return 1;
        return aPool - bPool;
      }),
    }))
    .sort((a, b) => a.letter.localeCompare(b.letter));
}

async function queryGQL3Like(gamerTags, tournamentSlug, eventSlug, token) {
  // 1) get event id
  let query = `
    query GetEventId($tSlug:String!, $eSlug:String!){
      tournament(slug:$tSlug){ events( filter: {slug:$eSlug} ){ id } }
    }
  `;
  const subResponse = await fetch(ENDPOINT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query, variables: { tSlug: tournamentSlug, eSlug: eventSlug } }),
  });
  const subData = await subResponse.json();
  const eventId = subData?.data?.tournament?.events?.[0]?.id;
  if (!eventId) throw new Error('Event ID not found. Check tournament slug and event slug.');

  // 2) per-player pools
  query = `
    query PlayerPools(
      $tournamentSlug: String!,
      $eventId: ID!,
      $gamerTag: String!,
    ) {
      tournament(slug: $tournamentSlug) {
        participants(query: { filter: {gamerTag: $gamerTag, eventIds:[$eventId]} }) {
          nodes{
            gamerTag
            entrants{
              event{ id }
              seeds{
                phaseGroup{
                  displayIdentifier
                  phase{name}
                  wave{identifier}
                }
              }
            }
          }
        }
      }
    }
  `;

  /** @type {{pool: string, gamerTag: string}[]} */
  const res = [];
  for (const gamerTag of gamerTags) {
    const response = await fetch(ENDPOINT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query, variables: { tournamentSlug, eventId, gamerTag } }),
    });
    const data = await response.json();
    const nodes = data?.data?.tournament?.participants?.nodes ?? [];
    if (nodes.length === 0 || nodes[0]?.gamerTag !== gamerTag) {
      res.push({ pool: 'Z000', gamerTag });
      continue;
    }
    const seedsFromApi = nodes[0]?.entrants?.[0]?.seeds ?? [];
    const gamerTagFromApi = nodes[0]?.gamerTag ?? gamerTag;
    let poolFromApi = seedsFromApi?.[seedsFromApi.length - 1]?.phaseGroup?.displayIdentifier ?? 'Z000';
    if (/^[a-z0-9]/.test(poolFromApi)) poolFromApi = 'P' + poolFromApi; // leading digit => prefix with "P"
    res.push({ pool: poolFromApi, gamerTag: gamerTagFromApi });
  }

  return setPools(res);
}

async function main() {
  const [tournamentSlug] = process.argv.slice(2);
  if (!tournamentSlug) {
    console.error('Usage: npm run fetch:pools -- <tournament-slug>');
    process.exit(1);
  }
  const eventSlug = 'singles';

  const token = loadEnvToken();
  if (!token) {
    console.error('Error: VITE_ID_TOKEN not found in environment or .env');
    process.exit(1);
  }

  if (typeof fetch !== 'function') {
    console.error('Error: global fetch not available. Use Node 18+ or provide a fetch polyfill.');
    process.exit(1);
  }

  const groups = loadPlayerGroups();
  const groupKeys = Object.keys(groups);
  if (groupKeys.length === 0) {
    console.error('No player groups found under src/players/*.json (names array).');
    process.exit(1);
  }
  console.log(`Fetching pools for ${tournamentSlug} (${eventSlug}) for groups: ${groupKeys.join(', ')}`);
  const resultByGroup = {};
  for (const key of groupKeys) {
    const names = groups[key];
    console.log(`- Group ${key}: ${names.length} players`);
    resultByGroup[key] = await queryGQL3Like(names, tournamentSlug, eventSlug, token);
  }

  const outDir = path.resolve(__dirname, '..', 'poolDatas');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${tournamentSlug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(resultByGroup, null, 2), 'utf8');
  console.log(`Wrote: ${path.relative(path.resolve(__dirname, '..', '..'), outPath)}`);
}

main().catch(err => {
  console.error(err?.stack || String(err));
  process.exit(1);
});
