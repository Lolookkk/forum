import { useState, useEffect, useCallback } from "react";
import { CategoryContext } from "./CategoryContext";
import {
  getCategories,
  getSubcategoriesByCategory,
  getForumCategories,
} from "../services/categoryService";

const buildTreeWithSubcategories = async (mainCats) => {
  const mainCatsArray = Array.isArray(mainCats) ? mainCats : mainCats?.data || [];

  return Promise.all(
    mainCatsArray.map(async (cat) => {
      try {
        const subsResponse = await getSubcategoriesByCategory(cat.id);
        const subs = Array.isArray(subsResponse)
          ? subsResponse
          : subsResponse?.data || subsResponse?.subcategories || [];
        return { ...cat, subcategories: subs };
      } catch {
        return { ...cat, subcategories: [] };
      }
    })
  );
};

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [forumCategories, setForumCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const doFetchAll = useCallback(async ({ withLoadingState }) => {
    try {
      if (withLoadingState) setLoading(true);

      const [mainCats, forumCats] = await Promise.all([
        getCategories(),
        getForumCategories(),
      ]);

      const flatCats = Array.isArray(mainCats) ? mainCats : mainCats?.data || [];
      setCategories(flatCats);
      setForumCategories(forumCats);

      const tree = await buildTreeWithSubcategories(mainCats);
      setCategoriesTree(tree);

      setError(null);
    } catch (err) {
      setError(err.message || "Erreur de chargement des catégories.");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    await doFetchAll({ withLoadingState: true });
  }, [doFetchAll]);

  useEffect(() => {
    // Wrap async call in an immediately invoked async function to avoid
    // synchronous setState calls in the effect body
    (async () => {
      await doFetchAll({ withLoadingState: false });
    })();
  }, [doFetchAll]);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        categoriesTree,
        forumCategories,
        loading,
        error,
        refreshCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}
