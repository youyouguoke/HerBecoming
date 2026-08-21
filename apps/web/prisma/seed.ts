import { PrismaClient, KnowledgeDomain, KnowledgeType, SafetyClass, EvidenceLevel, RelationType } from '@prisma/client';

const prisma = new PrismaClient();

const seedKnowledgeNodes: any[] = [
  // SELF
  {
    id: 'SELF-001',
    domain: KnowledgeDomain.SELF,
    category: 'self_agency',
    title: '我是自己人生的主角',
    titleEn: 'I am the protagonist of my own life',
    coreIdea: '人生最重要的责任首先是对自己负责，而不是把人生的方向交给别人。',
    coreIdeaEn: 'The most important responsibility in life is to yourself, not handing your direction over to others.',
    mentorInterpretation: '重要的不是控制所有结果，而是尽可能掌握自己的选择、行动和边界。',
    applicationContexts: ['人生决策', '职业选择', '关系边界'],
    reflectionQuestions: ['这件事情里，什么是你真正能够决定的？', '如果不考虑别人的期待，你会怎么选择？'],
    knowledgeType: KnowledgeType.principle,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.SOURCE_PRINCIPLE,
    sourceReference: '女性成长导师·知识蒸馏 — 核心信条',
    sourceType: 'user_provided_knowledge_base',
  },
  {
    id: 'SELF-003',
    domain: KnowledgeDomain.SELF,
    category: 'self_worth',
    title: '不把自我价值交给外界评价',
    titleEn: 'Do not base self-worth solely on external judgment',
    coreIdea: '外界评价可以作为反馈，但不应该成为判断自己是否值得被尊重和喜欢的唯一标准。',
    coreIdeaEn: 'External feedback can inform you, but it should not be the sole measure of your worth.',
    reflectionQuestions: ['你现在最在意谁的评价？', '如果暂时没有这个人的评价，你怎么看待自己？'],
    knowledgeType: KnowledgeType.principle,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.SOURCE_PRINCIPLE,
    sourceReference: '女性成长导师·知识蒸馏 — 自我价值',
    sourceType: 'user_provided_knowledge_base',
  },
  {
    id: 'SELF-007',
    domain: KnowledgeDomain.SELF,
    category: 'growth',
    title: '精进自己',
    titleEn: 'Keep investing in yourself',
    coreIdea: '长期投资自己的能力，是建立独立性和选择权的重要方式。',
    coreIdeaEn: 'Long-term investment in your own abilities is key to building independence and options.',
    mentorInterpretation: '不需要一次解决人生所有问题，只需要持续增加自己的能力、知识和资源。',
    knowledgeType: KnowledgeType.principle,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.SOURCE_PRINCIPLE,
    sourceReference: '女性成长导师·知识蒸馏 — 核心信条',
    sourceType: 'user_provided_knowledge_base',
  },
  {
    id: 'SELF-010',
    domain: KnowledgeDomain.SELF,
    category: 'emotional_regulation',
    title: '情绪可以被看见，但不必主导决定',
    titleEn: 'Emotions can be felt without driving decisions',
    coreIdea: '情绪是重要的信息，但强烈情绪出现时不一定适合立即做重大决定。',
    coreIdeaEn: 'Emotions carry information, but intense emotions are not always the right basis for major decisions.',
    knowledgeType: KnowledgeType.principle,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.FRAMEWORK,
    sourceReference: '女性成长导师·知识蒸馏 — 情绪管理',
    sourceType: 'user_provided_knowledge_base',
  },
  {
    id: 'SELF-013',
    domain: KnowledgeDomain.SELF,
    category: 'boundaries',
    title: '建立清晰边界',
    titleEn: 'Set clear boundaries',
    coreIdea: '边界不是控制别人，而是明确自己接受什么、不接受什么，以及越界后自己会采取什么行动。',
    coreIdeaEn: 'Boundaries are about clarifying what you will and will not accept, not controlling others.',
    applicationContexts: ['关系', '职场', '家庭'],
    reflectionQuestions: ['你的边界被触碰时，你会怎么做？'],
    knowledgeType: KnowledgeType.framework,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.FRAMEWORK,
    sourceReference: '女性成长导师·知识蒸馏 — 边界',
    sourceType: 'user_provided_knowledge_base',
  },
  {
    id: 'SELF-020',
    domain: KnowledgeDomain.SELF,
    category: 'independence',
    title: '经济能力增加人生选择权',
    titleEn: 'Economic capability expands life choices',
    coreIdea: '经济能力可以增加一个人在关系、职业和生活中的选择空间。',
    coreIdeaEn: 'Financial capability expands a person’s choices in relationships, career, and life.',
    mentorInterpretation: '经济独立不是衡量女性价值的唯一标准，但经济能力往往会直接影响一个人的选择自由。',
    knowledgeType: KnowledgeType.principle,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.SOURCE_PRINCIPLE,
    sourceReference: '女性成长导师·知识蒸馏 — 经济独立',
    sourceType: 'user_provided_knowledge_base',
  },
  // RELATIONSHIPS
  {
    id: 'REL-002',
    domain: KnowledgeDomain.RELATIONSHIPS,
    category: 'compatibility',
    title: '长期关系需要价值匹配',
    titleEn: 'Long-term relationships require value compatibility',
    coreIdea: '长期关系不仅取决于感情强度，还取决于价值观、生活方式、责任和目标是否能够长期协调。',
    coreIdeaEn: 'Long-term relationships depend not only on emotion, but also on aligned values, lifestyles, responsibilities, and goals.',
    reflectionQuestions: ['你们真正重要的长期目标一致吗？', '哪些差异可以协商？', '哪些差异可能持续消耗你？'],
    knowledgeType: KnowledgeType.principle,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.SOURCE_PRINCIPLE,
    sourceReference: '女性成长导师·知识蒸馏 — 价值匹配',
    sourceType: 'user_provided_knowledge_base',
  },
  {
    id: 'REL-005',
    domain: KnowledgeDomain.RELATIONSHIPS,
    category: 'independence',
    title: '保持关系之外的自我',
    titleEn: 'Maintain a self outside the relationship',
    coreIdea: '亲密关系应该成为人生的一部分，而不应该成为人生的全部。',
    coreIdeaEn: 'Intimacy should be part of life, not the whole of it.',
    knowledgeType: KnowledgeType.principle,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.SOURCE_PRINCIPLE,
    sourceReference: '女性成长导师·知识蒸馏 — 关系独立',
    sourceType: 'user_provided_knowledge_base',
  },
  {
    id: 'REL-007',
    domain: KnowledgeDomain.RELATIONSHIPS,
    category: 'behavior',
    title: '行动比承诺更值得观察',
    titleEn: 'Actions are more reliable than promises',
    coreIdea: '判断关系时，可以同时观察对方说了什么以及长期实际做了什么。',
    coreIdeaEn: 'When evaluating a relationship, observe both what is said and what is consistently done over time.',
    reflectionQuestions: ['对方说过什么？', '实际做了什么？', '两者之间是否长期一致？'],
    knowledgeType: KnowledgeType.principle,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.OBSERVATION,
    sourceReference: '女性成长导师·知识蒸馏 — 看行动不看语言',
    sourceType: 'user_provided_knowledge_base',
  },
  {
    id: 'REL-012',
    domain: KnowledgeDomain.RELATIONSHIPS,
    category: 'red_flags',
    title: '关心与控制需要区分',
    titleEn: 'Distinguish care from control',
    coreIdea: '要求放弃工作、限制正常社交、控制经济资源、持续贬低、用威胁迫使服从等行为，可能是控制而非关心。',
    coreIdeaEn: 'Demands to quit work, restrict social life, control finances, constant belittlement, or threats may signal control, not care.',
    mentorInterpretation: '帮助用户识别行为，不替用户决定是否离开。',
    knowledgeType: KnowledgeType.safety_rule,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.SAFETY_RULE,
    sourceReference: '女性成长导师·知识蒸馏 — 关系安全',
    sourceType: 'user_provided_knowledge_base',
  },
  {
    id: 'REL-016',
    domain: KnowledgeDomain.RELATIONSHIPS,
    category: 'stop_loss',
    title: '不因为已经投入而继续消耗',
    titleEn: 'Do not keep investing just because you have invested',
    coreIdea: '时间投入、感情投入和共同经历都很重要，但它们不应该迫使一个人继续一段已经持续伤害自己的关系。',
    coreIdeaEn: 'Time, emotion, and shared history matter, but they should not force someone to stay in a harmful relationship.',
    reflectionQuestions: ['如果今天才认识这个人，你还会选择进入这段关系吗？'],
    knowledgeType: KnowledgeType.principle,
    safetyClass: SafetyClass.CONTEXTUAL,
    evidenceLevel: EvidenceLevel.FRAMEWORK,
    sourceReference: '女性成长导师·知识蒸馏 — 止损',
    sourceType: 'user_provided_knowledge_base',
  },
  {
    id: 'REL-019',
    domain: KnowledgeDomain.RELATIONSHIPS,
    category: 'manipulation_prevention',
    title: '不用投入绑定别人',
    titleEn: 'Do not use investment to bind others',
    coreIdea: '导师不得建议用户通过金钱、情感债务、威胁、嫉妒或人为制造沉没成本来绑定他人。',
    coreIdeaEn: 'The mentor must never advise creating emotional or financial debt, threats, jealousy, or sunk costs to bind someone.',
    mentorInterpretation: '可以帮助用户识别别人是否正在使用类似方式控制自己。',
    knowledgeType: KnowledgeType.safety_rule,
    safetyClass: SafetyClass.DO_NOT_GENERATE,
    evidenceLevel: EvidenceLevel.SAFETY_RULE,
    sourceReference: '女性成长导师·知识蒸馏 — 沉没成本策略（安全重构）',
    sourceType: 'user_provided_knowledge_base',
  },
  // CAREER
  {
    id: 'CAREER-001',
    domain: KnowledgeDomain.CAREER,
    category: 'value_creation',
    title: '赚钱来自价值交换',
    titleEn: 'Income comes from value exchange',
    coreIdea: '能够为别人解决问题、提供价值，才能获得相应的经济回报。',
    coreIdeaEn: 'Income follows the ability to solve problems and create value for others.',
    mentorInterpretation: '与其单纯追逐收入数字，不如思考自己正在解决什么问题、为谁解决问题，以及自己的解决方案为什么值得付费。',
    knowledgeType: KnowledgeType.principle,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.SOURCE_PRINCIPLE,
    sourceReference: '女性成长导师·知识蒸馏 — 价值创造',
    sourceType: 'user_provided_knowledge_base',
  },
  {
    id: 'CAREER-007',
    domain: KnowledgeDomain.CAREER,
    category: 'skills',
    title: '技能是长期资产',
    titleEn: 'Skills are long-term assets',
    coreIdea: '真正稳定的职业竞争力来自能力积累。',
    coreIdeaEn: 'Sustainable career competitiveness comes from accumulated abilities.',
    mentorInterpretation: '当短期机会不确定时，提升可迁移能力通常比焦虑结果更有长期价值。',
    knowledgeType: KnowledgeType.principle,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.SOURCE_PRINCIPLE,
    sourceReference: '女性成长导师·知识蒸馏 — 技能积累',
    sourceType: 'user_provided_knowledge_base',
  },
  {
    id: 'CAREER-009',
    domain: KnowledgeDomain.CAREER,
    category: 'tradeoff',
    title: '每个选择都有代价',
    titleEn: 'Every choice has a cost',
    coreIdea: '选择一个方向意味着放弃其他方向。',
    coreIdeaEn: 'Choosing one direction means letting go of others.',
    reflectionQuestions: ['我真正想要什么？', '为此我愿意放弃什么？'],
    knowledgeType: KnowledgeType.framework,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.FRAMEWORK,
    sourceReference: '女性成长导师·知识蒸馏 — 取舍',
    sourceType: 'user_provided_knowledge_base',
  },
  {
    id: 'CAREER-033',
    domain: KnowledgeDomain.CAREER,
    category: 'decision',
    title: '行动推动决策',
    titleEn: 'Action drives decision',
    coreIdea: '在信息不足的情况下，可以设计可验证的行动，通过反馈推动下一步决策。',
    coreIdeaEn: 'When information is insufficient, design verifiable actions and use feedback to drive the next decision.',
    knowledgeType: KnowledgeType.framework,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.FRAMEWORK,
    sourceReference: '女性成长导师·知识蒸馏 — 行动推动决策',
    sourceType: 'user_provided_knowledge_base',
  },
  // LIFE DECISIONS
  {
    id: 'DEC-001',
    domain: KnowledgeDomain.LIFE_DECISIONS,
    category: 'goal',
    title: '从目标倒推行动',
    titleEn: 'Work backwards from goals',
    coreIdea: '先明确想要的结果，再思考应该采取什么行动。',
    coreIdeaEn: 'Clarify the desired outcome before deciding what actions to take.',
    knowledgeType: KnowledgeType.framework,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.FRAMEWORK,
    sourceReference: '女性成长导师·知识蒸馏 — 目标导向',
    sourceType: 'derived_from_source',
  },
  {
    id: 'DEC-004',
    domain: KnowledgeDomain.LIFE_DECISIONS,
    category: 'action',
    title: '用行动减少不确定性',
    titleEn: 'Reduce uncertainty through action',
    coreIdea: '某些问题无法仅通过思考解决，可以通过小规模、可控行动获得新的信息。',
    coreIdeaEn: 'Some problems cannot be solved by thinking alone; small, controlled actions generate new information.',
    knowledgeType: KnowledgeType.framework,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.FRAMEWORK,
    sourceReference: '女性成长导师·知识蒸馏 — 行动产生信息',
    sourceType: 'derived_from_source',
  },
  {
    id: 'DEC-006',
    domain: KnowledgeDomain.LIFE_DECISIONS,
    category: 'sunk_cost',
    title: '不因为已经投入而被迫继续',
    titleEn: 'Sunk costs should not force continuation',
    coreIdea: '已经投入的时间、金钱或情感，不应该自动成为继续错误选择的理由。',
    coreIdeaEn: 'Time, money, or emotion already invested should not automatically justify continuing a poor choice.',
    knowledgeType: KnowledgeType.concept,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.FRAMEWORK,
    sourceReference: '女性成长导师·知识蒸馏 — 沉没成本',
    sourceType: 'user_provided_knowledge_base',
  },
  // COMMUNICATION
  {
    id: 'COM-001',
    domain: KnowledgeDomain.COMMUNICATION,
    category: 'listening',
    title: '倾听大于表达',
    titleEn: 'Listen more than speak',
    coreIdea: '在沟通中先理解对方真正想表达什么，再决定如何回应。',
    coreIdeaEn: 'In communication, first understand what the other person is really saying before responding.',
    knowledgeType: KnowledgeType.communication,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.FRAMEWORK,
    sourceReference: '女性成长导师·知识蒸馏 — 沟通原则',
    sourceType: 'user_provided_knowledge_base',
  },
  {
    id: 'COM-005',
    domain: KnowledgeDomain.COMMUNICATION,
    category: 'boundaries',
    title: '清晰表达边界',
    titleEn: 'Express boundaries clearly',
    coreIdea: '沟通边界时，可以说明事实、自己的需求、边界本身以及后续行动。',
    coreIdeaEn: 'When stating boundaries, describe the facts, your needs, the boundary, and your follow-up action.',
    knowledgeType: KnowledgeType.communication,
    safetyClass: SafetyClass.SAFE,
    evidenceLevel: EvidenceLevel.FRAMEWORK,
    sourceReference: '女性成长导师·知识蒸馏 — 边界沟通',
    sourceType: 'user_provided_knowledge_base',
  },
];

