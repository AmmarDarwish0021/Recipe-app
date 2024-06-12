document.addEventListener('DOMContentLoaded', () => {
    const recipeForm = document.getElementById('recipe-form');
    const recipeTable = document.getElementById('recipe-table').getElementsByTagName('tbody')[0];
    const searchForm = document.getElementById('search-form');
    const searchTitleInput = document.getElementById('search-title');
    const clearFilterButton = document.getElementById('clear-filter');
    const updateSection = document.getElementById('update-section');
    const updateForm = document.getElementById('update-form');
    const updateId = document.getElementById('update-id');
    const updateTitle = document.getElementById('update-title');
    const updateIngredients = document.getElementById('update-ingredients');
    const updateInstructions = document.getElementById('update-instructions');
    const updateCookingTime = document.getElementById('update-cookingTime');
  
    let allRecipes = [];
  
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipes');
        const recipes = await response.json();
        allRecipes = recipes;
        displayRecipes(recipes);
        attachEventListeners();
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
  
    const displayRecipes = (recipes) => {
      recipeTable.innerHTML = '';
      recipes.forEach(recipe => {
        const row = recipeTable.insertRow();
        row.innerHTML = `
          <td>${recipe.title}</td>
          <td>${recipe.ingredients.join(', ')}</td>
          <td>${recipe.instructions}</td>
          <td>${recipe.cookingTime} min</td>
          <td>
            <button class="update" data-id="${recipe._id}">Update</button>
            <button class="delete" data-id="${recipe._id}">Delete</button>
          </td>
        `;
      });
      attachEventListeners();
    };
  
    const attachEventListeners = () => {
      document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', async (e) => {
          const id = e.target.getAttribute('data-id');
          if (confirm('Are you sure you want to delete this recipe?')) {
            await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
            fetchRecipes();
          }
        });
      });
  
      document.querySelectorAll('.update').forEach(button => {
        button.addEventListener('click', async (e) => {
          const id = e.target.getAttribute('data-id');
          const response = await fetch(`/api/recipes/${id}`);
          if (response.ok) {
            const recipe = await response.json();
  
            updateId.value = recipe._id;
            updateTitle.value = recipe.title;
            updateIngredients.value = recipe.ingredients.join(', ');
            updateInstructions.value = recipe.instructions;
            updateCookingTime.value = recipe.cookingTime;
  
            updateSection.style.display = 'block';
            window.scrollTo(0, document.body.scrollHeight);
          } else {
            console.error('Failed to fetch recipe for update');
          }
        });
      });
    };
  
    recipeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value;
      const ingredients = document.getElementById('ingredients').value.split(',');
      const instructions = document.getElementById('instructions').value;
      const cookingTime = document.getElementById('cookingTime').value;
      await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, ingredients, instructions, cookingTime })
      });
      fetchRecipes();
      recipeForm.reset();
    });
  
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = searchTitleInput.value.toLowerCase();
      const filteredRecipes = allRecipes.filter(recipe => recipe.title.toLowerCase().includes(title));
      displayRecipes(filteredRecipes);
    });
  
    clearFilterButton.addEventListener('click', () => {
      searchTitleInput.value = '';
      displayRecipes(allRecipes);
    });
  
    updateForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = updateId.value;
      const title = updateTitle.value;
      const ingredients = updateIngredients.value.split(',');
      const instructions = updateInstructions.value;
      const cookingTime = updateCookingTime.value;
      await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, ingredients, instructions, cookingTime })
      });
      updateSection.style.display = 'none';
      fetchRecipes();
    });
  
    fetchRecipes();
  });
  