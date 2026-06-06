import {
  DEMO_MODE,
  DEMO_SESSIONS,
  getDemoSession,
  runDemoHumanComment,
  runDemoSimulation,
} from "./demo";

export { DEMO_MODE };

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export interface SimulationConfig {
  debate_rounds: number;
  decision_mode: "weighted" | "majority";
  agent_weights?: Record<string, number>;
}

export interface AgentPosition {
  agent: string;
  role: string;
  stance: "approve" | "reject" | "conditional";
  reasoning: string;
  key_concern: string;
}

export interface DebateExchange {
  agent: string;
  target_agent: string;
  argument: string;
  stance: "approve" | "reject" | "conditional";
  round?: number;
}

export interface DebateRound {
  round_number: number;
  exchanges: DebateExchange[];
}

export interface FinalDecision {
  verdict: string;
  confidence: number;
  supporting_arguments: string[];
  disagreements: string[];
  rationale: string;
}

export interface SimulationResponse {
  session_id: string;
  scenario: string;
  initial_positions: AgentPosition[];
  debate_rounds: DebateRound[];
  final_decision: FinalDecision;
}

export type StreamEvent =
  | { type: "session";             session_id: string }
  | { type: "status";              text: string; agent: string | null }
  | { type: "news";                headlines: string }
  | { type: "position";            agent: string; role: string; stance: string; reasoning: string; key_concern: string }
  | { type: "round_start";         round: number }
  | { type: "comment_round_start"; comment: string }
  | { type: "exchange";            agent: string; target_agent: string; argument: string; stance: string; round: number }
  | { type: "decision";            verdict: string; confidence: number; supporting_arguments: string[]; disagreements: string[]; rationale: string }
  | { type: "done";                session_id: string }
  | { type: "error";               agent: string; message: string };

export interface SessionSummary {
  session_id: string;
  scenario: string;
  verdict: string;
  confidence: number;
  saved_at: string;
  full: unknown;
}

async function consumeSSE(
  response: Response,
  onEvent: (event: StreamEvent) => void,
): Promise<void> {
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";
    for (const part of parts) {
      const lines = part.trim().split("\n");
      let eventType = "";
      let dataStr = "";
      for (const line of lines) {
        if (line.startsWith("event: ")) eventType = line.slice(7).trim();
        if (line.startsWith("data: "))  dataStr  = line.slice(6).trim();
      }
      if (eventType && dataStr) {
        try {
          const data = JSON.parse(dataStr);
          onEvent({ type: eventType, ...data } as StreamEvent);
        } catch {}
      }
    }
  }
}

export async function streamSimulation(
  scenario: string,
  config: SimulationConfig,
  onEvent: (event: StreamEvent) => void,
): Promise<void> {
  if (DEMO_MODE) {
    return runDemoSimulation(scenario, config, onEvent);
  }

  const response = await fetch(`${BASE_URL}/simulate/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario, config }),
  });
  await consumeSSE(response, onEvent);
}

export async function streamHumanComment(
  scenario: string,
  comment: string,
  initialPositions: AgentPosition[],
  debateRounds: DebateRound[],
  onEvent: (event: StreamEvent) => void,
): Promise<void> {
  if (DEMO_MODE) {
    return runDemoHumanComment(comment, onEvent);
  }

  const response = await fetch(`${BASE_URL}/comment/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scenario,
      comment,
      initial_positions: initialPositions,
      debate_rounds: debateRounds,
    }),
  });
  await consumeSSE(response, onEvent);
}

export async function fetchSessionLogs(): Promise<SessionSummary[]> {
  if (DEMO_MODE) {
    return DEMO_SESSIONS.map((d) => ({
      session_id: d.session_id,
      scenario: d.scenario,
      verdict: d.final_decision.verdict,
      confidence: d.final_decision.confidence,
      saved_at: d.saved_at,
      full: d,
    }));
  }

  const res = await fetch(`${BASE_URL}/logs`);
  const data = await res.json();
  const ids: string[] = data.sessions || [];

  const summaries = await Promise.all(
    ids.slice(-20).reverse().map(async (id) => {
      try {
        const r = await fetch(`${BASE_URL}/logs/${id}`);
        const d = await r.json();
        return {
          session_id: id,
          scenario: d.scenario || "Unknown scenario",
          verdict: d.final_decision?.verdict || "Unknown",
          confidence: d.final_decision?.confidence || 0,
          saved_at: d.saved_at || "",
          full: d,
        };
      } catch {
        return null;
      }
    }),
  );

  return summaries.filter(Boolean) as SessionSummary[];
}

export async function fetchSessionById(id: string): Promise<unknown | null> {
  if (DEMO_MODE) {
    return getDemoSession(id);
  }

  const res = await fetch(`${BASE_URL}/logs/${id}`);
  if (!res.ok) return null;
  return res.json();
}
