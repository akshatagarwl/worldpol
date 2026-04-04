# Related Work

Prior art in multilingual LLM bias evaluation. These papers explore similar territory to worldpol but none provide a **live, interactive observatory** comparing multiple models × languages × topics systematically.

---

## Directly Related

### 1. Do Political Opinions Transfer Between Western Languages?

- **Authors:** Franziska Weeber, Tanise Ceron, Sebastian Padó
- **Published:** 2025-08-07
- **arXiv:** [2508.05553](https://arxiv.org/abs/2508.05553)
- **Relevance:** ⭐⭐⭐⭐⭐ — Most similar to worldpol. Tests whether political opinions in multilingual LLMs differ across languages.
- **Abstract:** Public opinion surveys show cross-cultural differences in political opinions between socio-cultural contexts. However, there is no clear evidence whether these differences translate to cross-lingual differences in multilingual large language models (MLLMs). We analyze whether opinions transfer between Western languages in both unaligned and aligned MLLMs.
- **Gap:** Limited to Western languages only. Static analysis, not a living tool.

### 2. On the Alignment of Large Language Models with Global Human Opinion

- **Authors:** Yang Liu, Masahiro Kaneko, Chenhui Chu
- **Published:** 2025-09-01
- **arXiv:** [2509.01418](https://arxiv.org/abs/2509.01418)
- **Relevance:** ⭐⭐⭐⭐⭐ — Tests LLM alignment with specific demographic groups across languages and historical periods.
- **Abstract:** Today's large language models (LLMs) are capable of supporting multilingual scenarios, allowing users to interact with LLMs in their native languages. When LLMs respond to subjective questions posed by users, they are expected to align with the views of specific demographic groups or historical periods.
- **Gap:** Frames as "alignment" not bias measurement. No interactive exploration.

### 3. Faux Polyglot: A Study on Information Disparity in Multilingual Large Language Models

- **Authors:** Nikhil Sharma, Kenton Murray, Ziang Xiao
- **Published:** 2024-07-07
- **arXiv:** [2407.05502](https://arxiv.org/abs/2407.05502)
- **Relevance:** ⭐⭐⭐⭐ — Studies how LLMs provide different information depending on the language of the query.
- **Abstract:** Although the multilingual capability of LLMs offers new opportunities to overcome the language barrier, do these capabilities translate into real-life scenarios where linguistic divide and knowledge conflicts between multilingual sources are known occurrences? In this paper, we studied LLM's linguistic divide and knowledge conflicts.
- **Gap:** Focuses on factual disparity rather than opinion/political bias.

### 4. Multilingual ≠ Multicultural: Evaluating Gaps Between Multilingual Capabilities and Cultural Alignment in LLMs

- **Authors:** Jonathan Rystrøm, Hannah Rose Kirk, Scott Hale
- **Published:** 2025-02-23
- **arXiv:** [2502.16534](https://arxiv.org/abs/2502.16534)
- **Relevance:** ⭐⭐⭐⭐ — Explicitly demonstrates that multilingual capability does not equal cultural alignment. Highlights US-centric bias.
- **Abstract:** Large Language Models (LLMs) are becoming increasingly capable across global languages. However, the ability to communicate across languages does not necessarily translate to appropriate cultural representations. A key concern is US-centric bias, where LLMs reflect US rather than local cultural values.
- **Gap:** Evaluative paper, not a tool. Good framing to cite though.

### 5. MENAValues: Evaluating Cultural Alignment and Multilingual Bias in LLMs

- **Authors:** Pardis Sadat Zahraei, Ehsaneddin Asgari
- **Published:** 2025-10-15
- **arXiv:** [2510.13154](https://arxiv.org/abs/2510.13154)
- **Relevance:** ⭐⭐⭐⭐ — Cultural alignment benchmark for the MENA region. Draws on established value surveys.
- **Abstract:** We introduce MENAValues, a novel benchmark designed to evaluate the cultural alignment and multilingual biases of large language models (LLMs) with respect to the beliefs and values of the Middle East and North Africa (MENA) region, an underrepresented area in current AI evaluation efforts.
- **Gap:** Region-specific (MENA only), not a cross-model observatory.

---

## Tangentially Related

### 6. CulFiT: A Fine-grained Cultural-aware LLM Training Paradigm via Multilingual Critique Data Synthesis

- **Authors:** Ruixiang Feng, Shen Gao, Xiuying Chen et al.
- **Published:** 2025-05-26
- **arXiv:** [2505.19484](https://arxiv.org/abs/2505.19484)
- **Relevance:** ⭐⭐⭐ — Training paradigm to reduce cultural bias. Demonstrates the problem worldpol measures.

### 7. Self-Alignment: Improving Alignment of Cultural Values in LLMs via In-Context Learning

- **Authors:** Rochelle Choenni, Ekaterina Shutova
- **Published:** 2024-08-29
- **arXiv:** [2408.16482](https://arxiv.org/abs/2408.16482)
- **Relevance:** ⭐⭐⭐ — Studies whether in-context learning can adjust LLM responses to cultural values. Potential mitigation strategy for biases worldpol detects.

### 8. Reasoning Boosts Opinion Alignment in LLMs

- **Authors:** Frédéric Berdoz, Yann Billeter, Yann Vonlanthen et al.
- **Published:** 2026-03-01
- **arXiv:** [2603.01214](https://arxiv.org/abs/2603.01214)
- **Relevance:** ⭐⭐⭐ — Shows that reasoning (CoT) changes opinion alignment. Implication: worldpol results may vary depending on prompting strategy.

### 9. Fine-Grained Interpretation of Political Opinions in Large Language Models

- **Authors:** Jingyu Hu, Mengyue Yang, Mengnan Du et al.
- **Published:** 2025-06-05
- **arXiv:** [2506.04774](https://arxiv.org/abs/2506.04774)
- **Relevance:** ⭐⭐⭐ — Probes LLM internal mechanisms for political opinions. Finds misalignment between responses and internal states.

---

## What Makes worldpol Different

| Dimension       | Existing Papers           | worldpol                            |
| --------------- | ------------------------- | ----------------------------------- |
| Format          | Static benchmark / paper  | Live interactive observatory        |
| Models          | 1–3 models per study      | 7 models compared side-by-side      |
| Languages       | Typically 2–5             | 7 languages systematically          |
| Topics          | Narrow (gender, politics) | 12 diverse topics                   |
| Reproducibility | Code dumps / datasets     | Running web app with cached results |
| Audience        | Researchers               | Researchers + general public        |
| Temporal        | Snapshot in time          | Can re-run as models update         |

The research space is active but fragmented. worldpol's unique contribution is being a **living, comparative tool** rather than a one-off evaluation.
