import {
  CUSTOMERS,
  findCustomer,
  scoreRecommendations,
  type Customer,
  type RecommendResponse,
  type Recommendation,
} from "@/lib/sample-data";

const API_URL_KEY = "aiprs.flaskApiUrl";
export const DEFAULT_API_URL = "http://127.0.0.1:5000";

export function getApiUrl(): string {
  if (typeof window === "undefined") return DEFAULT_API_URL;
  return window.localStorage.getItem(API_URL_KEY) ?? DEFAULT_API_URL;
}

export function setApiUrl(url: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(API_URL_KEY, url.replace(/\/$/, ""));
}

export class RecommendError extends Error {
  kind: "unknown-customer" | "invalid-input" | "prediction-failed";
  constructor(kind: RecommendError["kind"], message: string) {
    super(message);
    this.kind = kind;
  }
}

export type ModelStatus = {
  online: boolean;
  modelLoaded: boolean;
  detail: string;
};

/** Probes the local Flask service that hosts the trained Keras model. */
export async function checkModelService(): Promise<ModelStatus> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${getApiUrl()}/health`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as { model_loaded?: boolean; encoders_loaded?: boolean };
    return {
      online: true,
      modelLoaded: Boolean(body.model_loaded && body.encoders_loaded),
      detail: body.model_loaded
        ? "Connected to the local model service — predictions come from recommendation_ann.keras."
        : "Model service is running but the .keras / .pkl files were not found in backend/models.",
    };
  } catch {
    return {
      online: false,
      modelLoaded: false,
      detail: "Local model service offline — using the built-in sample recommendation engine.",
    };
  }
}

type FlaskRecommendPayload = {
  customer?: Partial<Customer> & { id?: string };
  recommendations?: Array<{
    product_code?: string;
    productCode?: string;
    product_name?: string;
    productName?: string;
    category?: string;
    score?: number;
    confidence?: number;
    reason?: string;
  }>;
  error?: string;
};

function normalise(payload: FlaskRecommendPayload, fallback: Customer): Recommendation[] {
  const items = payload.recommendations ?? [];
  return items.map((item) => {
    const score = Number(item.score ?? 0);
    return {
      productCode: item.product_code ?? item.productCode ?? "UNKNOWN",
      productName: item.product_name ?? item.productName ?? "Unknown product",
      category: item.category ?? "General",
      score: Number(score.toFixed(4)),
      confidence: Number((item.confidence ?? score * 100).toFixed(1)),
      reason:
        item.reason ??
        "Recommended because customers with similar purchase history also bought this product.",
    };
  }).filter((r) => r.productCode !== "UNKNOWN" || fallback.id.length > 0);
}

/**
 * Requests recommendations from the Flask + Keras service when it is running,
 * otherwise falls back to the offline sample engine so the UI always works.
 */
export async function recommend(customerIdRaw: string, topK = 6): Promise<RecommendResponse> {
  const customerId = customerIdRaw.trim();
  if (!customerId) throw new RecommendError("invalid-input", "Please enter a customer ID.");
  if (!/^[A-Za-z0-9\-_ ]{1,40}$/.test(customerId)) {
    throw new RecommendError("invalid-input", "Customer ID contains unsupported characters.");
  }

  const started = Date.now();
  const local = findCustomer(customerId);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${getApiUrl()}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: customerId, top_k: topK }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const body = (await res.json()) as FlaskRecommendPayload;
    if (res.status === 404) {
      throw new RecommendError("unknown-customer", body.error ?? "Customer not found in the trained encoder.");
    }
    if (!res.ok) {
      throw new RecommendError("prediction-failed", body.error ?? `Model service error (${res.status}).`);
    }
    const customer: Customer = local ?? {
      id: customerId,
      name: payloadName(body) ?? `Customer ${customerId}`,
      country: "Unknown",
      segment: "New",
      firstPurchase: "—",
      lastPurchase: "—",
      totalOrders: 0,
      totalSpend: 0,
      purchases: [],
    };
    const recommendations = normalise(body, customer);
    if (recommendations.length === 0) {
      throw new RecommendError("prediction-failed", "The model returned no recommendations.");
    }
    return {
      source: "flask-model",
      customer,
      recommendations,
      generatedAt: new Date().toISOString(),
      elapsedMs: Date.now() - started,
    };
  } catch (error) {
    if (error instanceof RecommendError && error.kind !== "prediction-failed") throw error;

    // Offline path: the sample engine only knows the bundled demo customers.
    if (!local) {
      throw new RecommendError(
        "unknown-customer",
        `Customer "${customerId}" was not found. Start the local model service or try a demo ID such as ${CUSTOMERS[0]!.id}.`,
      );
    }
    return {
      source: "sample-engine",
      customer: local,
      recommendations: scoreRecommendations(local, topK),
      generatedAt: new Date().toISOString(),
      elapsedMs: Date.now() - started,
    };
  }
}

function payloadName(body: FlaskRecommendPayload): string | undefined {
  const name = body.customer?.name;
  return typeof name === "string" ? name : undefined;
}
