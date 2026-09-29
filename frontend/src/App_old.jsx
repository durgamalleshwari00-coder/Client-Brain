import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3001";

const initialClients = [
  {
    name: "Rahul Sharma",
    project: "WordPress Website",
    originalBudget: "₹40,000",
    finalPrice: "₹50,000",
    deadline: "October 15",
    technology: "WordPress",
    status: "Active",
    communicationPreference: "Short WhatsApp messages",
    memories: 6,
  },
  {
    name: "Priya Mehta",
    project: "Marketing Campaign",
    originalBudget: "₹30,000",
    finalPrice: "₹35,000",
    deadline: "November 5",
    technology: "Instagram / Meta",
    status: "Active",
    communicationPreference: "Detailed updates",
    memories: 4,
  },
  {
    name: "Arjun Kumar",
    project: "Mobile App",
    originalBudget: "₹75,000",
    finalPrice: "₹80,000",
    deadline: "December 10",
    technology: "Flutter",
    status: "Active",
    communicationPreference: "Email",
    memories: 5,
  },
];

const sampleRahulConversation = `Client: Rahul Sharma

Rahul: Hi, I wanted to give you an update about the WordPress website project.

Freelancer: Sure Rahul, what has changed?

Rahul: I have decided to add a few more features to the website.

Freelancer: Okay. The additional features will increase the project cost.

Rahul: That's fine. What will the new total be?

Freelancer: The updated project price will be ₹60,000.

Rahul: Okay, I agree to ₹60,000 for the project.

Freelancer: Great. So the updated final price is ₹60,000.

Rahul: Yes, please update it to ₹60,000.

Freelancer: Done. The WordPress website project is now ₹60,000.

Rahul: Perfect. Please continue with the project.`;

