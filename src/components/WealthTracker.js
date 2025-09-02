import React, { useState } from "react";
import { Plus, Trash2, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const WealthTracker = () => {
  const [items, setItems] = useState({
    assets: [],
    liabilities: [],
  });

  const [newItem, setNewItem] = useState({
    name: "",
    amount: "",
    type: "assets",
  });

  const saveToDatabase = async (item) => {
    try {
      const response = await fetch("http://localhost:5000/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item), // Send item data in the request body
      });
      const data = await response.json();
      console.log("Data saved:", data);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Add item to the state and send it to the database
  const addItem = (e) => {
    e.preventDefault();

    if (!newItem.name || !newItem.amount) return;

    const itemData = {
      id: Date.now(),
      name: newItem.name,
      amount: parseFloat(newItem.amount),
      type: newItem.type,
    };

    // Update local state
    setItems((prev) => ({
      ...prev,
      [newItem.type]: [...prev[newItem.type], itemData],
    }));

    // Reset input form
    setNewItem({
      name: "",
      amount: "",
      type: "assets",
    });

    // Save to database
    saveToDatabase(itemData);
  };

  const deleteItem = (type, id) => {
    setItems((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id),
    }));
  };

  const calculateTotal = (type) => {
    return items[type].reduce((sum, item) => sum + item.amount, 0);
  };

  const netWorth = calculateTotal("assets") - calculateTotal("liabilities");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-5xl border border-gray-300 rounded-lg shadow-xl bg-white p-8">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold text-gray-800 text-center">Wealth Position Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add New Item Form */}
            <form onSubmit={addItem} className="flex gap-6 mb-8">
              <select
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newItem.type}
                onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, type: e.target.value }))
                }
              >
                <option value="assets">Asset</option>
                <option value="liabilities">Liability</option>
              </select>
              <input
                type="text"
                placeholder="Name"
                className="p-3 border border-gray-300 rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <input
                type="number"
                placeholder="Amount"
                className="p-3 border border-gray-300 rounded-md w-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newItem.amount}
                onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, amount: e.target.value }))
                }
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
              >
                <Plus size={20} /> Add
              </button>
            </form>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              <Card className="bg-green-50 shadow-md rounded-lg p-4">
                <CardContent className="text-center">
                  <div className="flex items-center justify-center gap-3">
                    <TrendingUp className="text-green-600" />
                    <h3 className="font-semibold">Total Assets</h3>
                  </div>
                  <span className="text-xl font-bold text-green-600">
                    ${calculateTotal("assets").toLocaleString()}
                  </span>
                </CardContent>
              </Card>

              <Card className="bg-red-50 shadow-md rounded-lg p-4">
                <CardContent className="text-center">
                  <div className="flex items-center justify-center gap-3">
                    <TrendingDown className="text-red-600" />
                    <h3 className="font-semibold">Total Liabilities</h3>
                  </div>
                  <span className="text-xl font-bold text-red-600">
                    ${calculateTotal("liabilities").toLocaleString()}
                  </span>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 shadow-md rounded-lg p-4">
                <CardContent className="text-center">
                  <div className="flex items-center justify-center gap-3">
                    <DollarSign className="text-blue-600" />
                    <h3 className="font-semibold">Net Worth</h3>
                  </div>
                  <span
                    className={`text-xl font-bold ${
                      netWorth >= 0 ? "text-blue-600" : "text-red-600"
                    }`}
                  >
                    ${netWorth.toLocaleString()}
                  </span>
                </CardContent>
              </Card>
            </div>

            {/* Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Assets List */}
              <div>
                <h3 className="font-semibold mb-4 text-xl">Assets</h3>
                <div className="space-y-4">
                  {items.assets.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg border border-gray-300"
                    >
                      <span>{item.name}</span>
                      <div className="flex items-center gap-6">
                        <span className="text-green-600">
                          ${item.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => deleteItem("assets", item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Liabilities List */}
              <div>
                <h3 className="font-semibold mb-4 text-xl">Liabilities</h3>
                <div className="space-y-4">
                  {items.liabilities.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg border border-gray-300"
                    >
                      <span>{item.name}</span>
                      <div className="flex items-center gap-6">
                        <span className="text-red-600">
                          ${item.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => deleteItem("liabilities", item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WealthTracker;
