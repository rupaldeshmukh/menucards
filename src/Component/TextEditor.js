import React, { useState, useEffect } from "react";

const mockUsers = ["Rupal", "Rohit", "Rahul", "Ramesh", "Raj", "Ritika", "Rina"];

// Simulate API call
const fetchUsers = (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        mockUsers.filter((user) =>
          user.toLowerCase().includes(query.toLowerCase())
        )
      );
    }, 300); // Simulate network delay
  });
};

const TextEditior = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.trim() !== "") {
        fetchUsers(search).then((res) => {
          setResults(res);
        });
      } else {
        setResults([]);
      }
    }, 500); // debounce delay

    return () => {
      clearTimeout(handler); // clear on next input
    };
  }, [search]);

  const handleSelect = (user) => {
    if (!selectedUsers.includes(user)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearch("");
    setResults([]);
  };

  const handleRemove = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u !== user));
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <input
        type="text"
        placeholder="Type a name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "4px" }}
      />

      {results.length > 0 && (
        <ul
          style={{
            border: "1px solid #ccc",
            padding: "5px",
            listStyle: "none",
            marginTop: "0",
          }}
        >
          {results.map((user, index) => (
            <li
              key={index}
              onClick={() => handleSelect(user)}
              style={{
                cursor: "pointer",
                padding: "5px",
                borderBottom: "1px solid #eee",
              }}
            >
              {user}
            </li>
          ))}
        </ul>
      )}

      <div
        style={{
          marginTop: "12px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {selectedUsers.map((user, index) => (
          <div
            key={index}
            style={{
              background: "#f0f0f0",
              padding: "5px 10px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {user}
            <span
              onClick={() => handleRemove(user)}
              style={{
                marginLeft: "8px",
                cursor: "pointer",
                color: "#888",
                fontWeight: "bold",
              }}
            >
              ×
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextEditior;
