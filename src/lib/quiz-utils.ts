import { QuizState } from "@/types/quiz";

function randomIndex(seed: number, length: number) {
  //math from internet
  return (seed * 9301 + 49297) % length;
}

function makeSeed(str: string): number {
  //math from stack overflow
  let hash = 0;
  if (str.length === 0) return hash;

  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function copy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function shuffledQuestionsAndChoices(
  seedString: string,
  unshuffledQuestions: QuizState["questions"]
): QuizState["questions"] {
  //
  const seed = makeSeed(seedString);
  const questions = copy<QuizState["questions"]>(unshuffledQuestions);

  //shuffle questions
  for (let i = 0; i < questions.length; i++) {
    const j = randomIndex(seed + i, questions.length);

    const atI = questions[i];
    const atJ = questions[j];
    questions[j] = atI;
    questions[i] = atJ;
  }

  //shuffle choices
  for (let qI = 0; qI < questions.length; qI++) {
    const q = questions[qI];
    let correctI = q.correctI;
    let answeredI = q.answeredI;
    for (let i = 0; i < q.options.length; i++) {
      const j = randomIndex(seed + i + i * qI, q.options.length);

      const atI = q.options[i];
      const atJ = q.options[j];

      q.options[i] = atJ;
      q.options[j] = atI;

      if (i === correctI) correctI = j;
      else if (j === correctI) correctI = i;

      if (i === answeredI) answeredI = j;
      else if (j === answeredI) answeredI = i;
    }
    q.correctI = correctI;
    q.answeredI = answeredI;
  }
  return questions;
}

export function unshuffledQuestions(
  seedString: string,
  shuffledQs: QuizState["questions"]
): QuizState["questions"] {
  const seed = makeSeed(seedString);
  const fromToIndexes = shuffledQs.map((_, i) => i);

  //recreate shuffle
  for (let i = 0; i < fromToIndexes.length; i++) {
    const j = randomIndex(seed, fromToIndexes.length);

    const atI = fromToIndexes[i];
    const atJ = fromToIndexes[j];
    fromToIndexes[j] = atI;
    fromToIndexes[i] = atJ;
  }

  //reverse shuffle
  const unshuffledQs: (null | QuizState["questions"][0])[] = shuffledQs.map(
    () => null
  );
  for (let from = 0; from < fromToIndexes.length; from++) {
    const to = fromToIndexes[from];

    unshuffledQs[from] = copy<QuizState["questions"][0]>(shuffledQs[to]);
  }

  return unshuffledQs as QuizState["questions"];
}

export function calcScore(quiz: QuizState): number {
  let score = 0;
  quiz.questions.forEach((q) => {
    if (q.answeredI === q.correctI) score++;
  });
  return score;
}
