"use client";

import { useMemo, useState } from "react";

import {
    PINTEREST_FIT_QUESTIONS,
    QUESTION_COUNT,
    QUESTION_ORDER,
    scorePinterestFitAssessment,
    type AssessmentAnswerValue,
    type AssessmentAnswers,
    type AssessmentResult,
    type PartialAssessmentAnswers,
    type QuestionId,
} from "@/lib/tools/pinterestFit";

import { IntroScreen } from "./IntroScreen";
import { QuestionScreen } from "./QuestionScreen";
import { ResultsScreen } from "./ResultsScreen";

type ScreenState =
    | { kind: "intro" }
    | { kind: "question"; questionIndex: number }
    | { kind: "results" };

function isCompleteAssessmentAnswers(answers: PartialAssessmentAnswers): answers is AssessmentAnswers {
    return QUESTION_ORDER.every((questionId) => answers[questionId] !== undefined);
}

function getAnswerForQuestion(answers: PartialAssessmentAnswers, questionId: QuestionId): AssessmentAnswerValue | undefined {
    return answers[questionId];
}

export function PinterestFitAssessment() {
    const [screen, setScreen] = useState<ScreenState>({ kind: "intro" });
    const [answers, setAnswers] = useState<PartialAssessmentAnswers>({});
    const [result, setResult] = useState<AssessmentResult | null>(null);

    const currentQuestion = useMemo(() => {
        if (screen.kind !== "question") {
            return null;
        }

        return PINTEREST_FIT_QUESTIONS[screen.questionIndex] ?? null;
    }, [screen]);

    const startAssessment = () => {
        setScreen({ kind: "question", questionIndex: 0 });
    };

    const restartAssessment = () => {
        setAnswers({});
        setResult(null);
        setScreen({ kind: "intro" });
    };

    const handleBack = () => {
        if (screen.kind !== "question") {
            return;
        }

        if (screen.questionIndex === 0) {
            setScreen({ kind: "intro" });
            return;
        }

        setScreen({ kind: "question", questionIndex: screen.questionIndex - 1 });
    };

    const handleSelectAnswer = (questionId: QuestionId, value: AssessmentAnswerValue) => {
        const nextAnswers = {
            ...answers,
            [questionId]: value,
        } satisfies PartialAssessmentAnswers;

        setAnswers(nextAnswers);

        const selectedQuestionIndex = QUESTION_ORDER.indexOf(questionId);
        const isLastQuestion = selectedQuestionIndex === QUESTION_COUNT - 1;

        if (isLastQuestion) {
            if (!isCompleteAssessmentAnswers(nextAnswers)) {
                throw new Error("Pinterest Fit Assessment cannot score until all seven answers are present.");
            }

            setResult(scorePinterestFitAssessment(nextAnswers));
            setScreen({ kind: "results" });
            return;
        }

        setScreen({ kind: "question", questionIndex: selectedQuestionIndex + 1 });
    };

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
            {screen.kind === "intro" ? <IntroScreen onStart={startAssessment} /> : null}

            {screen.kind === "question" && currentQuestion ? (
                <QuestionScreen
                    question={currentQuestion}
                    selectedValue={getAnswerForQuestion(answers, currentQuestion.id)}
                    onBack={handleBack}
                    onSelect={(value) => handleSelectAnswer(currentQuestion.id, value)}
                />
            ) : null}

            {screen.kind === "results" && result ? <ResultsScreen result={result} onRestart={restartAssessment} /> : null}
        </div>
    );
}

export default PinterestFitAssessment;
