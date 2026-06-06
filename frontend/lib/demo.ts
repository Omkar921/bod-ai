import type {
  AgentPosition,
  DebateRound,
  SimulationConfig,
  StreamEvent,
} from "./api";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function emit(onEvent: (event: StreamEvent) => void, event: StreamEvent, ms = 600) {
  onEvent(event);
  await delay(ms);
}

export const DEMO_MODE =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
  !process.env.NEXT_PUBLIC_API_URL;

export interface DemoSession {
  session_id: string;
  scenario: string;
  saved_at: string;
  initial_positions: AgentPosition[];
  debate_rounds: DebateRound[];
  final_decision: {
    verdict: string;
    confidence: number;
    supporting_arguments: string[];
    disagreements: string[];
    rationale: string;
  };
}

export const DEMO_SESSIONS: DemoSession[] = [
  {
    session_id: "demo-bnpl-001",
    scenario:
      "Should we launch a buy-now-pay-later product targeting millennials in Southeast Asia next quarter?",
    saved_at: "2026-05-18T14:22:00.000Z",
    initial_positions: [
      {
        agent: "CEO",
        role: "Chief Executive Officer",
        stance: "approve",
        reasoning:
          "BNPL is a strategic wedge into Southeast Asia's underbanked millennial segment. First-mover advantage in Indonesia and Vietnam could capture 2M users within 12 months and strengthen our fintech narrative for investors.",
        key_concern: "Competitive timing vs regional players like Atome and Grab.",
      },
      {
        agent: "CFO",
        role: "Chief Financial Officer",
        stance: "conditional",
        reasoning:
          "Unit economics are viable at 3.2% merchant fee with 8% annualised default assumptions, but we need a phased rollout capped at $18M to protect EBITDA during the pilot.",
        key_concern: "Credit loss provisioning and FX exposure across markets.",
      },
      {
        agent: "CMO",
        role: "Chief Marketing Officer",
        stance: "approve",
        reasoning:
          "Millennial adoption of BNPL in SEA grew 47% YoY. Our brand trust score is 34 points above fintech challengers — we can win on responsible lending positioning rather than pure discounting.",
        key_concern: "Localisation of messaging across 4 language markets.",
      },
      {
        agent: "Risk",
        role: "Chief Risk Officer",
        stance: "conditional",
        reasoning:
          "Regulatory frameworks in Singapore and Malaysia are mature, but Indonesia's OJK rules are still evolving. Approve only with conservative credit limits, mandatory KYC tier-2, and a 90-day fraud monitoring window.",
        key_concern: "Cross-border AML compliance and collection practices.",
      },
    ],
    debate_rounds: [
      {
        round_number: 1,
        exchanges: [
          {
            agent: "CFO",
            target_agent: "CEO",
            stance: "conditional",
            argument:
              "Elon, your growth targets assume 4% default rates — our stress test shows 6.8% in a regional downturn. I need hard caps on exposure before we greenlight Q3 launch.",
          },
          {
            agent: "Risk",
            target_agent: "CMO",
            stance: "conditional",
            argument:
              "Julia, aggressive acquisition campaigns often attract high-risk borrowers. Marketing must exclude promotional codes on first-transaction limits above $200 until our scoring model calibrates.",
          },
          {
            agent: "CEO",
            target_agent: "CFO",
            stance: "approve",
            argument:
              "Sachin, we'll ring-fence the pilot at $12M not $18M and use dynamic limits. Speed matters — every quarter we wait, two regional BNPLs consolidate market share.",
          },
          {
            agent: "CMO",
            target_agent: "Risk",
            stance: "approve",
            argument:
              "Ashley, our responsible-lending campaign actually reduces fraud signals — Mastercard data shows trust-led BNPL brands see 22% lower first-90-day charge-offs.",
          },
        ],
      },
      {
        round_number: 2,
        exchanges: [
          {
            agent: "Risk",
            target_agent: "CEO",
            stance: "conditional",
            argument:
              "I'm willing to support a Singapore + Malaysia launch first, with Indonesia deferred until OJK publishes final BNPL guidelines in Q4.",
          },
          {
            agent: "CFO",
            target_agent: "CMO",
            stance: "conditional",
            argument:
              "Marketing spend must stay within 18% of pilot revenue. No brand campaigns until week-6 default data confirms we're inside model.",
          },
          {
            agent: "CEO",
            target_agent: "Risk",
            stance: "approve",
            argument:
              "Agreed on phased geography. We'll treat Indonesia as phase-2 and publish a public compliance charter — that turns Risk's concern into a competitive moat.",
          },
          {
            agent: "CMO",
            target_agent: "CFO",
            stance: "approve",
            argument:
              "I can hit CAC targets with influencer micro-campaigns instead of mass media — 18% cap is achievable if we lead with education content, not cashback.",
          },
        ],
      },
    ],
    final_decision: {
      verdict: "Conditional Approval",
      confidence: 0.78,
      supporting_arguments: [
        "Strong millennial demand and brand trust advantage in core SEA markets.",
        "Phased rollout with ring-fenced capital addresses CFO and Risk concerns.",
        "Responsible-lending positioning aligns marketing with credit quality.",
      ],
      disagreements: [
        "CEO pushed for immediate Indonesia entry; Risk and CFO require deferral.",
        "CFO's marketing spend cap vs CMO's growth ambitions remain a tension point.",
      ],
      rationale:
        "The board approves a Q3 BNPL pilot in Singapore and Malaysia with a $12M exposure cap, tier-2 KYC, and Indonesia deferred to phase-2 pending regulatory clarity.",
    },
  },
  {
    session_id: "demo-acquire-002",
    scenario:
      "Should we acquire a fintech startup specialising in AI-driven credit scoring for $120M?",
    saved_at: "2026-05-10T09:15:00.000Z",
    initial_positions: [
      {
        agent: "CEO",
        role: "Chief Executive Officer",
        stance: "approve",
        reasoning:
          "In-house AI scoring cuts loan decision time from 48 hours to 90 seconds. This acquisition accelerates our platform strategy by 18 months.",
        key_concern: "Integration speed and talent retention post-close.",
      },
      {
        agent: "CFO",
        role: "Chief Financial Officer",
        stance: "reject",
        reasoning:
          "At 14× ARR the valuation is rich. Building a comparable model internally costs ~$35M over 24 months with lower integration risk.",
        key_concern: "Purchase price vs synergies timeline.",
      },
      {
        agent: "CMO",
        role: "Chief Marketing Officer",
        stance: "conditional",
        reasoning:
          "The brand story is compelling for enterprise clients, but only if we can rebrand the engine under our trust umbrella within 6 months.",
        key_concern: "Customer communication during transition.",
      },
      {
        agent: "Risk",
        role: "Chief Risk Officer",
        stance: "conditional",
        reasoning:
          "Their model performs well on US data but is unvalidated on our Southeast Asia portfolio. Need 6-month parallel run before production cutover.",
        key_concern: "Model bias and regulatory explainability.",
      },
    ],
    debate_rounds: [
      {
        round_number: 1,
        exchanges: [
          {
            agent: "CEO",
            target_agent: "CFO",
            stance: "approve",
            argument:
              "Sachin, time-to-market is the asset here. Every quarter we build in-house, competitors embed AI scoring into their core products.",
          },
          {
            agent: "CFO",
            target_agent: "CEO",
            stance: "reject",
            argument:
              "Speed doesn't justify 3.4× the build cost. I'd support a $40M acqui-hire of their ML team, not a full $120M acquisition.",
          },
          {
            agent: "Risk",
            target_agent: "CEO",
            stance: "conditional",
            argument:
              "Even if we acquire, I require explainability audits and regional backtesting before any automated credit decisions go live.",
          },
          {
            agent: "CMO",
            target_agent: "CFO",
            stance: "conditional",
            argument:
              "An acqui-hire loses the enterprise client list — that's 40% of the strategic value Sachin is dismissing.",
          },
        ],
      },
    ],
    final_decision: {
      verdict: "Rejected",
      confidence: 0.71,
      supporting_arguments: [
        "CFO's build-vs-buy analysis shows 3.4× cost premium at current valuation.",
        "Risk requires extended validation that erodes the speed advantage.",
      ],
      disagreements: [
        "CEO argued strongly for strategic acceleration; board prioritised capital discipline.",
        "CMO wanted brand benefits of full acquisition vs acqui-hire compromise.",
      ],
      rationale:
        "The board rejects the $120M acquisition and directs management to pursue a targeted acqui-hire of the ML team with a $40M budget cap.",
    },
  },
  {
    session_id: "demo-digital-003",
    scenario:
      "Should we shut down our physical branch network and go fully digital within 18 months?",
    saved_at: "2026-04-28T16:40:00.000Z",
    initial_positions: [
      {
        agent: "CEO",
        role: "Chief Executive Officer",
        stance: "approve",
        reasoning:
          "Branches cost $94M annually with declining footfall. A digital-first model aligns with where 89% of our new customers already onboard.",
        key_concern: "Employee transition and customer churn in rural segments.",
      },
      {
        agent: "CFO",
        role: "Chief Financial Officer",
        stance: "approve",
        reasoning:
          "Closing 340 branches saves $62M net of redundancy costs by year-2. ROI on digital infrastructure is 2.1× within 36 months.",
        key_concern: "One-time restructuring charge of $28M.",
      },
      {
        agent: "CMO",
        role: "Chief Marketing Officer",
        stance: "conditional",
        reasoning:
          "Urban customers won't notice, but 34% of rural account holders still visit branches monthly. Need hybrid kiosks in 40 key locations.",
        key_concern: "Brand perception in underserved communities.",
      },
      {
        agent: "Risk",
        role: "Chief Risk Officer",
        stance: "reject",
        reasoning:
          "Fully digital onboarding increases synthetic identity fraud. Branches provide a critical in-person verification layer for high-value accounts.",
        key_concern: "Fraud rate spike during transition period.",
      },
    ],
    debate_rounds: [
      {
        round_number: 1,
        exchanges: [
          {
            agent: "Risk",
            target_agent: "CEO",
            stance: "reject",
            argument:
              "Elon, our fraud losses spiked 31% in markets that went branchless without hybrid verification. We cannot replicate that mistake.",
          },
          {
            agent: "CMO",
            target_agent: "Risk",
            stance: "conditional",
            argument:
              "Ashley, partner kiosk networks with biometric verification can replace branch KYC — we don't need full branches for that.",
          },
          {
            agent: "CFO",
            target_agent: "CMO",
            stance: "approve",
            argument:
              "40 kiosks cost $4M vs $94M for the full network. That's the compromise that makes the P&L work.",
          },
          {
            agent: "CEO",
            target_agent: "Risk",
            stance: "conditional",
            argument:
              "Fine — 18-month timeline with kiosks in high-fraud postal codes first. But the branch closure plan stays on track.",
          },
        ],
      },
    ],
    final_decision: {
      verdict: "Conditional Approval",
      confidence: 0.74,
      supporting_arguments: [
        "$62M annual savings justify accelerated digital transformation.",
        "Hybrid kiosk model addresses rural access and fraud concerns.",
      ],
      disagreements: [
        "Risk wanted to maintain more in-person verification than the final plan allows.",
        "CEO's 18-month timeline vs CMO's preference for 24-month phased rollout.",
      ],
      rationale:
        "The board approves branch wind-down over 18 months with 40 biometric kiosks in rural hubs and enhanced digital fraud monitoring during transition.",
    },
  },
];

