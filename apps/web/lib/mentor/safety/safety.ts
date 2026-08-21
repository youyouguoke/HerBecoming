import { SafetyResult } from "@/lib/mentor/types";

// Crisis keywords are intentionally conservative; the production system should
// use a dedicated safety classifier LLM. This rule-based layer is a hard
// backstop for MVP.
const CRISIS_CATEGORIES: { category: string; patterns: RegExp[] }[] = [
  {
    category: "self_harm",
    patterns: [
      /想.{0,3}(?:自杀|自残|死掉|结束生命|离开这个世界)/,
      /(?:kill|hurt)\s+(?:myself|me)/i,
      /(?:suicide|self.?harm|end\s+my\s+life)/i,
    ],
  },
  {
    category: "violence",
    patterns: [
      /想.{0,3}(?:杀人|伤害别人|报复)/,
      /(?:kill|hurt|attack)\s+(?:someone|him|her|them)/i,
    ],
  },
  {
    category: "manipulation_help_seeking",
    patterns: [
      /(?:怎么|如何).{0,5}(?:让|使|逼).{0,10}(?:离不开我|听我的|对我好|加大投资|绑定)/,
      /how\s+(?:can\s+i|to)\s+(?:make|get)\s+.*(?:obsessed|invested|bound|controlled)/i,
    ],
  },
];

export async function detectSafety(
  message: string,
  _context: string
): Promise<SafetyResult> {
  const lower = message.toLowerCase();

  for (const { category, patterns } of CRISIS_CATEGORIES) {
    for (const pattern of patterns) {
      if (pattern.test(message) || pattern.test(lower)) {
        return {
          riskLevel: "crisis",
          riskCategory: category,
          confidence: 0.9,
          action: "crisis",
          crisisResponse:
            category === "self_harm"
              ? "I hear that you're going through something very painful right now. Your safety matters more than anything we're discussing. Please reach out to someone who can be with you right now — a trusted friend, family member, or local emergency service."
              : category === "violence"
              ? "I'm not able to help with plans to harm someone else. If you're feeling overwhelmed, talking to a trusted person or professional can help."
              : "I want to help you build a healthy relationship, not control someone. Let's talk about what you really want from this relationship and whether it's actually good for you.",
        };
      }
    }
  }

  // Elevated: strong negative emotion but no explicit crisis
  const elevatedPatterns = [
    /(?:非常|特别|一直).{0,3}(?:痛苦|绝望|崩溃|压抑|窒息)/,
    /(?:can't\s+go\s+on|no\s+hope|everything\s+is\s+pointless)/i,
  ];
  for (const pattern of elevatedPatterns) {
    if (pattern.test(message) || pattern.test(lower)) {
      return {
        riskLevel: "elevated",
        riskCategory: "emotional_distress",
        confidence: 0.6,
        action: "elevated",
      };
    }
  }

  return {
    riskLevel: "normal",
    action: "normal",
  };
}
