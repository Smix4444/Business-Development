import { Internship } from '../app/context/application-context';

const STOP_WORDS = new Set([
  'the','and','for','are','but','not','you','all','any','can','her','was','one','our',
  'out','had','him','his','how','its','may','new','now','old','see','two','who','did',
  'get','has','let','men','put','say','she','too','use','with','that','this','have',
  'from','they','will','been','more','also','some','than','then','when','your','into',
  'very','well','just','over','such','even','most','able','here','only','what','want',
  'work','like','need','both','each','much','same','come','long','part','made','good',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  const intersection = new Set([...a].filter(x => b.has(x)));
  const union = new Set([...a, ...b]);
  return intersection.size / union.size;
}

/**
 * Computes an AI-style match score between a candidate profile and an internship.
 * Returns a value between 0 and 100. Returns null if no profile text to analyse.
 */
export function computeMatchScore(
  bio: string | null | undefined,
  cvFile: string | null | undefined,
  internship: Internship,
): number | null {
  const bioText = (bio || '').trim();
  const cvText  = (cvFile || '').replace(/[-_.]/g, ' ').trim();

  // Not enough signal — prompt user to fill profile
  if (bioText.length < 10 && cvText.length < 4) return null;

  const candidateTokens = new Set(tokenize(`${bioText} ${cvText}`));

  // ── 1. Requirements match  (weight 55%) ──────────────────────────
  const requirements = internship.requirements ?? [];
  let reqMatchCount = 0;
  const matchedReqs: string[] = [];

  for (const req of requirements) {
    const reqTokens = tokenize(req);
    const reqSet = new Set(reqTokens);
    // Direct match OR partial substring match
    const directHit = reqTokens.some(rt => candidateTokens.has(rt));
    const substringHit = reqTokens.some(rt =>
      [...candidateTokens].some(ct => ct.includes(rt) || rt.includes(ct))
    );
    if (directHit || substringHit) {
      reqMatchCount++;
      matchedReqs.push(req);
    }
  }

  const reqRatio   = requirements.length > 0 ? reqMatchCount / requirements.length : 0;
  const reqScore   = reqRatio * 55;

  // ── 2. Description semantic overlap  (weight 30%) ────────────────
  const descTokens = new Set(tokenize(internship.description ?? ''));
  const descScore  = jaccard(candidateTokens, descTokens) * 300; // scale up then clamp

  // ── 3. Role title match  (weight 15%) ────────────────────────────
  const roleTokens = new Set(tokenize(internship.role ?? ''));
  const roleScore  = jaccard(candidateTokens, roleTokens) * 150;

  // ── Combine ───────────────────────────────────────────────────────
  let raw = reqScore + Math.min(30, descScore) + Math.min(15, roleScore);

  // Deterministic salt per (internship.id) so the score is stable across renders
  // but slightly varies between different listings (realistic feel)
  const salt = ((internship.id * 17) % 7) - 3; // -3 to +3
  raw += salt;

  // A profile with no matching skills shouldn't show 0% — floor at 18
  // A profile perfectly matching everything is capped at 97
  return Math.round(Math.max(18, Math.min(97, raw)));
}

/** Human-readable label + colour for a score */
export function scoreLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: 'Excellent fit',   color: '#22C55E', bg: 'rgba(34,197,94,0.12)'   };
  if (score >= 60) return { label: 'Good match',      color: '#84CC16', bg: 'rgba(132,204,22,0.12)'  };
  if (score >= 40) return { label: 'Partial match',   color: '#F59E0B', bg: 'rgba(245,158,11,0.12)'  };
  return               { label: 'Low overlap',        color: '#EF4444', bg: 'rgba(239,68,68,0.12)'   };
}
