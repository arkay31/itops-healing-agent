import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const API =
  "https://itops-healing-agent-backend.onrender.com";

function App() {
  const [incidents, setIncidents] = useState([]);
  const [cpuUsage, setCpuUsage] = useState("0");
  const [alertStatus, setAlertStatus] = useState("Healthy");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [cpuHistory, setCpuHistory] = useState([]);
  const generateRCA = async (incident) => {
  try {
    const response = await axios.post(
  `${API}/rca/analyze`,
  {
    description: incident.description,
  }
);

    setSelectedIncident({
      ...incident,
      rca_analysis:
        response.data.analysis ||
        JSON.stringify(response.data, null, 2),

      healing_action:
        response.data.healing?.action,

      healing_status:
        response.data.healing?.status,

      healing_message:
        response.data.healing?.message,
    });
  } catch (error) {
    console.error("RCA Error:", error);
  }
};

const executeHealing = async (incident) => {
  try {
    const response = await axios.post(
  `${API}/healing/heal`,
  {
    analysis: incident.rca_analysis || "",
  }
);

    setSelectedIncident({
      ...incident,

      healing_status:
        response.data.status || "success",

      healing_action:
        response.data.action || "Healing Executed",

      healing_message:
        response.data.message || "",
    });
  } catch (error) {
    console.error("Healing Error:", error);
  }
};

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
  try {

    const incidentsResponse = await axios.get(
      `${API}/incidents`
    );

    setIncidents(incidentsResponse.data);

    const cpuResponse = await axios.get(
      `${API}/monitor/cpu`
    );

    const cpu =
      parseFloat(
        cpuResponse.data.data.result[0].value[1]
      ) * 100;

    const cpuFixed = cpu.toFixed(2);

    setCpuUsage(cpuFixed);

    setCpuHistory((prev) => {
      const updated = [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          cpu: parseFloat(cpuFixed)
        }
      ];

      return updated.slice(-10);
    });

    const alertResponse = await axios.get(
      `${API}/alerts/check`
    );

    setAlertStatus(
      alertResponse.data.alert
        ? "Alert Active"
        : "Healthy"
    );

  } catch (error) {
    console.error("Fetch Error:", error);
  }
};

  const totalIncidents = incidents.length;

  const openIncidents = incidents.filter(
    (i) => i.status === "open"
  ).length;

  const criticalIncidents = incidents.filter(
    (i) => i.severity === "critical"
  ).length;

  const healedIncidents = incidents.filter(
    (i) => i.healing_status === "success"
  ).length;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh"
      }}
    >
      {/* Sidebar */}

      <div
        style={{
          width: "260px",
          background: "#0b1220",
          padding: "20px",
          borderRight:
            "1px solid #334155"
        }}
      >
        <h2
          style={{
            marginBottom: "30px"
          }}
        >
          🚀 AIOps Guardian
        </h2>

        {[
          "dashboard",
          "monitoring",
          "incidents",
          "rca",
          "healing"
        ].map((item) => (
          <div
            key={item}
            onClick={() =>
              setActivePage(item)
            }
            style={{
              padding: "14px",
              marginBottom: "10px",
              borderRadius: "10px",
              cursor: "pointer",
              background:
                activePage === item
                  ? "#334155"
                  : "transparent"
            }}
          >
            {item === "dashboard" &&
              "📊 Dashboard"}

            {item === "monitoring" &&
              "📡 Monitoring"}

            {item === "incidents" &&
              "🚨 Incidents"}

            {item === "rca" &&
              "🤖 RCA Engine"}

            {item === "healing" &&
              "⚡ Healing Engine"}
          </div>
        ))}
      </div>

      {/* Main Content */}

      <div
        style={{
          flex: 1,
          padding: "20px"
        }}
      >
        <h1>
          🚀 AIOps Guardian
        </h1>

        <p className="subtitle">
          Autonomous Incident Detection &
          Self-Healing Platform
        </p>

        <p
          style={{
            color: "#22c55e",
            marginBottom: "30px"
          }}
        >
          🟢 Live Monitoring • Auto Refresh
          Every 10 Seconds
        </p>

        {/* KPI */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4,1fr)",
            gap: "20px",
            marginBottom: "30px"
          }}
        >
          <div className="card">
            <h2>{totalIncidents}</h2>
            <p>Total Incidents</p>
          </div>

          <div className="card">
            <h2>{openIncidents}</h2>
            <p>Open Incidents</p>
          </div>

          <div className="card">
            <h2>{criticalIncidents}</h2>
            <p>Critical Incidents</p>
          </div>

          <div className="card">
            <h2>{healedIncidents}</h2>
            <p>Auto-Healed</p>
          </div>
        </div>

        {/* CPU + Chart */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 2fr",
            gap: "20px",
            marginBottom: "30px"
          }}
        >
          <div className="card">
            <h2>{cpuUsage}%</h2>

            <p>CPU Usage</p>

            <div className="progress-container">
              <div
                className="progress-bar"
                style={{
                  width: `${cpuUsage}%`
                }}
              />
            </div>

            <h2
              className={
                alertStatus ===
                "Alert Active"
                  ? "alert-active"
                  : "alert-healthy"
              }
              style={{
                marginTop: "20px"
              }}
            >
              {alertStatus ===
              "Alert Active"
                ? "🔴 ALERT"
                : "🟢 HEALTHY"}
            </h2>
          </div>

          <div className="card">
            <h2>
              CPU Usage Trend
            </h2>

            <ResponsiveContainer
              width="100%"
              height={280}
            >
              <LineChart
                data={cpuHistory}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="time" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke="#22c55e"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Analytics */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4,1fr)",
            gap: "20px",
            marginBottom: "30px"
          }}
        >
          <div className="card">
            <h2>🤖</h2>
            <p>AI RCA Active</p>
          </div>

          <div className="card">
            <h2>⚡</h2>
            <p>Auto Healing Active</p>
          </div>

          <div className="card">
            <h2>📡</h2>
            <p>Monitoring Online</p>
          </div>

          <div className="card">
            <h2>🦙</h2>
            <p>Llama3 Online</p>
          </div>
        </div>

        {/* Incidents */}

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Service</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Healing</th>
            </tr>
          </thead>

          <tbody>
            {incidents
              .slice(-5)
              .reverse()
              .map((incident) => (
                <tr
                  key={incident.id}
                  onClick={() =>
                    setSelectedIncident(
                      incident
                    )
                  }
                  style={{
                    cursor: "pointer"
                  }}
                >
                  <td>{incident.id}</td>

                  <td>
                    {incident.service}
                  </td>

                  <td>
                    <span className="badge-critical">
                      🔴 Critical
                    </span>
                  </td>

                  <td>
                    {incident.status}
                  </td>

                  <td>
                    {incident.healing_status ===
                    "success" ? (
                      <span className="badge-success">
                        ✅ Healed
                      </span>
                    ) : (
                      <span className="badge-warning">
                        ⏳ Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Modal */}

        {selectedIncident && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background:
                "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent:
                "center",
              alignItems: "center"
            }}
          >
            <div
              className="modal-content"
              style={{
                width: "800px",
                background:
                  "#1e293b",
                padding: "30px",
                borderRadius: "12px"
              }}
            >
              <h2>
                🚨 Incident #
                {selectedIncident.id}
              </h2>

              <hr
                style={{
                  margin:
                    "20px 0"
                }}
              />

              <p>
                <strong>
                  Service:
                </strong>{" "}
                {
                  selectedIncident.service
                }
              </p>

              <p>
                <strong>
                  Description:
                </strong>{" "}
                {
                  selectedIncident.description
                }
              </p>

              <h3
  style={{
    marginTop: "20px"
  }}
>
  🤖 RCA Analysis
</h3>

<button
  onClick={() =>
    generateRCA(selectedIncident)
  }
  style={{
    padding: "10px 20px",
    marginBottom: "15px",
    cursor: "pointer",
  }}
>
  Generate RCA
</button>

<pre>
  {selectedIncident.rca_analysis ||
    "Click Generate RCA"}
</pre>

              <h3
  style={{
    marginTop: "20px"
  }}
>
  ⚡ Healing Engine
</h3>

<button
  onClick={() =>
    executeHealing(selectedIncident)
  }
  style={{
    padding: "10px 20px",
    marginBottom: "15px",
    cursor: "pointer",
  }}
>
  Execute Healing
</button>

<p>
  <strong>Status:</strong>{" "}
  {selectedIncident.healing_status ||
    "Pending"}
</p>

<p>
  <strong>Action:</strong>{" "}
  {selectedIncident.healing_action ||
    "No action executed"}
</p>

              <button
                onClick={() =>
                  setSelectedIncident(
                    null
                  )
                }
                style={{
                  marginTop:
                    "20px",
                  padding:
                    "10px 20px"
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: "40px",
            textAlign: "center",
            color: "#64748b"
          }}
        >
          AIOps Guardian v1.0
          <br />
          FastAPI • PostgreSQL •
          Prometheus • Ollama • React
        </div>
      </div>
    </div>
  );
}

export default App;

