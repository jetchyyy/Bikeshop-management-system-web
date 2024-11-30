import { useState } from "react";
import { ref, push, set } from "firebase/database";
import { database } from "../../firebase/firebase";

function AddCategory({ isOpen, toggleCategoryModal }) {
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  //add another category to the category db
  const addCategory = async () => {
    if (!category.trim()) {
      alert("Category name cannot be empty.");
      return;
    }

    const categoryRef = ref(database, "category");
    const newCategoryRef = push(categoryRef);

    const categoryData = {
      category: category.trim(), // Use a consistent property name like categoryName
    };

    try {
      setLoading(true); // Optional: Add loading state
      await set(newCategoryRef, categoryData);

      alert("Category has been added successfully!");
      setCategory(""); // Clear the input field
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Error adding category: " + error.message);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <input
        type="text"
        placeholder="Enter new category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring border-gray-300"
        disabled={loading}
      />
      <button onClick={addCategory} disabled={loading || !category.trim()}>
        {loading ? "Adding..." : "Add Category"}
      </button>
      <button onClick={toggleCategoryModal} disabled={loading}>
        Close
      </button>
    </div>
  );
}

export default AddCategory;