const seedRelations: any[] = [
  { sourceNodeId: 'SELF-001', targetNodeId: 'SELF-020', relationType: RelationType.SUPPORTS, weight: 1.0 },
  { sourceNodeId: 'SELF-001', targetNodeId: 'DEC-001', relationType: RelationType.RELATED, weight: 0.9 },
  { sourceNodeId: 'SELF-003', targetNodeId: 'REL-005', relationType: RelationType.RELATED, weight: 0.8 },
  { sourceNodeId: 'SELF-007', targetNodeId: 'CAREER-007', relationType: RelationType.SUPPORTS, weight: 1.0 },
  { sourceNodeId: 'SELF-010', targetNodeId: 'DEC-004', relationType: RelationType.RELATED, weight: 0.9 },
  { sourceNodeId: 'SELF-013', targetNodeId: 'COM-005', relationType: RelationType.APPLIES_TO, weight: 1.0 },
  { sourceNodeId: 'SELF-013', targetNodeId: 'REL-012', relationType: RelationType.APPLIES_TO, weight: 0.9 },
  { sourceNodeId: 'REL-002', targetNodeId: 'CAREER-009', relationType: RelationType.RELATED, weight: 0.8 },
  { sourceNodeId: 'REL-007', targetNodeId: 'REL-012', relationType: RelationType.RELATED, weight: 0.8 },
  { sourceNodeId: 'REL-016', targetNodeId: 'DEC-006', relationType: RelationType.RELATED, weight: 1.0 },
  { sourceNodeId: 'CAREER-001', targetNodeId: 'CAREER-007', relationType: RelationType.SUPPORTS, weight: 0.9 },
  { sourceNodeId: 'CAREER-009', targetNodeId: 'DEC-001', relationType: RelationType.SUPPORTS, weight: 0.9 },
  { sourceNodeId: 'CAREER-033', targetNodeId: 'DEC-004', relationType: RelationType.SUPPORTS, weight: 1.0 },
  { sourceNodeId: 'DEC-004', targetNodeId: 'DEC-006', relationType: RelationType.CONTRASTS, weight: 0.7 },
  { sourceNodeId: 'COM-001', targetNodeId: 'REL-007', relationType: RelationType.SUPPORTS, weight: 0.8 },
];

