export function convertToCSV(data: string): string {
    try {
      // Parse the JSON string into an object/array
      const parsedData = JSON.parse(data);
      
      if (!Array.isArray(parsedData)) {
        // If single object, wrap in array
        const dataArray = [parsedData];
        return arrayToCSV(dataArray);
      }
      
      return arrayToCSV(parsedData);
    } catch (error) {
      // If not JSON, split by newlines and create CSV
      const rows = data.split('\n').filter(row => row.trim());
      return rows.join('\n');
    }
  }
  
  function arrayToCSV(data: any[]): string {
    if (data.length === 0) return '';
  
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV header row
    const csvRows = [headers.join(',')];
    
    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header]?.toString() || '';
        // Escape quotes and wrap in quotes if contains comma
        return value.includes(',') ? `"${value.replace(/"/g, '""')}"` : value;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  }