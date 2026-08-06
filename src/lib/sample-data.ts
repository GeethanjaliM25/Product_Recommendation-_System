/**
 * Realistic sample dataset used by the UI when the local Flask model service
 * (see /backend) is not reachable. Shapes match the Flask JSON responses.
 */

export type Product = {
  code: string;
  name: string;
  category: string;
  unitPrice: number;
  popularity: number;
  recommendationCount: number;
  rating: number;
  isNew?: boolean;
};

export type Purchase = {
  invoice: string;
  date: string;
  productCode: string;
  productName: string;
  quantity: number;
  amount: number;
};

export type Customer = {
  id: string;
  name: string;
  country: string;
  segment: "Champion" | "Loyal" | "Potential" | "At Risk" | "New";
  firstPurchase: string;
  lastPurchase: string;
  totalOrders: number;
  totalSpend: number;
  purchases: Purchase[];
};

export type Recommendation = {
  productCode: string;
  productName: string;
  category: string;
  score: number;
  confidence: number;
  reason: string;
};

export type RecommendResponse = {
  source: "flask-model" | "sample-engine";
  customer: Customer;
  recommendations: Recommendation[];
  generatedAt: string;
  elapsedMs: number;
};

export const PRODUCTS: Product[] = [
  { code: "P-85123A", name: "White Hanging Heart T-Light Holder", category: "Home Decor", unitPrice: 2.55, popularity: 98, recommendationCount: 1428, rating: 4.8 },
  { code: "P-71053", name: "Ceramic Storage Jar Set", category: "Kitchen", unitPrice: 6.75, popularity: 94, recommendationCount: 1211, rating: 4.6 },
  { code: "P-84406B", name: "Cream Cupid Hearts Coat Hanger", category: "Home Decor", unitPrice: 3.4, popularity: 91, recommendationCount: 1104, rating: 4.5 },
  { code: "P-22752", name: "Set Of 6 Retro Spice Tins", category: "Kitchen", unitPrice: 7.95, popularity: 88, recommendationCount: 987, rating: 4.7 },
  { code: "P-21730", name: "Glass Star Frosted T-Light Holder", category: "Lighting", unitPrice: 4.25, popularity: 86, recommendationCount: 942, rating: 4.4 },
  { code: "P-47566", name: "Party Bunting Deluxe", category: "Party", unitPrice: 4.65, popularity: 84, recommendationCount: 903, rating: 4.6 },
  { code: "P-85099B", name: "Jumbo Bag Red Retrospot", category: "Bags", unitPrice: 2.08, popularity: 82, recommendationCount: 874, rating: 4.5 },
  { code: "P-20725", name: "Lunch Bag Red Retrospot", category: "Bags", unitPrice: 1.65, popularity: 80, recommendationCount: 812, rating: 4.3 },
  { code: "P-23203", name: "Jumbo Bag Vintage Doily", category: "Bags", unitPrice: 2.08, popularity: 77, recommendationCount: 766, rating: 4.2, isNew: true },
  { code: "P-22423", name: "Regency Cakestand 3 Tier", category: "Kitchen", unitPrice: 12.75, popularity: 95, recommendationCount: 1320, rating: 4.9 },
  { code: "P-22697", name: "Green Regency Teacup And Saucer", category: "Kitchen", unitPrice: 2.95, popularity: 74, recommendationCount: 702, rating: 4.4 },
  { code: "P-22910", name: "Paper Chain Kit Vintage Christmas", category: "Seasonal", unitPrice: 2.95, popularity: 71, recommendationCount: 664, rating: 4.1, isNew: true },
  { code: "P-21212", name: "Pack Of 72 Retrospot Cake Cases", category: "Party", unitPrice: 0.55, popularity: 69, recommendationCount: 611, rating: 4.0 },
  { code: "P-22960", name: "Jam Making Set With Jars", category: "Kitchen", unitPrice: 4.25, popularity: 66, recommendationCount: 578, rating: 4.3, isNew: true },
  { code: "P-23298", name: "Spotty Bunting Garden Set", category: "Garden", unitPrice: 5.45, popularity: 63, recommendationCount: 522, rating: 4.2 },
  { code: "P-22086", name: "Paper Chain Kit 50's Christmas", category: "Seasonal", unitPrice: 2.95, popularity: 61, recommendationCount: 498, rating: 4.1 },
];

