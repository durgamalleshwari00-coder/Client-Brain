import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { HindsightClient } from "@vectorize-io/hindsight-client";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

const hindsight = new HindsightClient({
  baseUrl:
    process.env.HINDSIGHT_BASE_URL ||
    "https://api.hindsight.vectorize.io",
  apiKey: process.env.HINDSIGHT_API_KEY,
});

const BANK_ID =
  process.env.HINDSIGHT_BANK_ID || "client-brain";

const GROQ_API_KEY =
  process.env.GROQ_API_KEY;

/* =====================================================
   BASIC HEALTH CHECK
===================================================== */

app.get("/", (req, res) => {
  res.json({
    message: "Client Brain backend is running",
    hindsight: "connected",
  });
});

/* =====================================================
   GROQ HELPER
===================================================== */

async function callGroq(prompt) {
  if (!GROQ_API_KEY) {
    throw new Error(
      "GROQ_API_KEY is missing in backend/.env"
    );
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              "You extract structured client information from conversations. Return ONLY valid JSON. Never add markdown.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        "Groq API request failed."
    );
  }

  return (
    data?.choices?.[0]?.message?.content ||
    ""
  );
}

/* =====================================================
   JSON PARSER
===================================================== */

function parseJson(text) {
  let cleaned = String(text || "").trim();

  cleaned = cleaned
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
      return JSON.parse(
        cleaned.slice(start, end + 1)
      );
    }

    throw new Error(
      "Groq returned invalid JSON."
    );
  }
}

/* =====================================================
   EXTRACT CLIENT INFORMATION
===================================================== */

async function extractConversation(
  conversation
) {
  const prompt = `
Analyze the following client conversation.

Extract the important long-term client memory.

Return exactly this JSON structure:

{
  "clientName": "",
  "project": "",
  "originalBudget": "",
  "finalPrice": "",
  "deadline": "",
  "technology": "",
  "status": "",
  "decision": "",
  "communicationPreference": "",
  "changes": []
}

Rules:

1. clientName:
   Identify the client's name.

2. project:
   Identify the project or work being discussed.

3. originalBudget:
   The client's INITIAL budget before negotiation.

4. finalPrice:
   The FINAL price the client agreed to.

5. deadline:
   The latest agreed deadline.

6. technology:
   Technology/platform mentioned.

7. status:
   Example: agreed, pending, active, completed.

8. decision:
   The important final decision/agreement.

9. communicationPreference:
   How the client prefers communication.

10. changes:
   Only include changes explicitly found WITHIN this conversation.

Each change must have:

{
  "field": "",
  "oldValue": "",
  "newValue": "",
  "description": ""
}

Conversation:

${conversation}
`;

  const raw = await callGroq(prompt);

  return parseJson(raw);
}

/* =====================================================
   COMPARE OLD MEMORY WITH NEW CONVERSATION
===================================================== */

async function compareMemory(
  previousMemory,
  currentAnalysis
) {
  const prompt = `
Compare the previous client memory with the new
conversation analysis.

Previous memory:

${previousMemory}

New analysis:

${JSON.stringify(
  currentAnalysis,
  null,
  2
)}

Return ONLY this JSON:

{
  "changes": []
}

Each detected change must be:

{
  "field": "",
  "oldValue": "",
  "newValue": "",
  "description": ""
}

Important:

- Only report real changes.
- Do not report empty fields.
- Do not treat an original budget and final agreed price
  as a change unless the previous memory specifically
  contained a different final agreed price.
- Focus on important client facts such as:
  price, deadline, technology, project, status,
  communication preference.
`;

  const raw = await callGroq(prompt);

  return parseJson(raw);
}

/* =====================================================
   ANALYZE CONVERSATION
===================================================== */

app.post("/api/analyze", async (req, res) => {
  try {
    /*
      IMPORTANT:
      Accept BOTH names so this error can never happen
      again if an older frontend is still running.
    */

    const conversation =
      req.body?.conversation ||
      req.body?.transcript ||
      "";

    if (!conversation.trim()) {
      return res.status(400).json({
        error:
          "Conversation transcript is required.",
      });
    }

    console.log(
      "\n=============================="
    );

    console.log(
      "Analyzing conversation..."
    );

    console.log(
      "Characters:",
      conversation.length
    );

    /* STEP 1 — Extract current conversation */

    const analysis =
      await extractConversation(
        conversation
      );

    let previousMemory = "";
    let hasPreviousMemory = false;

    /* STEP 2 — Recall previous Hindsight memory */

    try {
      const clientName =
        analysis.clientName || "";

      const recallQuery = clientName
        ? `What does Client Brain remember about ${clientName}?`
        : "What does Client Brain remember about this client?";

      const recalled =
        await hindsight.recall(
          BANK_ID,
          recallQuery
        );

      const results =
        recalled?.results || [];

      if (results.length > 0) {
        previousMemory = results
          .map(
            (item) =>
              item?.text ||
              item?.content ||
              item?.memory ||
              ""
          )
          .filter(Boolean)
          .join("\n\n");

        hasPreviousMemory =
          Boolean(previousMemory);
      }
    } catch (memoryError) {
      console.error(
        "Hindsight recall error:",
        memoryError.message
      );
    }

    /* STEP 3 — Compare old and new memory */

    if (
      hasPreviousMemory &&
      previousMemory.trim()
    ) {
      try {
        const comparison =
          await compareMemory(
            previousMemory,
            analysis
          );

        analysis.changes =
          comparison.changes || [];
      } catch (compareError) {
        console.error(
          "Memory comparison error:",
          compareError.message
        );

        analysis.changes =
          analysis.changes || [];
      }
    }

    console.log(
      "Analysis:",
      JSON.stringify(
        analysis,
        null,
        2
      )
    );

    console.log(
      "==============================\n"
    );

    return res.json({
      success: true,
      analysis,
      previousMemory,
      hasPreviousMemory,
    });
  } catch (error) {
    console.error(
      "ANALYZE ERROR:",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Failed to analyze conversation.",
    });
  }
});

/* =====================================================
   SAVE MEMORY TO HINDSIGHT
===================================================== */

app.post("/api/memory", async (req, res) => {
  try {
    const content =
      req.body?.content || "";

    if (!content.trim()) {
      return res.status(400).json({
        error:
          "Memory content is required.",
      });
    }

    const timestamp =
      new Date().toISOString();

    const memoryWithTimestamp = `
[Saved: ${timestamp}]

${content}
`;

    const result =
      await hindsight.retain(
        BANK_ID,
        memoryWithTimestamp
      );

    console.log(
      "Memory saved to Hindsight."
    );

    return res.json({
      success: true,
      message:
        "Memory saved successfully to Hindsight.",
      result,
    });
  } catch (error) {
    console.error(
      "MEMORY ERROR:",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Failed to save memory.",
    });
  }
});

/* =====================================================
   RECALL MEMORY
===================================================== */

app.post("/api/recall", async (req, res) => {
  try {
    const query =
      req.body?.query || "";

    if (!query.trim()) {
      return res.status(400).json({
        error:
          "Memory query is required.",
      });
    }

    const result =
      await hindsight.recall(
        BANK_ID,
        query
      );

    return res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(
      "RECALL ERROR:",
      error
    );

    return res.status(500).json({
      error:
        error.message ||
        "Failed to recall memory.",
    });
  }
});

/* =====================================================
   START SERVER
===================================================== */

app.listen(PORT, () => {
  console.log(
    `Client Brain backend is running on http://localhost:${PORT}`
  );

  console.log(
    `Hindsight bank: ${BANK_ID}`
  );
});