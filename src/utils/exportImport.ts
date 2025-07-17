// Export and Import utilities for CSV, Excel, and JSON formats
// Note: Install required packages: npm install xlsx file-saver
// For TypeScript: npm install @types/file-saver

export type ExportFormat = 'csv' | 'excel' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeHeaders?: boolean;
  selectedFields?: string[];
  dateFormat?: string;
  encoding?: string;
}

export interface ImportOptions {
  format: ExportFormat;
  hasHeaders?: boolean;
  fieldMapping?: Record<string, string>;
  validateData?: boolean;
  skipEmptyRows?: boolean;
}

export interface ImportResult<T> {
  data: T[];
  errors: Array<{
    row: number;
    field?: string;
    message: string;
  }>;
  warnings: Array<{
    row: number;
    field?: string;
    message: string;
  }>;
  totalRows: number;
  validRows: number;
}

// Export data to various formats
export class DataExporter {
  static async exportData<T extends Record<string, any>>(
    data: T[],
    options: ExportOptions
  ): Promise<void> {
    const {
      format,
      filename = `export_${new Date().toISOString().split('T')[0]}`,
      includeHeaders = true,
      selectedFields,
      dateFormat = 'YYYY-MM-DD'
    } = options;

    // Filter fields if specified
    const processedData = selectedFields
      ? data.map(row => {
          const filteredRow: Record<string, any> = {};
          selectedFields.forEach(field => {
            if (field in row) {
              filteredRow[field] = row[field];
            }
          });
          return filteredRow;
        })
      : data;

    // Format dates and clean data
    const cleanedData = processedData.map(row => {
      const cleanedRow: Record<string, any> = {};
      Object.entries(row).forEach(([key, value]) => {
        if (value instanceof Date) {
          cleanedRow[key] = this.formatDate(value, dateFormat);
        } else if (value === null || value === undefined) {
          cleanedRow[key] = '';
        } else if (typeof value === 'object') {
          cleanedRow[key] = JSON.stringify(value);
        } else {
          cleanedRow[key] = value;
        }
      });
      return cleanedRow;
    });

    switch (format) {
      case 'csv':
        await this.exportCSV(cleanedData, filename, includeHeaders);
        break;
      case 'excel':
        await this.exportExcel(cleanedData, filename, includeHeaders);
        break;
      case 'json':
        await this.exportJSON(cleanedData, filename);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private static async exportCSV<T extends Record<string, any>>(
    data: T[],
    filename: string,
    includeHeaders: boolean
  ): Promise<void> {
    if (data.length === 0) {
      throw new Error('No data to export');
    }

    const headers = Object.keys(data[0]);
    let csvContent = '';

    // Add headers
    if (includeHeaders) {
      csvContent += headers.map(header => this.escapeCSVField(header)).join(',') + '\n';
    }

    // Add data rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return this.escapeCSVField(String(value || ''));
      });
      csvContent += values.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, `${filename}.csv`);
  }

  private static async exportExcel<T extends Record<string, any>>(
    data: T[],
    filename: string,
    includeHeaders: boolean
  ): Promise<void> {
    // For now, export as CSV since we don't have XLSX dependency
    // In a real implementation, you would use XLSX library
    console.warn('Excel export not available, falling back to CSV');
    await this.exportCSV(data, filename, includeHeaders);
  }

  private static async exportJSON<T extends Record<string, any>>(
    data: T[],
    filename: string
  ): Promise<void> {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    this.downloadBlob(blob, `${filename}.json`);
  }

  private static escapeCSVField(field: string): string {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }

  private static downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private static formatDate(date: Date, format: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }
}

// Import data from various formats
export class DataImporter {
  static async importData<T extends Record<string, any>>(
    file: File,
    options: ImportOptions
  ): Promise<ImportResult<T>> {
    const {
      format,
      hasHeaders = true,
      fieldMapping = {},
      validateData = true,
      skipEmptyRows = true
    } = options;

    let rawData: any[][];

    switch (format) {
      case 'csv':
        rawData = await this.parseCSV(file);
        break;
      case 'excel':
        rawData = await this.parseExcel(file);
        break;
      case 'json':
        return await this.parseJSON(file, options);
      default:
        throw new Error(`Unsupported import format: ${format}`);
    }

    return this.processRawData<T>(rawData, {
      hasHeaders,
      fieldMapping,
      validateData,
      skipEmptyRows
    });
  }

