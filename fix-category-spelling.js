// Script to fix the category spelling from "Non-Coffe" to "Non-Coffee"
const fetch = require('node-fetch');

async function fixCategorySpelling() {
  try {
    // First, let's get all menu items to find the category ID
    console.log('Fetching menu items to identify the category...');
    const menuResponse = await fetch('http://127.0.0.1:6543/api/menu');
    
    if (!menuResponse.ok) {
      throw new Error(`Menu API request failed with status ${menuResponse.status}`);
    }
    
    const menuItems = await menuResponse.json();
    console.log(`Successfully fetched ${menuItems.length} menu items`);
    
    // Find a non-coffee item to get the category ID
    const nonCoffeeItem = menuItems.find(item => 
      item.category && 
      item.category.name && 
      (item.category.name === 'Non-Coffe' || item.category.name.toLowerCase() === 'non-coffe')
    );
    
    if (!nonCoffeeItem || !nonCoffeeItem.category) {
      console.log('Could not find any non-coffee items with category information');
      return;
    }
    
    const categoryId = nonCoffeeItem.category.id;
    console.log(`Found Non-Coffee category with ID: ${categoryId}`);
    console.log(`Current category name: "${nonCoffeeItem.category.name}"`);
    
    // Update the category name
    console.log(`Updating category ${categoryId} to correct spelling...`);
    const updateResponse = await fetch(`http://127.0.0.1:6543/api/categories/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Non-Coffee',
        description: nonCoffeeItem.category.description
      })
    });
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Failed to update category: ${updateResponse.status} ${errorText}`);
    }
    
    const updatedCategory = await updateResponse.json();
    console.log('Category updated successfully:');
    console.log(JSON.stringify(updatedCategory, null, 2));
    
    // Verify the update by fetching menu items again
    console.log('\nVerifying the update...');
    const verifyResponse = await fetch('http://127.0.0.1:6543/api/menu');
    const updatedMenu = await verifyResponse.json();
    
    // Find non-coffee items again
    const updatedNonCoffeeItems = updatedMenu.filter(item => 
      item.category && 
      item.category.name && 
      (item.category.name === 'Non-Coffee' || item.category.name.toLowerCase() === 'non-coffee')
    );
    
    console.log(`Found ${updatedNonCoffeeItems.length} items with updated category name:`);
    updatedNonCoffeeItems.forEach(item => {
      console.log(`- ${item.id}: ${item.name} (Category: ${item.category.name})`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixCategorySpelling();