function buildLiveSimulation(scenario: string, config: SimulationConfig): StreamEvent[] {
  const sessionId = `demo-live-${Date.now().toString(36)}`;
  const matched =
    DEMO_SESSIONS.find((s) => s.scenario === scenario) ?? DEMO_SESSIONS[0];

  const events: StreamEvent[] = [
    { type: "session", session_id: sessionId },
    { type: "status", text: "Fetching market context…", agent: null },
    {
      type: "news",
      headlines:
        "• SEA fintech funding up 12% QoQ\n• Regulators tighten BNPL disclosure rules\n• Millennial credit appetite rises in urban markets",
    },
  ];

  for (const pos of matched.initial_positions) {
    events.push({
      type: "status",
      text: `${pos.agent} is analysing the scenario…`,
      agent: pos.agent,
    });
    events.push({
      type: "position",
      agent: pos.agent,
      role: pos.role,
      stance: pos.stance,
      reasoning: pos.reasoning,
      key_concern: pos.key_concern,
    });
  }

  const rounds = Math.min(config.debate_rounds, matched.debate_rounds.length);
  for (let i = 0; i < rounds; i++) {
    const round = matched.debate_rounds[i];
    events.push({ type: "round_start", round: round.round_number });
    for (const ex of round.exchanges) {
      events.push({
        type: "status",
        text: `${ex.agent} is responding…`,
        agent: ex.agent,
      });
      events.push({
        type: "exchange",
        agent: ex.agent,
        target_agent: ex.target_agent,
        argument: ex.argument,
        stance: ex.stance,
        round: round.round_number,
      });
    }
  }

  events.push({
    type: "decision",
    verdict: matched.final_decision.verdict,
    confidence: matched.final_decision.confidence,
    supporting_arguments: matched.final_decision.supporting_arguments,
    disagreements: matched.final_decision.disagreements,
    rationale: matched.final_decision.rationale,
  });
  events.push({ type: "done", session_id: sessionId });

  return events;
}