  private static async parseCSV(file: File): Promise<any[][]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const rows = text.split('\n').map(row => {
            const cells: string[] = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < row.length; i++) {
              const char = row[i];
              
              if (char === '"') {
                if (inQuotes && row[i + 1] === '"') {
                  current += '"';
                  i++; // Skip next quote
                } else {
                  inQuotes = !inQuotes;
                }
              } else if (char === ',' && !inQuotes) {
                cells.push(current.trim());
                current = '';
              } else {
                current += char;
              }
            }
            
            cells.push(current.trim());
            return cells;
          });
          
          resolve(rows);
        } catch (error) {
          reject(new Error('Failed to parse CSV file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  private static async parseExcel(file: File): Promise<any[][]> {
    // For now, throw an error since we don't have XLSX dependency
    // In a real implementation, you would use XLSX library
    throw new Error('Excel import not available. Please use CSV or JSON format.');
  }

  private static async parseJSON<T>(
    file: File,
    options: ImportOptions
  ): Promise<ImportResult<T>> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const data = JSON.parse(text);
          
          if (!Array.isArray(data)) {
            reject(new Error('JSON file must contain an array of objects'));
            return;
          }

          const result: ImportResult<T> = {
            data: data as T[],
            errors: [],
            warnings: [],
            totalRows: data.length,
            validRows: data.length
          };

          // Apply field mapping if provided
          if (Object.keys(options.fieldMapping || {}).length > 0) {
            result.data = data.map(row => {
              const mappedRow: any = {};
              Object.entries(row).forEach(([key, value]) => {
                const mappedKey = options.fieldMapping![key] || key;
                mappedRow[mappedKey] = value;
              });
              return mappedRow;
            });
          }

          resolve(result);
        } catch (error) {
          reject(new Error('Failed to parse JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  private static processRawData<T>(
    rawData: any[][],
    options: {
      hasHeaders: boolean;
      fieldMapping: Record<string, string>;
      validateData: boolean;
      skipEmptyRows: boolean;
    }
  ): ImportResult<T> {
    const { hasHeaders, fieldMapping, validateData, skipEmptyRows } = options;
    const result: ImportResult<T> = {
      data: [],
      errors: [],
      warnings: [],
      totalRows: rawData.length,
      validRows: 0
    };

    if (rawData.length === 0) {
      return result;
    }

    // Get headers
    let headers: string[];
    let dataStartIndex: number;

    if (hasHeaders) {
      headers = rawData[0].map(header => String(header || '').trim());
      dataStartIndex = 1;
    } else {
      headers = rawData[0].map((_, index) => `column_${index + 1}`);
      dataStartIndex = 0;
    }

    // Apply field mapping to headers
    const mappedHeaders = headers.map(header => fieldMapping[header] || header);

    // Process data rows
    for (let i = dataStartIndex; i < rawData.length; i++) {
      const row = rawData[i];
      const rowIndex = i + 1;

      // Skip empty rows if requested
      if (skipEmptyRows && row.every(cell => !cell || String(cell).trim() === '')) {
        continue;
      }

      const rowData: any = {};
      let hasErrors = false;

      // Process each cell
      for (let j = 0; j < headers.length; j++) {
        const fieldName = mappedHeaders[j];
        const cellValue = row[j];

        try {
          rowData[fieldName] = this.parseValue(cellValue);
        } catch (error) {
          result.errors.push({
            row: rowIndex,
            field: fieldName,
            message: `Invalid value: ${cellValue}`
          });
          hasErrors = true;
        }
      }

      // Validate data if requested
      if (validateData && !hasErrors) {
        const validation = this.validateRow(rowData, rowIndex);
        result.errors.push(...validation.errors);
        result.warnings.push(...validation.warnings);
        hasErrors = validation.errors.length > 0;
      }

      if (!hasErrors) {
        result.data.push(rowData as T);
        result.validRows++;
      }
    }

    return result;
  }

  private static parseValue(value: any): any {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const stringValue = String(value).trim();

    // Try to parse as number
    if (/^-?\d+\.?\d*$/.test(stringValue)) {
      const numValue = Number(stringValue);
      if (!isNaN(numValue)) {
        return numValue;
      }
    }

    // Try to parse as boolean
    if (stringValue.toLowerCase() === 'true') return true;
    if (stringValue.toLowerCase() === 'false') return false;

    // Try to parse as date
    const dateValue = new Date(stringValue);
    if (!isNaN(dateValue.getTime()) && stringValue.includes('-')) {
      return dateValue.toISOString();
    }

    return stringValue;
  }

  private static validateRow(
    row: Record<string, any>,
    rowIndex: number
  ): {
    errors: Array<{ row: number; field?: string; message: string }>;
    warnings: Array<{ row: number; field?: string; message: string }>;
  } {
    const errors: Array<{ row: number; field?: string; message: string }> = [];
    const warnings: Array<{ row: number; field?: string; message: string }> = [];

    // Basic validation rules
    Object.entries(row).forEach(([field, value]) => {
      // Check for required fields (customize based on your needs)
      if (['title', 'name', 'email'].includes(field) && (!value || String(value).trim() === '')) {
        errors.push({
          row: rowIndex,
          field,
          message: `${field} is required`
        });
      }

      // Validate email format
      if (field === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(value))) {
          errors.push({
            row: rowIndex,
            field,
            message: 'Invalid email format'
          });
        }
      }

      // Validate phone format
      if (field === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(String(value).replace(/\s/g, ''))) {
          warnings.push({
            row: rowIndex,
            field,
            message: 'Phone number format may be invalid'
          });
        }
      }

      // Check for very long text fields
      if (typeof value === 'string' && value.length > 1000) {
        warnings.push({
          row: rowIndex,
          field,
          message: 'Text field is very long and may be truncated'
        });
      }
    });

    return { errors, warnings };
  }
}

