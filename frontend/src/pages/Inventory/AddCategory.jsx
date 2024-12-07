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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <input
          type="text"
          placeholder="Enter new category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring border-gray-300"
          disabled={loading}
        />
        <div className="flex justify-start mt-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 mr-2" 
          onClick={addCategory} disabled={loading || !category.trim()}>
            {loading ? "Adding..." : "Add Category"}
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          onClick={toggleCategoryModal} disabled={loading}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCategory;