export async function runDemoSimulation(
  scenario: string,
  config: SimulationConfig,
  onEvent: (event: StreamEvent) => void,
): Promise<void> {
  const events = buildLiveSimulation(scenario, config);
  for (const event of events) {
    const pause =
      event.type === "session" ? 400 :
      event.type === "news" ? 800 :
      event.type === "round_start" ? 700 :
      event.type === "decision" ? 900 :
      event.type === "done" ? 300 :
      650;
    await emit(onEvent, event, pause);
  }
}

export async function runDemoHumanComment(
  comment: string,
  onEvent: (event: StreamEvent) => void,
): Promise<void> {
  const responses = [
    {
      agent: "CEO",
      target_agent: "human",
      stance: "approve" as const,
      argument: `Your point on "${comment.slice(0, 40)}${comment.length > 40 ? "…" : ""}" aligns with moving decisively — I'd prioritize action this quarter with clear guardrails.`,
    },
    {
      agent: "CFO",
      target_agent: "human",
      stance: "conditional" as const,
      argument:
        "I hear the urgency, but we need quantified ROI milestones before committing additional capital. Can you share expected payback period?",
    },
    {
      agent: "Risk",
      target_agent: "human",
      stance: "conditional" as const,
      argument:
        "Any acceleration must include updated fraud and compliance checkpoints. I won't sign off without a parallel risk review.",
    },
    {
      agent: "CMO",
      target_agent: "human",
      stance: "approve" as const,
      argument:
        "From a market perspective, your input strengthens our customer narrative — we should reflect this in the next board communication.",
    },
  ];

  await emit(onEvent, { type: "comment_round_start", comment }, 500);

  for (let i = 0; i < responses.length; i++) {
    const ex = responses[i];
    await emit(
      onEvent,
      { type: "status", text: `${ex.agent} is responding to you…`, agent: ex.agent },
      500,
    );
    await emit(
      onEvent,
      {
        type: "exchange",
        agent: ex.agent,
        target_agent: ex.target_agent,
        argument: ex.argument,
        stance: ex.stance,
        round: 0,
      },
      700,
    );
  }

  await emit(onEvent, { type: "done", session_id: "demo-comment" }, 200);
}

export function listDemoSessions(): { sessions: string[] } {
  return { sessions: DEMO_SESSIONS.map((s) => s.session_id) };
}

export function getDemoSession(id: string): DemoSession | null {
  return DEMO_SESSIONS.find((s) => s.session_id === id) ?? null;
}