// Utility functions for bulk operations
export const BulkOperations = {
  // Process data in chunks to avoid overwhelming the database
  async processInChunks<T, R>(
    data: T[],
    processor: (chunk: T[]) => Promise<R[]>,
    chunkSize: number = 100,
    onProgress?: (processed: number, total: number) => void
  ): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const chunkResults = await processor(chunk);
      results.push(...chunkResults);
      
      if (onProgress) {
        onProgress(Math.min(i + chunkSize, data.length), data.length);
      }
    }
    
    return results;
  },

  // Validate data before bulk operations
  validateBulkData<T extends Record<string, any>>(
    data: T[],
    requiredFields: string[],
    uniqueFields: string[] = []
  ): {
    valid: T[];
    invalid: Array<{ row: number; data: T; errors: string[] }>;
  } {
    const valid: T[] = [];
    const invalid: Array<{ row: number; data: T; errors: string[] }> = [];
    const uniqueValues: Record<string, Set<any>> = {};

    // Initialize unique value tracking
    uniqueFields.forEach(field => {
      uniqueValues[field] = new Set();
    });

    data.forEach((row, index) => {
      const errors: string[] = [];

      // Check required fields
      requiredFields.forEach(field => {
        if (!row[field] || String(row[field]).trim() === '') {
          errors.push(`Missing required field: ${field}`);
        }
      });

      // Check unique fields
      uniqueFields.forEach(field => {
        const value = row[field];
        if (value && uniqueValues[field].has(value)) {
          errors.push(`Duplicate value for ${field}: ${value}`);
        } else if (value) {
          uniqueValues[field].add(value);
        }
      });

      if (errors.length > 0) {
        invalid.push({ row: index + 1, data: row, errors });
      } else {
        valid.push(row);
      }
    });

    return { valid, invalid };
  }
};