const SEGMENTS: Customer["segment"][] = ["Champion", "Loyal", "Potential", "At Risk", "New"];
const COUNTRIES = ["United Kingdom", "Germany", "France", "Netherlands", "India", "Australia", "Spain", "Ireland"];
const NAMES = [
  "Aarav Mehta", "Isabella Rossi", "Liam O'Connor", "Sofia Alvarez", "Noah Fischer", "Priya Nair",
  "Emma Laurent", "Lucas Silva", "Amelia Clarke", "Rohan Kapoor", "Chloe Dubois", "Mateo Rivera",
  "Hannah Weber", "Arjun Reddy", "Olivia Bennett", "Elena Petrova", "Daniel Kim", "Meera Iyer",
  "Thomas Novak", "Grace Sullivan", "Ananya Sharma", "Felix Braun", "Zara Ahmed", "Oscar Lindqvist",
];

/** Deterministic pseudo-random so charts and lists never flicker between renders. */
function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hash(text: string) {
  let h = 7;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) % 1000000007;
  return h;
}

function buildCustomer(index: number): Customer {
  const id = String(12346 + index * 7);
  const rand = seeded(hash(id));
  const purchaseCount = 4 + Math.floor(rand() * 9);
  const purchases: Purchase[] = [];
  for (let i = 0; i < purchaseCount; i += 1) {
    const product = PRODUCTS[Math.floor(rand() * PRODUCTS.length)]!;
    const quantity = 1 + Math.floor(rand() * 12);
    const month = 1 + Math.floor(rand() * 12);
    const day = 1 + Math.floor(rand() * 27);
    purchases.push({
      invoice: `INV-${5361 + index * 13 + i}`,
      date: `2025-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      productCode: product.code,
      productName: product.name,
      quantity,
      amount: Number((quantity * product.unitPrice).toFixed(2)),
    });
  }
  purchases.sort((a, b) => a.date.localeCompare(b.date));
  const totalSpend = Number(purchases.reduce((sum, p) => sum + p.amount, 0).toFixed(2));

  return {
    id,
    name: NAMES[index % NAMES.length]!,
    country: COUNTRIES[Math.floor(rand() * COUNTRIES.length)]!,
    segment: SEGMENTS[Math.floor(rand() * SEGMENTS.length)]!,
    firstPurchase: purchases[0]!.date,
    lastPurchase: purchases[purchases.length - 1]!.date,
    totalOrders: purchases.length,
    totalSpend,
    purchases,
  };
}

export const CUSTOMERS: Customer[] = Array.from({ length: 24 }, (_, i) => buildCustomer(i));

export function findCustomer(customerId: string): Customer | undefined {
  const clean = customerId.trim();
  return CUSTOMERS.find((c) => c.id === clean || c.name.toLowerCase() === clean.toLowerCase());
}

/**
 * Collaborative-filtering style scoring used as the offline fallback. Mirrors
 * the ranked output shape produced by the Keras ANN in /backend/app.py.
 */
export function scoreRecommendations(customer: Customer, topK = 6): Recommendation[] {
  const purchased = new Set(customer.purchases.map((p) => p.productCode));
  const categoryWeight = new Map<string, number>();
  customer.purchases.forEach((p) => {
    const product = PRODUCTS.find((x) => x.code === p.productCode);
    if (!product) return;
    categoryWeight.set(product.category, (categoryWeight.get(product.category) ?? 0) + p.quantity);
  });
  const maxWeight = Math.max(1, ...categoryWeight.values());
  const rand = seeded(hash(customer.id) + 17);

  return PRODUCTS.filter((p) => !purchased.has(p.code))
    .map((product) => {
      const affinity = (categoryWeight.get(product.category) ?? 0) / maxWeight;
      const raw = 0.42 * affinity + 0.4 * (product.popularity / 100) + 0.18 * rand();
      const score = Number(Math.min(0.995, raw).toFixed(4));
      return {
        productCode: product.code,
        productName: product.name,
        category: product.category,
        score,
        confidence: Number((score * 100).toFixed(1)),
        reason: "Recommended because customers with similar purchase history also bought this product.",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

export const MONTHLY_RECOMMENDATIONS = [
  { month: "Jan", recommendations: 820, accepted: 402 },
  { month: "Feb", recommendations: 932, accepted: 471 },
  { month: "Mar", recommendations: 1010, accepted: 528 },
  { month: "Apr", recommendations: 1180, accepted: 604 },
  { month: "May", recommendations: 1290, accepted: 690 },
  { month: "Jun", recommendations: 1402, accepted: 742 },
  { month: "Jul", recommendations: 1518, accepted: 828 },
  { month: "Aug", recommendations: 1644, accepted: 902 },
  { month: "Sep", recommendations: 1731, accepted: 961 },
  { month: "Oct", recommendations: 1890, accepted: 1044 },
  { month: "Nov", recommendations: 2120, accepted: 1188 },
  { month: "Dec", recommendations: 2340, accepted: 1332 },
];

export const PURCHASE_FREQUENCY = [
  { bucket: "1-2", customers: 320 },
  { bucket: "3-5", customers: 512 },
  { bucket: "6-9", customers: 408 },
  { bucket: "10-14", customers: 236 },
  { bucket: "15+", customers: 118 },
];

export const CUSTOMER_SEGMENTS = [
  { name: "Champion", value: 24 },
  { name: "Loyal", value: 31 },
  { name: "Potential", value: 19 },
  { name: "At Risk", value: 15 },
  { name: "New", value: 11 },
];

export const SCORE_DISTRIBUTION = [
  { band: "0.5-0.6", count: 142 },
  { band: "0.6-0.7", count: 288 },
  { band: "0.7-0.8", count: 466 },
  { band: "0.8-0.9", count: 612 },
  { band: "0.9-1.0", count: 344 },
];

export const PRODUCT_PERFORMANCE = [
  { metric: "Relevance", value: 92 },
  { metric: "Conversion", value: 78 },
  { metric: "Coverage", value: 84 },
  { metric: "Novelty", value: 66 },
  { metric: "Diversity", value: 73 },
  { metric: "Retention", value: 88 },
];

export const PURCHASE_BEHAVIOUR = MONTHLY_RECOMMENDATIONS.map((m, i) => ({
  month: m.month,
  basket: Number((18 + i * 1.6 + (i % 3) * 2.4).toFixed(1)),
  repeat: Number((11 + i * 1.1 + (i % 4) * 1.8).toFixed(1)),
}));

export const CUSTOMER_SCATTER = CUSTOMERS.map((c) => ({
  orders: c.totalOrders,
  spend: Number(c.totalSpend.toFixed(2)),
  id: c.id,
}));

export const ACTIVITY_HEATMAP = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, d) => ({
  day,
  hours: Array.from({ length: 12 }, (_, h) => {
    const rand = seeded(hash(day) + h * 31);
    return { hour: `${(h * 2).toString().padStart(2, "0")}:00`, value: Math.round(rand() * 100) };
  }),
}));

export const RECENT_ACTIVITY = [
  { customer: "12437", action: "Generated 6 recommendations", time: "2 minutes ago" },
  { customer: "12591", action: "Saved Regency Cakestand 3 Tier", time: "14 minutes ago" },
  { customer: "12388", action: "Exported PDF report", time: "38 minutes ago" },
  { customer: "12500", action: "Generated 6 recommendations", time: "1 hour ago" },
  { customer: "12472", action: "Purchase history reviewed", time: "3 hours ago" },
];

export const MODEL_INFO = {
  name: "recommendation_ann.keras",
  type: "Artificial Neural Network",
  problem: "Recommendation System",
  architecture: "Neural Collaborative Filtering (dual embedding + MLP)",
  optimizer: "Adam (lr = 0.001)",
  loss: "Binary Crossentropy",
  activation: "ReLU",
  outputActivation: "Sigmoid",
  tuning: "Early Stopping (patience = 5, restore best weights)",
  epochs: 50,
  batchSize: 256,
  trainingAccuracy: 0.9412,
  validationAccuracy: 0.9068,
  auc: 0.947,
  parameters: "1,284,737",
  layers: [
    { name: "customer_input", type: "InputLayer", shape: "(None, 1)", params: 0 },
    { name: "product_input", type: "InputLayer", shape: "(None, 1)", params: 0 },
    { name: "customer_embedding", type: "Embedding", shape: "(None, 1, 50)", params: 217150 },
    { name: "product_embedding", type: "Embedding", shape: "(None, 1, 50)", params: 191500 },
    { name: "concatenate", type: "Concatenate", shape: "(None, 100)", params: 0 },
    { name: "dense_1", type: "Dense (ReLU)", shape: "(None, 128)", params: 12928 },
    { name: "dropout_1", type: "Dropout (0.3)", shape: "(None, 128)", params: 0 },
    { name: "dense_2", type: "Dense (ReLU)", shape: "(None, 64)", params: 8256 },
    { name: "dense_3", type: "Dense (ReLU)", shape: "(None, 32)", params: 2080 },
    { name: "output", type: "Dense (Sigmoid)", shape: "(None, 1)", params: 33 },
  ],
};
