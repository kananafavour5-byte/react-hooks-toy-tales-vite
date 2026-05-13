import React, { useState, useEffect } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  function handleClick() {
    setShowForm((prev) => !prev);
  }

  // ✅ GET toys on load
  useEffect(() => {
    fetch("http://localhost:3000/toys")
      .then((res) => res.json())
      .then((data) => setToys(data));
  }, []);

  // ➕ POST toy
  function handleAddToy(newToy) {
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newToy, likes: 0 }),
    })
      .then((res) => res.json())
      .then((data) => {
        setToys([...toys, data]);
      });
  }

  // ❤️ PATCH like
  function handleLikeToy(toy) {
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: toy.likes + 1 }),
    })
      .then((res) => res.json())
      .then((updatedToy) => {
        setToys(
          toys.map((t) => (t.id === updatedToy.id ? updatedToy : t))
        );
      });
  }

  // 🗑 DELETE toy
  function handleDeleteToy(id) {
    fetch(`http://localhost:3000/toys/${id}`, {
      method: "DELETE",
    }).then(() => {
      setToys(toys.filter((toy) => toy.id !== id));
    });
  }

  return (
    <>
      <Header />

      {showForm && <ToyForm onAddToy={handleAddToy} />}

      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>

      <ToyContainer
        toys={toys}
        onLike={handleLikeToy}
        onDelete={handleDeleteToy}
      />
    </>
  );
}

export default App;
