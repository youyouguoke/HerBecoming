import * as fs from 'fs';
import * as path from 'path';

const seedPath = path.resolve(__dirname, '../prisma/seed.ts');
const seedText = fs.readFileSync(seedPath, 'utf-8');

const validDomains = ['SELF', 'RELATIONSHIPS', 'CAREER', 'LIFE_DECISIONS', 'COMMUNICATION'];
const validKnowledgeTypes = ['principle', 'concept', 'framework', 'observation', 'case_pattern', 'communication', 'reflection', 'quote', 'safety_rule'];
const validSafetyClasses = ['SAFE', 'CONTEXTUAL', 'REFRAME', 'DO_NOT_GENERATE'];
const validEvidenceLevels = ['SOURCE_PRINCIPLE', 'OBSERVATION', 'FRAMEWORK', 'CASE_PATTERN', 'OPINION', 'SCRIPT', 'SAFETY_RULE'];
const validRelationTypes = ['RELATED', 'SUPPORTS', 'CONTRASTS', 'PREREQUISITE', 'REFRAMES', 'APPLIES_TO', 'EXAMPLE_OF', 'DERIVED_FROM'];

function extractArrayBlock(label: string): string {
  const regex = new RegExp(`const ${label}\\s*:\\s*any\\[\\]\\s*=\\s*\\[([\\s\\S]*?)\\];`);
  const match = seedText.match(regex);
  if (!match) throw new Error(`Could not find ${label} array in seed.ts`);
  return match[1];
}

interface NodeData {
  id: string;
  domain: string;
  knowledgeType: string;
  safetyClass: string;
  evidenceLevel: string;
  title?: string;
  coreIdea?: string;
  sourceReference?: string;
  sourceType?: string;
}

function parseNodes(text: string): NodeData[] {
  const nodes: NodeData[] = [];
  const entries = text.split(/(?=\{\s*id\s*:)/g).filter((s) => s.trim().startsWith('{'));
  for (const raw of entries) {
    const id = raw.match(/id\s*:\s*['"]([^'"]+)['"]/)?.[1];
    const domain = raw.match(/domain\s*:\s*KnowledgeDomain\.([A-Z_]+)/)?.[1];
    const knowledgeType = raw.match(/knowledgeType\s*:\s*KnowledgeType\.([a-z_]+)/)?.[1];
    const safetyClass = raw.match(/safetyClass\s*:\s*SafetyClass\.([A-Z_]+)/)?.[1];
    const evidenceLevel = raw.match(/evidenceLevel\s*:\s*EvidenceLevel\.([A-Z_]+)/)?.[1];
    const title = raw.match(/title\s*:\s*['"]([^'"]+)['"]/)?.[1];
    const coreIdea = raw.match(/coreIdea\s*:\s*['"]([^'"]+)['"]/)?.[1];
    const sourceReference = raw.match(/sourceReference\s*:\s*['"]([^'"]+)['"]/)?.[1];
    const sourceType = raw.match(/sourceType\s*:\s*['"]([^'"]+)['"]/)?.[1];
    if (!id) continue;
    nodes.push({ id, domain: domain ?? '', knowledgeType: knowledgeType ?? '', safetyClass: safetyClass ?? '', evidenceLevel: evidenceLevel ?? '', title, coreIdea, sourceReference, sourceType });
  }
  return nodes;
}

function parseRelations(text: string, nodeIds: Set<string>): string[] {
  const errors: string[] = [];
  const relEntries = text.split(/\},?\s*\n?\s*\{/g).map((s) => s.trim()).filter((s) => s.includes('sourceNodeId'));
  for (let i = 0; i < relEntries.length; i++) {
    const raw = relEntries[i];
    const source = raw.match(/sourceNodeId\s*:\s*['"]([^'"]+)['"]/)?.[1];
    const target = raw.match(/targetNodeId\s*:\s*['"]([^'"]+)['"]/)?.[1];
    const relationType = raw.match(/relationType\s*:\s*RelationType\.([A-Z_]+)/)?.[1];
    const weight = raw.match(/weight\s*:\s*([\d.]+)/)?.[1];

    if (!source || !nodeIds.has(source)) errors.push(`Relation ${i}: sourceNodeId "${source}" not found`);
    if (!target || !nodeIds.has(target)) errors.push(`Relation ${i}: targetNodeId "${target}" not found`);
    if (!relationType || !validRelationTypes.includes(relationType)) errors.push(`Relation ${i}: invalid relationType "${relationType}"`);
    if (weight === undefined || isNaN(Number(weight)) || Number(weight) < 0 || Number(weight) > 1) {
      errors.push(`Relation ${i}: invalid weight "${weight}"`);
    }
  }
  return errors;
}

const nodesText = extractArrayBlock('seedKnowledgeNodes');
const relationsText = extractArrayBlock('seedRelations');
const nodes = parseNodes(nodesText);
const nodeIds = new Set(nodes.map((n) => n.id));

const errors: string[] = [];
for (const node of nodes) {
  if (!node.id) errors.push('Found node with missing id');
  if (!validDomains.includes(node.domain)) errors.push(`${node.id}: invalid domain "${node.domain}"`);
  if (!validKnowledgeTypes.includes(node.knowledgeType)) errors.push(`${node.id}: invalid knowledgeType "${node.knowledgeType}"`);
  if (!validSafetyClasses.includes(node.safetyClass)) errors.push(`${node.id}: invalid safetyClass "${node.safetyClass}"`);
  if (!validEvidenceLevels.includes(node.evidenceLevel)) errors.push(`${node.id}: invalid evidenceLevel "${node.evidenceLevel}"`);
  if (!node.title) errors.push(`${node.id}: missing title`);
  if (!node.coreIdea) errors.push(`${node.id}: missing coreIdea`);
  if (!node.sourceReference) errors.push(`${node.id}: missing sourceReference`);
  if (!node.sourceType) errors.push(`${node.id}: missing sourceType`);
}

if (new Set(nodes.map((n) => n.id)).size !== nodes.length) {
  const seen = new Set<string>();
  for (const node of nodes) {
    if (seen.has(node.id)) errors.push(`Duplicate id: ${node.id}`);
    seen.add(node.id);
  }
}

errors.push(...parseRelations(relationsText, nodeIds));

const domainCounts: Record<string, number> = {};
for (const d of validDomains) domainCounts[d] = 0;
for (const node of nodes) {
  domainCounts[node.domain] = (domainCounts[node.domain] || 0) + 1;
}

const relationCount = relationsText.split(/\},?\s*\n?\s*\{/g).filter((s) => s.includes('sourceNodeId')).length;

console.log('Total nodes:', nodes.length);
console.log('Per-domain counts:');
for (const domain of validDomains) {
  console.log(`  ${domain}: ${domainCounts[domain]}`);
}
console.log('Total relations:', relationCount);

if (errors.length > 0) {
  console.error('\nVerification failed:');
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

console.log('\nVerification passed.');