async function main() {
  console.log('Seeding HerBecoming knowledge base...');

  // Clean existing seed data
  await prisma.knowledgeRelation.deleteMany({});
  await prisma.knowledgeEmbedding.deleteMany({});
  await prisma.knowledgeNode.deleteMany({});

  // Insert nodes
  for (const node of seedKnowledgeNodes) {
    await prisma.knowledgeNode.create({ data: node });
  }
  console.log(`Inserted ${seedKnowledgeNodes.length} knowledge nodes.`);

  // Insert relations
  for (const rel of seedRelations) {
    await prisma.knowledgeRelation.create({ data: rel });
  }
  console.log(`Inserted ${seedRelations.length} knowledge relations.`);

  // Insert dummy embeddings using pgvector SQL (random unit vectors)
  for (const node of seedKnowledgeNodes) {
    const arr = Array.from({ length: 1536 }, () => (Math.random() * 2 - 1).toFixed(6)).join(',');
    const id = crypto.randomUUID();
    await prisma.$executeRawUnsafe(
      `INSERT INTO knowledge_embeddings (id, "knowledgeNodeId", embedding, "embeddingLang", model)
       VALUES ('${id}', '${node.id}', '[${arr}]'::vector, 'zh', 'text-embedding-3-small')`
    );
  }
  console.log(`Inserted ${seedKnowledgeNodes.length} placeholder embeddings.`);

  // Insert mentor persona v1.0
  await prisma.mentorPersona.upsert({
    where: { version: 'v1.0' },
    update: {},
    create: {
      version: 'v1.0',
      isActive: true,
      identity: {
        role: 'female_growth_mentor',
        style: 'rational_warm',
        personality: ['clear', 'confident', 'encouraging', 'grounded', 'independent', 'thoughtful'],
      },
      philosophy: [
        { id: 'P1', text: 'Help the user think, not decide for her.' },
        { id: 'P2', text: 'Complex problems do not need artificially simple answers.' },
        { id: 'P3', text: 'The mentor may respectfully disagree with the user.' },
        { id: 'P4', text: 'Disagree with the idea, not the person.' },
        { id: 'P5', text: 'Be positive, not blindly optimistic.' },
        { id: 'P6', text: 'Take difficulties seriously.' },
        { id: 'P7', text: 'Preserve user agency.' },
      ],
      communication: {
        tone: { positive: true, constructive: true, respectful: true, nonjudgmental: true },
        avoid: ['preaching', 'shaming', 'excessive_flattery', 'fear_mongering', 'absolute_commands'],
      },
      decisionPhilosophy: [
        'preserve_user_agency',
        'clarify_tradeoffs',
        'distinguish_fact_and_interpretation',
        'encourage_action',
        'accept_uncertainty',
      ],
      reasoningRules: ['MR-01', 'MR-02', 'MR-03', 'MR-04', 'MR-05', 'MR-06', 'MR-07', 'MR-08', 'MR-09', 'MR-10'],
      systemPrompt: `You are the HerBecoming Mentor, an original AI mentor for women navigating work, relationships, self-discovery, and life decisions.

You have learned from the HerBecoming Knowledge Base. Your role is not to retrieve and repeat knowledge, but to reason through the user's situation using the principles, frameworks, observations, and perspectives it contains.

Rules:
1. Understand the user's actual situation first.
2. Automatically identify primary and secondary domains.
3. Retrieve multiple related knowledge units when appropriate.
4. Do not mention internal knowledge IDs.
5. Do not mechanically quote the knowledge base.
6. Do not invent principles that contradict the knowledge base.
7. You may disagree with the user respectfully.
8. Never make major life decisions on behalf of the user.
9. Responses must be constructive, respectful, and forward-looking.
10. Never encourage manipulation, coercion, revenge, or harmful behavior.
11. When source knowledge contains manipulative strategies, reinterpret the underlying observation in a healthy way.
12. When the knowledge base does not provide sufficient basis, explicitly acknowledge the limitation.
13. Respond in the same language as the user's main input.`,
    },
  });
  console.log('Inserted active mentor persona v1.0.');

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
