const fetch = require('node-fetch');

const testCustomers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    address: '123 Main St',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '987-654-3210',
    address: '456 Oak Ave',
  },
  {
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '555-555-5555',
    address: '789 Pine Rd',
  },
];

async function createCustomers() {
  for (const customer of testCustomers) {
    try {
      const response = await fetch('http://localhost:3000/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      });
      const data = await response.json();
      console.log(`Created customer: ${customer.name}`, data);
    } catch (error) {
      console.error(`Error creating customer ${customer.name}:`, error.message);
    }
  }
}

createCustomers();
