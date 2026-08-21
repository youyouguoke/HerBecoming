export interface EmbeddingProvider {
  readonly name: string;
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
}

const EMBEDDING_DIMENSIONS = 1536;
const OPENAI_EMBEDDING_MODEL = "text-embedding-3-small";

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  readonly name = "openai";
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = (baseUrl || "https://api.openai.com/v1").replace(/\/$/, "");
  }

  async embed(text: string): Promise<number[]> {
    const results = await this.embedBatch([text]);
    return results[0] ?? this.zeroVector();
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];

    const res = await fetch(`${this.baseUrl}/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_EMBEDDING_MODEL,
        input: texts,
        dimensions: EMBEDDING_DIMENSIONS,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenAI embeddings API error: ${res.status} ${text}`);
    }

    const data = (await res.json()) as {
      data: { index: number; embedding: number[] }[];
    };

    return data.data
      .sort((a, b) => a.index - b.index)
      .map((item) => {
        if (!item.embedding || item.embedding.length !== EMBEDDING_DIMENSIONS) {
          return this.zeroVector();
        }
        return item.embedding;
      });
  }

  private zeroVector(): number[] {
    return new Array(EMBEDDING_DIMENSIONS).fill(0);
  }
}

export class KeywordFallbackProvider implements EmbeddingProvider {
  readonly name = "keyword-fallback";

  async embed(text: string): Promise<number[]> {
    const keywords = extractKeywordsForEmbedding(text);
    const vector = new Array(EMBEDDING_DIMENSIONS).fill(0);

    for (const kw of keywords) {
      // Deterministic keyword hashing: spread each keyword across 3 buckets.
      const hash1 = djb2(kw);
      const hash2 = djb2(`${kw}:salt1`);
      const hash3 = djb2(`${kw}:salt2`);

      const idx1 = Math.abs(hash1) % EMBEDDING_DIMENSIONS;
      const idx2 = Math.abs(hash2) % EMBEDDING_DIMENSIONS;
      const idx3 = Math.abs(hash3) % EMBEDDING_DIMENSIONS;

      vector[idx1] = (vector[idx1] ?? 0) + 1.0;
      vector[idx2] = (vector[idx2] ?? 0) + 0.5;
      vector[idx3] = (vector[idx3] ?? 0) + 0.5;
    }

    return this.normalize(vector);
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.embed(t)));
  }

  private normalize(vector: number[]): number[] {
    const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
    if (norm === 0) return vector;
    return vector.map((v) => v / norm);
  }
}

class ResilientEmbeddingProvider implements EmbeddingProvider {
  readonly name = "resilient-openai";
  private primary: EmbeddingProvider;
  private fallback: KeywordFallbackProvider;

  constructor(primary: EmbeddingProvider) {
    this.primary = primary;
    this.fallback = new KeywordFallbackProvider();
  }

  async embed(text: string): Promise<number[]> {
    try {
      return await this.primary.embed(text);
    } catch (err) {
      console.warn(
        "[EmbeddingProvider] Primary provider failed, falling back to keyword embedding:",
        err
      );
      return this.fallback.embed(text);
    }
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    try {
      return await this.primary.embedBatch(texts);
    } catch (err) {
      console.warn(
        "[EmbeddingProvider] Primary provider failed, falling back to keyword embedding:",
        err
      );
      return this.fallback.embedBatch(texts);
    }
  }
}

export function getEmbeddingProvider(): EmbeddingProvider {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey && apiKey.trim().length > 0) {
    return new ResilientEmbeddingProvider(
      new OpenAIEmbeddingProvider(apiKey, process.env.OPENAI_BASE_URL)
    );
  }
  return new KeywordFallbackProvider();
}

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  return hash;
}

function extractKeywordsForEmbedding(text: string): string[] {
  const normalized = text
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 || /[\u4e00-\u9fa5]{2,}/.test(w));

  const compounds: string[] = [];
  for (let i = 0; i < normalized.length - 1; i++) {
    const char = normalized[i];
    if (/[\u4e00-\u9fa5]/.test(char)) {
      compounds.push(char + normalized[i + 1]);
    }
  }

  const unique = new Set<string>([...normalized, ...compounds]);
  return Array.from(unique);
}
