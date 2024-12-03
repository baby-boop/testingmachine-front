import React, { useState, useEffect } from "react";

const App = () => {
  const [systemData, setSystemData] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/system-data"); // Update with backend URL
      if (!response.ok) throw new Error("Failed to fetch system data");
      const data = await response.json();
      setSystemData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSystemData = async () => {
    if (!name.trim()) {
      alert("Name cannot be empty");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/system-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Failed to add system data");
      setName("");
      fetchSystemData(); // Refresh data after adding
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h1>System Data</h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {systemData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addSystemData();
        }}
        style={{ marginTop: "20px" }}
      >
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "5px 10px" }}>
          Add
        </button>
      </form>
    </div>
  );
};

export default App;
