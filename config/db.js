// Mock database configuration for development
// In a real application, you would use mysql2, pg, or another database driver

const mockDb = {
  query: (sql, values, callback) => {
    // Mock database response
    console.log('Mock DB Query:', sql);
    console.log('Mock DB Values:', values);
    
    // Simulate successful response
    setTimeout(() => {
      callback(null, [{ id: 1, message: 'Mock response' }]);
    }, 100);
  }
};

module.exports = mockDb; 