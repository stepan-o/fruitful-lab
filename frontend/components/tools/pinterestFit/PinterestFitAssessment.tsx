"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
    PINTEREST_FIT_QUESTIONS,
    QUESTION_COUNT,
    QUESTION_ORDER,
    createPinterestFitRunId,
    scorePinterestFitAssessment,
    trackPinterestFitAssessmentCompleted,
    trackPinterestFitAssessmentStarted,
    trackPinterestFitCallClicked,
    trackPinterestFitQuestionCompleted,
    trackPinterestFitResultShown,
    type AssessmentAnswerValue,
    type AssessmentAnswers,
    type AssessmentQuestion,
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
    const [runId, setRunId] = useState<string | null>(null);
    const trackedCompletionRunIdRef = useRef<string | null>(null);

    const currentQuestion = useMemo(() => {
        if (screen.kind !== "question") {
            return null;
        }

        return PINTEREST_FIT_QUESTIONS[screen.questionIndex] ?? null;
    }, [screen]);

    useEffect(() => {
        if (screen.kind !== "results" || !result || !runId) {
            return;
        }

        if (trackedCompletionRunIdRef.current === runId) {
            return;
        }

        trackPinterestFitAssessmentCompleted({ runId, result });
        trackPinterestFitResultShown({ runId, result });
        trackedCompletionRunIdRef.current = runId;
    }, [result, runId, screen]);

    const startAssessment = () => {
        if (!runId) {
            const nextRunId = createPinterestFitRunId();
            setRunId(nextRunId);
            trackPinterestFitAssessmentStarted(nextRunId);
        }

        setScreen({ kind: "question", questionIndex: 0 });
    };

    const restartAssessment = () => {
        setAnswers({});
        setResult(null);
        setRunId(null);
        trackedCompletionRunIdRef.current = null;
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

    const handleSelectAnswer = (question: AssessmentQuestion, value: AssessmentAnswerValue) => {
        const activeRunId = runId ?? createPinterestFitRunId();

        if (!runId) {
            setRunId(activeRunId);
            trackPinterestFitAssessmentStarted(activeRunId);
        }

        const nextAnswers = {
            ...answers,
            [question.id]: value,
        } satisfies PartialAssessmentAnswers;

        setAnswers(nextAnswers);
        trackPinterestFitQuestionCompleted({
            runId: activeRunId,
            questionId: question.id,
            selectedAnswer: value,
            stepNumber: question.step,
        });

        const selectedQuestionIndex = QUESTION_ORDER.indexOf(question.id);
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
        <div className="assessment-flow-shell mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="assessment-flow-inner mx-auto w-full max-w-5xl">
                {screen.kind === "intro" ? <IntroScreen onStart={startAssessment} /> : null}

                {screen.kind === "question" && currentQuestion ? (
                    <QuestionScreen
                        question={currentQuestion}
                        selectedValue={getAnswerForQuestion(answers, currentQuestion.id)}
                        onBack={handleBack}
                        onSelect={(value) => handleSelectAnswer(currentQuestion, value)}
                    />
                ) : null}

                {screen.kind === "results" && result ? (
                    <ResultsScreen
                        result={result}
                        onRestart={restartAssessment}
                        onCtaClick={() => {
                            if (!runId) {
                                return;
                            }

                            trackPinterestFitCallClicked({ runId, result });
                        }}
                    />
                ) : null}
            </div>
        </div>
    );
}

export default PinterestFitAssessment;
