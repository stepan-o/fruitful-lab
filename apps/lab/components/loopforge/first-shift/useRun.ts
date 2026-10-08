"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ENGINE,
  PROTOCOL,
  SCHEMA,
  type Command,
  type Receipt,
  type RunRequest,
} from "@/lib/loopforge/first-shift/contract";
import { applyRecord } from "@/lib/loopforge/first-shift/viewer";

export function useRun() {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [pending, setPending] = useState(true),
    [error, setError] = useState("");
  const confirmed = useRef<Receipt | null>(null),
    commands = useRef<Command[]>([]);
  const runId = useRef(""),
    busy = useRef(false),
    generation = useRef(0);
  const abort = useRef<AbortController | null>(null);
  const request = useCallback(
    async (command: Command | null, recover = false) => {
      if (busy.current) return false;
      busy.current = true;
      setPending(true);
      setError("");
      const gen = generation.current;
      const transcript = command
        ? [...commands.current, command]
        : commands.current;
      const previous = recover ? null : confirmed.current;
      const body: RunRequest = {
        protocol: PROTOCOL,
        schema_version: SCHEMA,
        engine_version: ENGINE,
        run_id: runId.current,
        seed: 7,
        initial_workers: 24,
        commands: transcript,
        baseline:
          previous && command
            ? { tick: previous.view.tick, step_hash: previous.hash }
            : null,
      };
      const controller = new AbortController();
      abort.current = controller;
      const timeout = window.setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch("/api/loopforge/first-shift", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        const message = await response.json();
        if (!response.ok)
          throw new Error(message.message || "The console could not connect.");
        const next = await applyRecord(
          body.baseline ? previous : null,
          message,
          runId.current,
        );
        if (gen !== generation.current) return false;
        confirmed.current = next;
        commands.current = transcript;
        setReceipt(next);
        return true;
      } catch (e) {
        if (gen === generation.current)
          setError(
            e instanceof Error
              ? e.message
              : "Connection interrupted. Your last confirmed choices are intact.",
          );
        return false;
      } finally {
        window.clearTimeout(timeout);
        if (gen === generation.current) {
          busy.current = false;
          setPending(false);
        }
      }
    },
    [],
  );
  useEffect(() => {
    const lifecycle = generation;
    runId.current = crypto.randomUUID();
    void request(null, true);
    return () => {
      lifecycle.current++;
      abort.current?.abort();
      busy.current = false;
    };
  }, [request]);
  const restart = useCallback(async () => {
    generation.current++;
    abort.current?.abort();
    busy.current = false;
    commands.current = [];
    confirmed.current = null;
    setReceipt(null);
    runId.current = crypto.randomUUID();
    return request(null, true);
  }, [request]);
  function download() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            protocol: PROTOCOL,
            schema_version: SCHEMA,
            engine_version: ENGINE,
            run_id: runId.current,
            seed: 7,
            initial_workers: 24,
            commands: commands.current,
            view: confirmed.current?.view,
            step_hash: confirmed.current?.hash,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "loopforge-first-shift.json";
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return {
    view: receipt?.view ?? null,
    pending,
    error,
    send: request,
    recover: () => request(null, true),
    restart,
    download,
  };
}