function App() {
  const [page, setPage] = useState("overview");

  const [clients, setClients] = useState(initialClients);

  const [selectedClient, setSelectedClient] =
    useState("Rahul Sharma");

  const [conversation, setConversation] =
    useState("");

  const [analysis, setAnalysis] =
    useState(null);

  const [detectedChanges, setDetectedChanges] =
    useState([]);

  const [previousMemory, setPreviousMemory] =
    useState("");

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [saveMessage, setSaveMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [memoryQuery, setMemoryQuery] =
    useState("");

  const [memoryAnswer, setMemoryAnswer] =
    useState("");

  const [isAsking, setIsAsking] =
    useState(false);

  const [messageClient, setMessageClient] =
    useState("Rahul Sharma");

  const [generatedMessage, setGeneratedMessage] =
    useState("");

  const [showAddClient, setShowAddClient] =
    useState(false);

  const [newClient, setNewClient] = useState({
    name: "",
    project: "",
    originalBudget: "",
    finalPrice: "",
    deadline: "",
    technology: "",
    status: "Active",
    communicationPreference: "",
  });

  const navItems = [
    {
      id: "overview",
      icon: "◉",
      label: "Overview",
    },
    {
      id: "clients",
      icon: "👥",
      label: "Clients",
    },
    {
      id: "chats",
      icon: "💬",
      label: "Chats",
    },
    {
      id: "memory",
      icon: "🧠",
      label: "Memory",
    },
    {
      id: "changes",
      icon: "⚡",
      label: "Changes",
    },
    {
      id: "messages",
      icon: "✉",
      label: "Messages",
    },
  ];

  const currentPage =
    navItems.find(
      (item) => item.id === page
    )?.label || "Overview";

  /* =====================================================
     ADD CLIENT
  ===================================================== */

  function handleAddClient() {
    if (!newClient.name.trim()) {
      alert("Please enter the client name.");
      return;
    }

    if (!newClient.project.trim()) {
      alert("Please enter the project name.");
      return;
    }

    const alreadyExists = clients.some(
      (client) =>
        client.name.toLowerCase() ===
        newClient.name.trim().toLowerCase()
    );

    if (alreadyExists) {
      alert(
        "A client with this name already exists."
      );
      return;
    }

    const clientToAdd = {
      name: newClient.name.trim(),
      project:
        newClient.project.trim() ||
        "New Project",
      originalBudget:
        newClient.originalBudget.trim() ||
        "Not specified",
      finalPrice:
        newClient.finalPrice.trim() ||
        "Not specified",
      deadline:
        newClient.deadline.trim() ||
        "Not specified",
      technology:
        newClient.technology.trim() ||
        "Not specified",
      status:
        newClient.status.trim() ||
        "Active",
      communicationPreference:
        newClient.communicationPreference.trim() ||
        "Not specified",
      memories: 0,
    };

    setClients((previousClients) => [
      ...previousClients,
      clientToAdd,
    ]);

    setSelectedClient(clientToAdd.name);
    setMessageClient(clientToAdd.name);

    setNewClient({
      name: "",
      project: "",
      originalBudget: "",
      finalPrice: "",
      deadline: "",
      technology: "",
      status: "Active",
      communicationPreference: "",
    });

    setShowAddClient(false);

    alert(
      `${clientToAdd.name} has been added successfully.`
    );
  }

  function cancelAddClient() {
    setShowAddClient(false);

    setNewClient({
      name: "",
      project: "",
      originalBudget: "",
      finalPrice: "",
      deadline: "",
      technology: "",
      status: "Active",
      communicationPreference: "",
    });
  }

  /* =====================================================
     ANALYZE CONVERSATION
  ===================================================== */

  async function analyzeConversation() {
    const cleanConversation =
      conversation.trim();

    if (!cleanConversation) {
      setErrorMessage(
        "Please paste a conversation transcript first."
      );
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage("");
    setSaveMessage("");
    setAnalysis(null);
    setDetectedChanges([]);
    setPreviousMemory("");

    try {
      const response = await fetch(
        `${API_URL}/api/analyze`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          /*
           * IMPORTANT:
           * The backend expects "conversation".
           * Do NOT change this to "transcript".
           */
          body: JSON.stringify({
            conversation:
              cleanConversation,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Backend returned an invalid response. Make sure the backend is running on http://localhost:3001."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to analyze conversation."
        );
      }

      const result =
        data.analysis || {};

      setAnalysis(result);

      setDetectedChanges(
        result.changes || []
      );

      setPreviousMemory(
        data.previousMemory || ""
      );

      if (result.clientName) {
        setSelectedClient(
          result.clientName
        );

        setMessageClient(
          result.clientName
        );
      }
    } catch (error) {
      console.error(
        "Analyze error:",
        error
      );

      if (
        error instanceof TypeError &&
        error.message
          .toLowerCase()
          .includes("fetch")
      ) {
        setErrorMessage(
          "Cannot connect to the backend. Please make sure the backend is running with: node server.js"
        );
      } else {
        setErrorMessage(
          error.message ||
            "Something went wrong while analyzing."
        );
      }
    } finally {
      setIsAnalyzing(false);
    }
  }

  /* =====================================================
     SAVE MEMORY
  ===================================================== */

  async function saveToHindsight() {
    if (!analysis) {
      return;
    }

    setIsSaving(true);
    setSaveMessage("");
    setErrorMessage("");

    const clientName =
      analysis.clientName ||
      selectedClient;

    const memoryContent = `
CLIENT: ${clientName}

Project: ${analysis.project || ""}

Original Budget: ${
      analysis.originalBudget || ""
    }

Final Agreed Price: ${
      analysis.finalPrice || ""
    }

Deadline: ${analysis.deadline || ""}

Technology / Platform: ${
      analysis.technology || ""
    }

Communication Preference:
${
      analysis.communicationPreference ||
      ""
    }

Status: ${analysis.status || ""}

Decision: ${
      analysis.decision || ""
    }

Changes Detected:
${JSON.stringify(
  analysis.changes || [],
  null,
  2
)}

This memory belongs specifically to client ${clientName}.
`;

    try {
      const response = await fetch(
        `${API_URL}/api/memory`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            content: memoryContent,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Backend returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save memory."
        );
      }

      setSaveMessage(
        "✓ Memory saved successfully to Hindsight."
      );

      setClients(
        (previousClients) => {
          const exists =
            previousClients.some(
              (client) =>
                client.name.toLowerCase() ===
                clientName.toLowerCase()
            );

          if (exists) {
            return previousClients.map(
              (client) => {
                if (
                  client.name.toLowerCase() ===
                  clientName.toLowerCase()
                ) {
                  return {
                    ...client,

                    project:
                      analysis.project ||
                      client.project,

                    originalBudget:
                      analysis.originalBudget ||
                      client.originalBudget,

                    finalPrice:
                      analysis.finalPrice ||
                      client.finalPrice,

                    deadline:
                      analysis.deadline ||
                      client.deadline,

                    technology:
                      analysis.technology ||
                      client.technology,

                    communicationPreference:
                      analysis.communicationPreference ||
                      client.communicationPreference,

                    status:
                      analysis.status ||
                      client.status,

                    memories:
                      (client.memories || 0) +
                      1,
                  };
                }

                return client;
              }
            );
          }

          return [
            ...previousClients,
            {
              name: clientName,

              project:
                analysis.project ||
                "New Project",

              originalBudget:
                analysis.originalBudget ||
                "Not specified",

              finalPrice:
                analysis.finalPrice ||
                "Not specified",

              deadline:
                analysis.deadline ||
                "Not specified",

              technology:
                analysis.technology ||
                "Not specified",

              status:
                analysis.status ||
                "Active",

              communicationPreference:
                analysis.communicationPreference ||
                "Not specified",

              memories: 1,
            },
          ];
        }
      );

      setSelectedClient(clientName);
      setMessageClient(clientName);
    } catch (error) {
      console.error(
        "Save memory error:",
        error
      );

      if (
        error instanceof TypeError &&
        error.message
          .toLowerCase()
          .includes("fetch")
      ) {
        setErrorMessage(
          "Cannot connect to the backend. Please make sure the backend is running."
        );
      } else {
        setErrorMessage(
          error.message ||
            "Could not save memory."
        );
      }
    } finally {
      setIsSaving(false);
    }
  }

  /* =====================================================
     ASK MEMORY
  ===================================================== */

  async function askMemory() {
    if (!memoryQuery.trim()) {
      return;
    }

    setIsAsking(true);
    setMemoryAnswer("");
    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/recall`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            query: memoryQuery.trim(),
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Backend returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not recall memory."
        );
      }

      const result =
        data?.result;

      const results =
        result?.results || [];

      if (results.length > 0) {
        const text = results
          .map(
            (item) =>
              item?.text ||
              item?.content ||
              item?.memory ||
              ""
          )
          .filter(Boolean)
          .join("\n\n");

        setMemoryAnswer(
          text ||
            "I found memory, but there was no readable text."
        );
      } else {
        const queryLower =
          memoryQuery.toLowerCase();

        const matchedClient =
          clients.find((client) =>
            queryLower.includes(
              client.name
                .toLowerCase()
                .split(" ")[0]
            )
          ) || clients[0];

        let answer =
          "I could not find a matching memory.";

        if (
          queryLower.includes("price") ||
          queryLower.includes("cost")
        ) {
          answer = `${matchedClient.name}'s current agreed price is ${matchedClient.finalPrice}. Original budget was ${matchedClient.originalBudget}.`;
        } else if (
          queryLower.includes(
            "budget"
          )
        ) {
          answer = `${matchedClient.name}'s original budget was ${matchedClient.originalBudget}, and the current agreed price is ${matchedClient.finalPrice}.`;
        } else if (
          queryLower.includes(
            "deadline"
          ) ||
          queryLower.includes("date")
        ) {
          answer = `${matchedClient.name}'s current deadline is ${matchedClient.deadline}.`;
        } else if (
          queryLower.includes(
            "technology"
          ) ||
          queryLower.includes("tech") ||
          queryLower.includes("platform")
        ) {
          answer = `${matchedClient.name}'s project uses ${matchedClient.technology}.`;
        } else if (
          queryLower.includes(
            "communication"
          ) ||
          queryLower.includes("whatsapp") ||
          queryLower.includes("email")
        ) {
          answer = `${matchedClient.name} prefers ${matchedClient.communicationPreference}.`;
        }

        setMemoryAnswer(answer);
      }
    } catch (error) {
      console.error(
        "Memory error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Could not recall memory."
      );
    } finally {
      setIsAsking(false);
    }
  }

  /* =====================================================
     PERSONALIZED MESSAGE
  ===================================================== */

  function generateMessage() {
    const client =
      clients.find(
        (item) =>
          item.name === messageClient
      );

    if (!client) {
      return;
    }

    const message = `Hi ${
      client.name.split(" ")[0]
    }, just a quick update on your ${client.project.toLowerCase()}. We are currently aligned on the ${client.finalPrice} budget with a ${client.deadline} deadline. I'll continue with the ${client.technology} implementation and keep you updated through ${client.communicationPreference.toLowerCase()}.`;

    setGeneratedMessage(message);
  }

  /* =====================================================
     OVERVIEW
  ===================================================== */

  function renderOverview() {
    return (
      <>
        <section className="hero-card">
          <div>
            <div className="eyebrow">
              <span className="live-dot"></span>
              MEMORY SYSTEM ONLINE
            </div>

            <h2>
              Good afternoon, Sandhya 👋
            </h2>

            <p>
              Your AI memory is ready. Client
              Brain remembers conversations,
              decisions and changes.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() =>
              setPage("chats")
            }
          >
            ＋ Add Conversation
          </button>
        </section>

        <section className="stats-grid">
          <Stat
            icon="👥"
            label="Active Clients"
            value={clients.length}
            detail="Client memory"
          />

          <Stat
            icon="🧠"
            label="Important Decisions"
            value="8"
            detail="Stored in Hindsight"
          />

          <Stat
            icon="💬"
            label="Conversations"
            value="12"
            detail="Analyzed by AI"
          />

          <Stat
            icon="⚡"
            label="Changes Detected"
            value={
              detectedChanges.length > 0
                ? detectedChanges.length
                : "2"
            }
            detail="Need attention"
            warning
          />
        </section>

        <section className="two-column">
          <div className="panel">
            <PanelHeader
              label="RECENT ACTIVITY"
              title="Memory Activity"
            />

            <Activity
              avatar="R"
              name="Rahul Sharma"
              action="Price agreement saved"
              detail="WordPress Website"
              time="2 min ago"
            />

            <Activity
              avatar="P"
              name="Priya Mehta"
              action="Campaign scope remembered"
              detail="Instagram + Meta Ads"
              time="1 hour ago"
            />

            <Activity
              avatar="A"
              name="Arjun Kumar"
              action="Technology preference saved"
              detail="Flutter Mobile App"
              time="Yesterday"
            />
          </div>

          <div className="panel attention-panel">
            <div className="big-icon">
              ⚡
            </div>

            <span className="panel-label">
              MEMORY INTELLIGENCE
            </span>

            <h3>
              Changes are automatically detected
            </h3>

            <p>
              Client Brain compares new
              conversations with previous
              Hindsight memories.
            </p>

            <button
              className="outline-button"
              onClick={() =>
                setPage("changes")
              }
            >
              Review Changes →
            </button>
          </div>
        </section>

        <section className="panel">
          <PanelHeader
            label="YOUR CLIENTS"
            title="Recent Clients"
          />

          <div className="client-grid">
            {clients.map(
              (client) => (
                <ClientCard
                  key={client.name}
                  client={client}
                  onClick={() => {
                    setSelectedClient(
                      client.name
                    );

                    setPage("clients");
                  }}
                />
              )
            )}
          </div>
        </section>

        <section className="memory-banner">
          <div className="big-icon">
            🧠
          </div>

          <div>
            <span>
              POWERED BY HINDSIGHT
            </span>

            <h3>
              Client Brain remembers what matters.
            </h3>

            <p>
              Conversation → Decision → Memory →
              Change Detection
            </p>
          </div>
        </section>
      </>
    );
  }

  /* =====================================================
     CLIENTS
  ===================================================== */

  function renderClients() {
    const client =
      clients.find(
        (item) =>
          item.name ===
          selectedClient
      ) || clients[0];

    return (
      <>
        <PageTitle
          title="Clients"
          subtitle="Your clients and their long-term memory."
        />

        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <button
            className="primary-button"
            onClick={() =>
              setShowAddClient(
                !showAddClient
              )
            }
          >
            {showAddClient
              ? "✕ Cancel"
              : "＋ Add Client"}
          </button>
        </div>

        {showAddClient && (
          <div className="panel">
            <PanelHeader
              label="NEW CLIENT"
              title="Add Client"
            />

            <div className="profile-grid">
              <div>
                <label>
                  Client Name *
                </label>

                <input
                  value={
                    newClient.name
                  }
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      name: e.target.value,
                    })
                  }
                  placeholder="Example: Ananya Reddy"
                />
              </div>

              <div>
                <label>
                  Project *
                </label>

                <input
                  value={
                    newClient.project
                  }
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      project:
                        e.target.value,
                    })
                  }
                  placeholder="Example: Food Delivery App"
                />
              </div>

              <div>
                <label>
                  Original Budget
                </label>

                <input
                  value={
                    newClient.originalBudget
                  }
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      originalBudget:
                        e.target.value,
                    })
                  }
                  placeholder="Example: ₹60,000"
                />
              </div>

              <div>
                <label>
                  Final Agreed Price
                </label>

                <input
                  value={
                    newClient.finalPrice
                  }
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      finalPrice:
                        e.target.value,
                    })
                  }
                  placeholder="Example: ₹75,000"
                />
              </div>

              <div>
                <label>
                  Deadline
                </label>

                <input
                  value={
                    newClient.deadline
                  }
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      deadline:
                        e.target.value,
                    })
                  }
                  placeholder="Example: December 20"
                />
              </div>

              <div>
                <label>
                  Technology
                </label>

                <input
                  value={
                    newClient.technology
                  }
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      technology:
                        e.target.value,
                    })
                  }
                  placeholder="Example: Flutter"
                />
              </div>

              <div>
                <label>
                  Status
                </label>

                <select
                  value={
                    newClient.status
                  }
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      status:
                        e.target.value,
                    })
                  }
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="On Hold">
                    On Hold
                  </option>
                </select>
              </div>

              <div>
                <label>
                  Communication Preference
                </label>

                <input
                  value={
                    newClient.communicationPreference
                  }
                  onChange={(e) =>
                    setNewClient({
                      ...newClient,
                      communicationPreference:
                        e.target.value,
                    })
                  }
                  placeholder="Example: Short WhatsApp messages"
                />
              </div>
            </div>

            <div
              className="button-row"
              style={{
                marginTop: "20px",
              }}
            >
              <button
                className="primary-button"
                onClick={
                  handleAddClient
                }
              >
                ✓ Save Client
              </button>

              <button
                className="secondary-button"
                onClick={
                  cancelAddClient
                }
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="client-grid">
          {clients.map(
            (item) => (
              <ClientCard
                key={item.name}
                client={item}
                selected={
                  item.name ===
                  client.name
                }
                onClick={() =>
                  setSelectedClient(
                    item.name
                  )
                }
              />
            )
          )}
        </div>

        <div className="panel profile-panel">
          <div className="profile-header">
            <div className="large-avatar">
              {client.name.charAt(0)}
            </div>

            <div>
              <span className="panel-label">
                CLIENT PROFILE
              </span>

              <h2>
                {client.name}
              </h2>

              <p>
                {client.project}
              </p>
            </div>
          </div>

          <div className="profile-grid">
            <Info
              label="Original Budget"
              value={
                client.originalBudget
              }
            />

            <Info
              label="Final Agreed Price"
              value={
                client.finalPrice
              }
              highlight
            />

            <Info
              label="Deadline"
              value={
                client.deadline
              }
            />

            <Info
              label="Technology"
              value={
                client.technology
              }
            />

            <Info
              label="Status"
              value={
                client.status
              }
            />

            <Info
              label="Communication"
              value={
                client.communicationPreference
              }
            />
          </div>
        </div>
      </>
    );
  }

  /* =====================================================
     CHATS
  ===================================================== */

  function renderChats() {
    return (
      <>
        <PageTitle
          title="Chats"
          subtitle="Analyze a new client conversation."
        />

        <div className="conversation-grid">
          <div className="panel">
            <PanelHeader
              label="NEW CONVERSATION"
              title="Client Conversation"
            />

            <label>
              Client
            </label>

            <select
              value={selectedClient}
              onChange={(e) =>
                setSelectedClient(
                  e.target.value
                )
              }
            >
              {clients.map(
                (client) => (
                  <option
                    key={
                      client.name
                    }
                    value={
                      client.name
                    }
                  >
                    {client.name}
                  </option>
                )
              )}
            </select>

            <label>
              Conversation
            </label>

            <textarea
              value={conversation}
              onChange={(e) =>
                setConversation(
                  e.target.value
                )
              }
              placeholder="Paste the client conversation here..."
            />

            <div className="button-row">
              <button
                className="secondary-button"
                onClick={() =>
                  setConversation(
                    sampleRahulConversation
                  )
                }
              >
                Load Rahul Change Demo
              </button>

              <button
                className="primary-button"
                onClick={
                  analyzeConversation
                }
                disabled={
                  isAnalyzing
                }
              >
                {isAnalyzing
                  ? "Analyzing..."
                  : "🧠 Analyze Conversation"}
              </button>
            </div>

            {errorMessage && (
              <div className="error-box">
                {errorMessage}
              </div>
            )}
          </div>

          <div className="panel">
            <PanelHeader
              label="AI MEMORY EXTRACTION"
              title="Analysis"
            />

            {!analysis && (
              <div className="empty-state">
                <div className="big-icon">
                  🧠
                </div>

                <h3>
                  Nothing analyzed yet
                </h3>

                <p>
                  Paste a conversation and
                  click Analyze Conversation.
                </p>
              </div>
            )}

            {analysis && (
              <>
                <div className="analysis-grid">
                  <Info
                    label="Client"
                    value={
                      analysis.clientName ||
                      selectedClient
                    }
                  />

                  <Info
                    label="Project"
                    value={
                      analysis.project
                    }
                  />

                  <Info
                    label="Original Budget"
                    value={
                      analysis.originalBudget
                    }
                  />

                  <Info
                    label="Final Agreed Price"
                    value={
                      analysis.finalPrice
                    }
                    highlight
                  />

                  <Info
                    label="Deadline"
                    value={
                      analysis.deadline
                    }
                  />

                  <Info
                    label="Technology"
                    value={
                      analysis.technology
                    }
                  />

                  <Info
                    label="Communication"
                    value={
                      analysis.communicationPreference
                    }
                  />

                  <Info
                    label="Status"
                    value={
                      analysis.status
                    }
                  />
                </div>

                {detectedChanges.length >
                  0 && (
                  <div className="change-alert">
                    <div className="change-alert-title">
                      ⚡ CHANGE DETECTED
                    </div>

                    <p>
                      Client Brain found a
                      difference between
                      previous Hindsight
                      memory and this new
                      conversation.
                    </p>

                    {detectedChanges.map(
                      (
                        change,
                        index
                      ) => (
                        <div
                          className="change-item"
                          key={
                            index
                          }
                        >
                          <strong>
                            {formatField(
                              change.field
                            )}
                          </strong>

                          <div className="change-values">
                            <span className="old-value">
                              {
                                change.oldValue
                              }
                            </span>

                            <span className="arrow">
                              →
                            </span>

                            <span className="new-value">
                              {
                                change.newValue
                              }
                            </span>
                          </div>

                          <small>
                            {
                              change.description
                            }
                          </small>
                        </div>
                      )
                    )}
                  </div>
                )}

                {detectedChanges.length ===
                  0 && (
                  <div className="no-change-box">
                    ✓ No changes detected
                  </div>
                )}

                {previousMemory && (
                  <details className="previous-memory">
                    <summary>
                      View previous Hindsight memory
                    </summary>

                    <pre>
                      {previousMemory}
                    </pre>
                  </details>
                )}

                <div className="decision-box">
                  <h3>
                    {detectedChanges.length >
                    0
                      ? "Review the change before saving"
                      : "Confirm this memory"}
                  </h3>

                  <p>
                    Client Brain will store this
                    information as long-term
                    Hindsight memory.
                  </p>

                  <button
                    className="primary-button full"
                    onClick={
                      saveToHindsight
                    }
                    disabled={
                      isSaving
                    }
                  >
                    {isSaving
                      ? "Saving..."
                      : "✓ Confirm & Save to Hindsight"}
                  </button>

                  {saveMessage && (
                    <div className="success-box">
                      {saveMessage}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  /* =====================================================
     MEMORY
  ===================================================== */

  function renderMemory() {
    return (
      <>
        <PageTitle
          title="Memory"
          subtitle="Ask Client Brain what it remembers."
        />

        <div className="panel ask-memory-panel">
          <PanelHeader
            label="HINDSIGHT RECALL"
            title="Ask Client Brain"
          />

          <div className="search-row">
            <input
              value={memoryQuery}
              onChange={(e) =>
                setMemoryQuery(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key ===
                  "Enter"
                ) {
                  askMemory();
                }
              }}
              placeholder="Example: What price did Rahul finally agree to?"
            />

            <button
              className="primary-button"
              onClick={askMemory}
              disabled={isAsking}
            >
              {isAsking
                ? "Searching..."
                : "Ask Memory"}
            </button>
          </div>

          {memoryAnswer && (
            <div className="memory-answer">
              <span className="panel-label">
                HINDSIGHT RECALL
              </span>

              <p>
                {memoryAnswer}
              </p>
            </div>
          )}

          {!memoryAnswer && (
            <div className="suggestion-grid">
              <button
                onClick={() =>
                  setMemoryQuery(
                    "What price did Rahul finally agree to?"
                  )
                }
              >
                What price did Rahul agree to?
              </button>

              <button
                onClick={() =>
                  setMemoryQuery(
                    "What is Rahul's deadline?"
                  )
                }
              >
                What is Rahul's deadline?
              </button>

              <button
                onClick={() =>
                  setMemoryQuery(
                    "What technology does Rahul use?"
                  )
                }
              >
                What technology does Rahul use?
              </button>

              <button
                onClick={() =>
                  setMemoryQuery(
                    "How does Rahul prefer communication?"
                  )
                }
              >
                How does Rahul prefer communication?
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  /* =====================================================
     CHANGES
  ===================================================== */

  function renderChanges() {
    return (
      <>
        <PageTitle
          title="Changes Detected"
          subtitle="Differences between previous memory and new conversations."
        />

        {detectedChanges.length ===
        0 ? (
          <div className="panel empty-state">
            <div className="big-icon">
              ✓
            </div>

            <h2>
              No new changes detected
            </h2>

            <p>
              Analyze a new conversation to
              compare it with the client's
              previous Hindsight memory.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                setPage("chats")
              }
            >
              Analyze Conversation →
            </button>
          </div>
        ) : (
          <div className="panel">
            <div className="change-alert-title">
              ⚡{" "}
              {
                detectedChanges.length
              }{" "}
              CHANGE
              {detectedChanges.length >
              1
                ? "S"
                : ""}{" "}
              DETECTED
            </div>

            <p>
              Client Brain compared the new
              conversation against previous
              Hindsight memory.
            </p>

            {detectedChanges.map(
              (
                change,
                index
              ) => (
                <div
                  className="big-change-card"
                  key={index}
                >
                  <div className="big-change-header">
                    <span>
                      {formatField(
                        change.field
                      )}
                    </span>

                    <span className="change-badge">
                      Changed
                    </span>
                  </div>

                  <div className="big-change-values">
                    <div>
                      <small>
                        PREVIOUS
                      </small>

                      <strong>
                        {
                          change.oldValue
                        }
                      </strong>
                    </div>

                    <div className="big-arrow">
                      →
                    </div>

                    <div>
                      <small>
                        CURRENT
                      </small>

                      <strong>
                        {
                          change.newValue
                        }
                      </strong>
                    </div>
                  </div>

                  <p>
                    {
                      change.description
                    }
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </>
    );
  }

  /* =====================================================
     MESSAGES
  ===================================================== */

  function renderMessages() {
    return (
      <>
        <PageTitle
          title="Messages"
          subtitle="Create personalized client messages using memory."
        />

        <div className="panel">
          <PanelHeader
            label="PERSONALIZED COMMUNICATION"
            title="Generate Client Message"
          />

          <label>
            Client
          </label>

          <select
            value={messageClient}
            onChange={(e) =>
              setMessageClient(
                e.target.value
              )
            }
          >
            {clients.map(
              (client) => (
                <option
                  key={
                    client.name
                  }
                  value={
                    client.name
                  }
                >
                  {client.name}
                </option>
              )
            )}
          </select>

          <button
            className="primary-button"
            onClick={
              generateMessage
            }
          >
            ✨ Generate Personalized Message
          </button>

          {generatedMessage && (
            <div className="message-preview">
              <span className="panel-label">
                MESSAGE
              </span>

              <p>
                {generatedMessage}
              </p>

              <button
                className="secondary-button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    generatedMessage
                  )
                }
              >
                Copy Message
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  function renderPage() {
    if (page === "overview") {
      return renderOverview();
    }

    if (page === "clients") {
      return renderClients();
    }

    if (page === "chats") {
      return renderChats();
    }

    if (page === "memory") {
      return renderMemory();
    }

    if (page === "changes") {
      return renderChanges();
    }

    if (page === "messages") {
      return renderMessages();
    }

    return renderOverview();
  }

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-logo">
            CB
          </div>

          <div>
            <h1>
              CLIENT BRAIN
            </h1>

            <p>
              AI Memory Agent
            </p>
          </div>
        </div>

        <div className="nav-section">

          <span className="nav-title">
            WORKSPACE
          </span>

          {navItems.map(
            (item) => (
              <button
                key={
                  item.id
                }
                className={`nav-item ${
                  page ===
                  item.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setPage(
                    item.id
                  )
                }
              >
                <span className="nav-icon">
                  {
                    item.icon
                  }
                </span>

                <span>
                  {
                    item.label
                  }
                </span>
              </button>
            )
          )}

        </div>

        <div className="sidebar-bottom">

          <div className="memory-status">

            <div className="status-dot"></div>

            <div>
              <strong>
                Hindsight
              </strong>

              <span>
                Memory connected
              </span>
            </div>

          </div>

          <div className="profile">

            <div className="avatar">
              S
            </div>

            <div>
              <strong>
                Sandhya
              </strong>

              <span>
                Workspace
              </span>
            </div>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <main className="main">

        <header className="topbar">

          <div>

            <div className="breadcrumb">
              Workspace

              <span>
                /
              </span>

              <strong>
                {
                  currentPage
                }
              </strong>
            </div>

          </div>

          <div className="top-actions">

            <div className="connection-pill">

              <span className="status-dot"></span>

              Hindsight Connected

            </div>

            <div className="top-profile">

              <div className="avatar small">
                S
              </div>

              <span>
                Sandhya
              </span>

            </div>

          </div>

        </header>

        <div className="content">
          {renderPage()}
        </div>

      </main>

      {/* EXTRA STYLES */}

      <style>{`

        .hero-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          padding: 32px;
          margin-bottom: 24px;
          border-radius: 20px;
          background: linear-gradient(
            135deg,
            #111827,
            #1f2937
          );
          color: white;
        }

        .hero-card h2 {
          margin: 12px 0 8px;
          font-size: 30px;
        }

        .hero-card p {
          margin: 0;
          color: #cbd5e1;
        }

        .eyebrow {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .live-dot,
        .status-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          margin-right: 7px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 20px;
        }

        .stat-card.warning {
          border-color: #f59e0b;
        }

        .stat-icon {
          font-size: 22px;
          margin-bottom: 12px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 800;
        }

        .stat-label {
          margin-top: 4px;
          font-weight: 700;
        }

        .stat-detail {
          color: #6b7280;
          font-size: 13px;
          margin-top: 5px;
        }

        .two-column {
          display: grid;
          grid-template-columns:
            1.5fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .panel {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .panel-header {
          margin-bottom: 20px;
        }

        .panel-label {
          display: block;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.2px;
          color: #6b7280;
          margin-bottom: 5px;
        }

        .panel-header h3 {
          margin: 0;
          font-size: 20px;
        }

        .activity {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .activity:last-child {
          border-bottom: none;
        }

        .activity-avatar,
        .client-avatar,
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #eef2ff;
          font-weight: 800;
        }

        .activity-info {
          flex: 1;
        }

        .activity-info strong,
        .activity-info span,
        .activity-info small {
          display: block;
        }

        .activity-info span {
          font-size: 13px;
          margin-top: 2px;
        }

        .activity-info small,
        .activity-time {
          color: #94a3b8;
          font-size: 12px;
        }

        .attention-panel {
          border-color: #f59e0b;
          background: #fffbeb;
        }

        .big-icon {
          font-size: 30px;
          margin-bottom: 12px;
        }

        .attention-panel h3 {
          margin: 8px 0;
        }

        .attention-panel p {
          color: #64748b;
          line-height: 1.6;
        }

        .primary-button,
        .secondary-button,
        .outline-button {
          border: none;
          border-radius: 10px;
          padding: 12px 17px;
          cursor: pointer;
          font-weight: 700;
        }

        .primary-button {
          background: #111827;
          color: white;
        }

        .primary-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .secondary-button {
          background: #f1f5f9;
          color: #111827;
        }

        .outline-button {
          background: white;
          border: 1px solid #d1d5db;
        }

        .full {
          width: 100%;
        }

        .client-grid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 16px;
        }

        .client-card {
          border: 1px solid #e5e7eb;
          border-radius: 15px;
          padding: 18px;
          cursor: pointer;
          background: white;
          transition: .2s;
        }

        .client-card:hover {
          transform: translateY(-2px);
          border-color: #94a3b8;
        }

        .client-card.selected {
          border-color: #111827;
          box-shadow:
            0 0 0 2px #e5e7eb;
        }

        .client-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .client-name {
          flex: 1;
        }

        .client-name strong,
        .client-name span {
          display: block;
        }

        .client-name span {
          color: #94a3b8;
          font-size: 12px;
        }

        .client-project {
          margin: 18px 0;
          font-weight: 700;
        }

        .client-details {
          display: flex;
          justify-content: space-between;
        }

        .client-details span,
        .client-details strong {
          display: block;
        }

        .client-details span {
          font-size: 11px;
          color: #94a3b8;
        }

        .memory-banner {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 25px;
          border-radius: 18px;
          background: #f8fafc;
          margin-top: 20px;
        }

        .memory-banner > div:nth-child(2) {
          flex: 1;
        }

        .memory-banner span {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #64748b;
        }

        .memory-banner h3 {
          margin: 5px 0;
        }

        .memory-banner p {
          margin: 0;
          color: #64748b;
        }

        .profile-panel {
          margin-top: 20px;
        }

        .profile-header {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 25px;
        }

        .large-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #111827;
          color: white;
          font-size: 22px;
          font-weight: 800;
        }

        .profile-header h2 {
          margin: 3px 0;
        }

        .profile-header p {
          margin: 0;
          color: #64748b;
        }

        .profile-grid,
        .analysis-grid {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 12px;
        }

        .info-card {
          padding: 15px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .info-card span {
          display: block;
          color: #64748b;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .7px;
        }

        .info-card strong {
          display: block;
          margin-top: 5px;
        }

        .info-card.highlight {
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
        }

        .conversation-grid {
          display: grid;
          grid-template-columns:
            1fr 1.15fr;
          gap: 20px;
        }

        label {
          display: block;
          margin: 14px 0 7px;
          font-size: 13px;
          font-weight: 700;
        }

        select,
        textarea,
        input {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 12px;
          font: inherit;
          background: white;
        }

        textarea {
          min-height: 330px;
          resize: vertical;
        }

        .button-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 15px;
        }

        .analysis-grid {
          margin-bottom: 20px;
        }

        .change-alert {
          border: 2px solid #f59e0b;
          background: #fffbeb;
          border-radius: 15px;
          padding: 18px;
          margin-bottom: 20px;
        }

        .change-alert-title {
          color: #92400e;
          font-weight: 900;
          letter-spacing: .8px;
          margin-bottom: 8px;
        }

        .change-item {
          padding: 15px;
          background: white;
          border-radius: 12px;
          margin-top: 12px;
          border: 1px solid #fde68a;
        }

        .change-values {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 10px 0;
          flex-wrap: wrap;
        }

        .old-value {
          color: #991b1b;
          background: #fee2e2;
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: 800;
          text-decoration: line-through;
        }

        .new-value {
          color: #166534;
          background: #dcfce7;
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: 800;
        }

        .arrow {
          font-size: 20px;
          font-weight: 900;
        }

        .no-change-box,
        .success-box,
        .error-box {
          padding: 14px;
          border-radius: 10px;
          margin: 12px 0;
        }

        .no-change-box {
          background: #ecfdf5;
          color: #166534;
        }

        .success-box {
          background: #dcfce7;
          color: #166534;
        }

        .error-box {
          background: #fee2e2;
          color: #991b1b;
        }

        .decision-box {
          padding: 18px;
          background: #f8fafc;
          border-radius: 14px;
        }

        .decision-box h3 {
          margin-top: 0;
        }

        .previous-memory {
          margin: 15px 0;
        }

        .previous-memory summary {
          cursor: pointer;
          font-weight: 700;
        }

        .previous-memory pre {
          max-height: 250px;
          overflow: auto;
          background: #111827;
          color: #e5e7eb;
          padding: 15px;
          border-radius: 10px;
          white-space: pre-wrap;
          font-size: 12px;
          margin-top: 10px;
        }

        .empty-state {
          text-align: center;
          padding: 55px 20px;
        }

        .empty-state p {
          color: #64748b;
          margin-bottom: 20px;
        }

        .ask-memory-panel {
          max-width: 900px;
        }

        .search-row {
          display: flex;
          gap: 10px;
        }

        .search-row input {
          flex: 1;
        }

        .memory-answer {
          margin-top: 20px;
          padding: 20px;
          border-radius: 14px;
          background: #f8fafc;
          line-height: 1.7;
        }

        .suggestion-grid {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 10px;
          margin-top: 20px;
        }

        .suggestion-grid button {
          border: 1px solid #e5e7eb;
          background: white;
          padding: 13px;
          border-radius: 10px;
          text-align: left;
          cursor: pointer;
        }

        .big-change-card {
          margin-top: 18px;
          border: 1px solid #fbbf24;
          background: #fffbeb;
          border-radius: 15px;
          padding: 20px;
        }

        .big-change-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 900;
        }

        .change-badge {
          background: #fef3c7;
          color: #92400e;
          border-radius: 20px;
          padding: 5px 10px;
          font-size: 11px;
        }

        .big-change-values {
          display: grid;
          grid-template-columns:
            1fr auto 1fr;
          align-items: center;
          gap: 15px;
          margin: 20px 0;
        }

        .big-change-values div:not(.big-arrow) {
          background: white;
          padding: 15px;
          border-radius: 10px;
        }

        .big-change-values small,
        .big-change-values strong {
          display: block;
        }

        .big-change-values small {
          color: #64748b;
          font-size: 10px;
        }

        .big-change-values strong {
          margin-top: 5px;
          font-size: 20px;
        }

        .big-arrow {
          font-size: 25px;
          font-weight: 900;
        }

        .message-preview {
          margin-top: 25px;
          padding: 20px;
          border-radius: 14px;
          background: #f8fafc;
        }

        .message-preview p {
          line-height: 1.7;
          margin-bottom: 18px;
        }

        .connection-pill {
          background: #ecfdf5;
          color: #166534;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        @media (max-width: 1000px) {
          .stats-grid,
          .client-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .two-column,
          .conversation-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .stats-grid,
          .client-grid,
          .profile-grid,
          .analysis-grid,
          .suggestion-grid {
            grid-template-columns: 1fr;
          }

          .hero-card,
          .memory-banner,
          .search-row {
            flex-direction: column;
            align-items: stretch;
          }
        }

      `}</style>
    </div>
  );
}

/* =====================================================
   SMALL COMPONENTS
===================================================== */

function PageTitle({
  title,
  subtitle,
}) {
  return (
    <div className="page-title">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function PanelHeader({
  label,
  title,
}) {
  return (
    <div className="panel-header">
      <span className="panel-label">
        {label}
      </span>

      <h3>
        {title}
      </h3>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  detail,
  warning,
}) {
  return (
    <div
      className={`stat-card ${
        warning
          ? "warning"
          : ""
      }`}
    >
      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-label">
        {label}
      </div>

      <div className="stat-detail">
        {detail}
      </div>
    </div>
  );
}

function Activity({
  avatar,
  name,
  action,
  detail,
  time,
}) {
  return (
    <div className="activity">

      <div className="activity-avatar">
        {avatar}
      </div>

      <div className="activity-info">

        <strong>
          {name}
        </strong>

        <span>
          {action}
        </span>

        <small>
          {detail}
        </small>

      </div>

      <div className="activity-time">
        {time}
      </div>

    </div>
  );
}

function ClientCard({
  client,
  selected,
  onClick,
}) {
  return (
    <div
      className={`client-card ${
        selected
          ? "selected"
          : ""
      }`}
      onClick={onClick}
    >

      <div className="client-top">

        <div className="client-avatar">
          {client.name.charAt(0)}
        </div>

        <div className="client-name">

          <strong>
            {client.name}
          </strong>

          <span>
            {client.status}
          </span>

        </div>

        <span>
          •••
        </span>

      </div>

      <div className="client-project">
        {client.project}
      </div>

      <div className="client-details">

        <div>
          <span>
            Agreed
          </span>

          <strong>
            {client.finalPrice}
          </strong>
        </div>

        <div>
          <span>
            Deadline
          </span>

          <strong>
            {client.deadline}
          </strong>
        </div>

      </div>

    </div>
  );
}

function Info({
  label,
  value,
  highlight,
}) {
  return (
    <div
      className={`info-card ${
        highlight
          ? "highlight"
          : ""
      }`}
    >

      <span>
        {label}
      </span>

      <strong>
        {value ||
          "Not specified"}
      </strong>

    </div>
  );
}

function formatField(field) {
  if (!field) {
    return "Unknown Field";
  }

  const names = {
    finalPrice:
      "Final Price",

    originalBudget:
      "Original Budget",

    deadline:
      "Deadline",

    technology:
      "Technology",

    project:
      "Project / Scope",

    communicationPreference:
      "Communication Preference",

    status:
      "Status",
  };

  return (
    names[field] ||
    field
      .replace(
        /([A-Z])/g,
        " $1"
      )
      .replace(
        /^./,
        (char) =>
          char.toUpperCase()
      )
  );
}

export default App;