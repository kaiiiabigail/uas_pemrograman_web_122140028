// Simple script to fetch non-coffee menu items
const fetch = require('node-fetch');

async function fetchNonCoffeeItems() {
  try {
    console.log('Fetching menu items from API...');
    const response = await fetch('http://127.0.0.1:6543/api/menu');
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const text = await response.text();
    let data;
    
    try {
      // Try to parse the JSON response
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      console.log('Raw response:', text);
      return;
    }
    
    console.log(`Successfully fetched ${data.length} menu items`);
    
    // Filter for non-coffee items (check for both 'Non-Coffee' and 'Non-Coffe' due to possible typo in data)
    const nonCoffeeItems = data.filter(item => 
      item.category && 
      item.category.name && 
      (item.category.name.toLowerCase() === 'non-coffee' || 
       item.category.name.toLowerCase() === 'non-coffe')
    );
    
    console.log(`Found ${nonCoffeeItems.length} non-coffee items:`);
    console.log(JSON.stringify(nonCoffeeItems, null, 2));
  } catch (error) {
    console.error('Error fetching non-coffee items:', error);
  }
}

fetchNonCoffeeItems();
