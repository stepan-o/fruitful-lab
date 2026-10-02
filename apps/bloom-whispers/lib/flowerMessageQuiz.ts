import {
  answers,
  emailCaptureCopy,
  implementationNotes,
  intentTags,
  powerDuos,
  questions,
  quizConfig,
  results,
  safetyNotes,
  scoring,
  sourceNotes,
} from "../../../docs/brands/bloom-whispers/quiz-implementation-data-2026-05-23";

export {
  answers,
  emailCaptureCopy,
  implementationNotes,
  intentTags,
  powerDuos,
  questions,
  quizConfig,
  results,
  safetyNotes,
  sourceNotes,
};

export type AnswerId = keyof typeof answers;
export type ResultId = keyof typeof results;
export type IntentTagId = keyof typeof intentTags;
export type SegmentId =
  | "restoration"
  | "renewal"
  | "protection"
  | "expression"
  | "creativity"
  | "devotion"
  | "resilience";

type ScoreMap<T extends string> = Record<T, number>;

type RankedScore<T extends string> = {
  id: T;
  score: number;
};

type SingleOutcome = {
  kind: "single";
  resultId: ResultId;
  flowerName: string;
  messageTitle: string;
  previewTeaser: string;
};

type PowerDuoOutcome = {
  kind: "power_duo";
  duoId: (typeof powerDuos)[number]["id"];
  resultIds: readonly [ResultId, ResultId];
  flowerName: string;
  messageTitle: string;
  previewTeaser: string;
};

export type QuizOutcome = SingleOutcome | PowerDuoOutcome;

export type QuizScoreSummary = {
  selectedAnswerIds: AnswerId[];
  resultScores: ScoreMap<ResultId>;
  segmentScores: ScoreMap<SegmentId>;
  intentScores: ScoreMap<IntentTagId>;
  topResults: RankedScore<ResultId>[];
  topSegments: RankedScore<SegmentId>[];
  topIntentTags: RankedScore<IntentTagId>[];
  outcome: QuizOutcome;
};

const segmentIds = [
  "restoration",
  "renewal",
  "protection",
  "expression",
  "creativity",
  "devotion",
  "resilience",
] satisfies SegmentId[];

const resultIds = quizConfig.resultIds as readonly ResultId[];
const intentTagIds = Object.keys(intentTags) as IntentTagId[];

function createEmptyScores<T extends string>(ids: readonly T[]): ScoreMap<T> {
  return Object.fromEntries(ids.map((id) => [id, 0])) as ScoreMap<T>;
}

function addScores<T extends string>(target: ScoreMap<T>, next?: Partial<Record<T, number>>) {
  if (!next) {
    return;
  }

  for (const [id, score] of Object.entries(next) as [T, number][]) {
    target[id] = (target[id] ?? 0) + score;
  }
}

function rankScores<T extends string>(scores: ScoreMap<T>, order: readonly T[]): RankedScore<T>[] {
  const orderIndex = new Map(order.map((id, index) => [id, index]));

  return Object.entries(scores)
    .map(([id, score]) => ({ id: id as T, score: Number(score) }))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return (orderIndex.get(a.id) ?? 999) - (orderIndex.get(b.id) ?? 999);
    });
}

function sameResultPair(
  pairA: readonly [ResultId, ResultId],
  pairB: readonly [ResultId, ResultId],
) {
  return pairA.every((id) => pairB.includes(id));
}

function findPowerDuoOutcome(
  topResults: RankedScore<ResultId>[],
  resultScores: ScoreMap<ResultId>,
  intentScores: ScoreMap<IntentTagId>,
): PowerDuoOutcome | null {
  const topTwo = topResults.slice(0, 2);

  if (topTwo.length < 2) {
    return null;
  }

  const topTwoIds = [topTwo[0].id, topTwo[1].id] satisfies [ResultId, ResultId];

  for (const duo of powerDuos) {
    const [firstResultId, secondResultId] = duo.resultIds;

    if (!sameResultPair(duo.resultIds, topTwoIds)) {
      continue;
    }

    const firstScore = resultScores[firstResultId] ?? 0;
    const secondScore = resultScores[secondResultId] ?? 0;
    const scoreGap = Math.abs(firstScore - secondScore);
    const trigger = duo.trigger;

    if (scoreGap > trigger.maxPointGap) {
      continue;
    }

    if (firstScore < trigger.minEachResultScore || secondScore < trigger.minEachResultScore) {
      continue;
    }

    if ("requiredIntentMinimums" in trigger) {
      const requiredIntentMinimums = trigger.requiredIntentMinimums as Partial<Record<IntentTagId, number>>;
      const hasRequiredIntents = Object.entries(requiredIntentMinimums).every(
        ([intentId, requiredScore]) => (intentScores[intentId as IntentTagId] ?? 0) >= requiredScore,
      );

      if (!hasRequiredIntents) {
        continue;
      }
    }

    return {
      kind: "power_duo",
      duoId: duo.id,
      resultIds: duo.resultIds,
      flowerName: duo.resultIds.map((resultId) => results[resultId].flowerName).join(" + "),
      messageTitle: duo.messageTitle,
      previewTeaser: duo.previewTeaser,
    };
  }

  return null;
}

export function calculateQuizOutcome(selectedAnswerIds: AnswerId[]): QuizScoreSummary {
  const resultScores = createEmptyScores(resultIds);
  const segmentScores = createEmptyScores(segmentIds);
  const intentScores = createEmptyScores(intentTagIds);

  for (const answerId of selectedAnswerIds) {
    const answerScoring = scoring[answerId];
    const answerResultScores = "results" in answerScoring ? answerScoring.results : undefined;
    const answerSegmentScores = "segments" in answerScoring ? answerScoring.segments : undefined;
    const answerIntentScores = "intents" in answerScoring ? answerScoring.intents : undefined;

    addScores(resultScores, answerResultScores as Partial<Record<ResultId, number>> | undefined);
    addScores(segmentScores, answerSegmentScores as Partial<Record<SegmentId, number>> | undefined);
    addScores(intentScores, answerIntentScores as Partial<Record<IntentTagId, number>> | undefined);
  }

  const topResults = rankScores(resultScores, resultIds);
  const topSegments = rankScores(segmentScores, segmentIds);
  const topIntentTags = rankScores(intentScores, intentTagIds);
  const powerDuoOutcome = findPowerDuoOutcome(topResults, resultScores, intentScores);
  const topSingleResultId = topResults[0]?.id ?? resultIds[0];
  const topSingleResult = results[topSingleResultId];

  return {
    selectedAnswerIds,
    resultScores,
    segmentScores,
    intentScores,
    topResults,
    topSegments,
    topIntentTags,
    outcome:
      powerDuoOutcome ??
      ({
        kind: "single",
        resultId: topSingleResultId,
        flowerName: topSingleResult.flowerName,
        messageTitle: topSingleResult.messageTitle,
        previewTeaser: topSingleResult.preview.teaser,
      } satisfies SingleOutcome),
  };
}
