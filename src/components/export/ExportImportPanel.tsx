import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Upload, 
  FileText, 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Settings,
  Eye,
  RefreshCw,
  Filter,
  Calendar,
  Users,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { DataExporter, DataImporter, ExportFormat, ImportResult, BulkOperations } from '../../utils/exportImport';

interface ExportImportPanelProps {
  data: any[];
  dataType: 'books' | 'users' | 'borrowing' | 'reports';
  onImport?: (data: any[]) => Promise<void>;
  onExportComplete?: () => void;
  className?: string;
}

export const ExportImportPanel: React.FC<ExportImportPanelProps> = ({
  data,
  dataType,
  onImport,
  onExportComplete,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [importFormat, setImportFormat] = useState<ExportFormat>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult<any> | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get available fields based on data type
  const getAvailableFields = () => {
    if (data.length === 0) return [];
    
    const sampleItem = data[0];
    return Object.keys(sampleItem).map(key => ({
      key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      type: typeof sampleItem[key]
    }));
  };

  const availableFields = getAvailableFields();

  // Initialize selected fields
  React.useEffect(() => {
    if (selectedFields.length === 0 && availableFields.length > 0) {
      setSelectedFields(availableFields.map(field => field.key));
    }
  }, [availableFields, selectedFields.length]);

  const handleExport = async () => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    setIsExporting(true);
    try {
      const filename = `${dataType}_export_${new Date().toISOString().split('T')[0]}`;
      
      await DataExporter.exportData(data, {
        format: exportFormat,
        filename,
        includeHeaders: true,
        selectedFields: selectedFields.length > 0 ? selectedFields : undefined,
        dateFormat: 'YYYY-MM-DD HH:mm:ss'
      });

      onExportComplete?.();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed: ' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const result = await DataImporter.importData(file, {
        format: importFormat,
        hasHeaders: true,
        validateData: true,
        skipEmptyRows: true
      });

      setImportResult(result);
      setPreviewData(result.data.slice(0, 10)); // Show first 10 rows for preview
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed: ' + (error as Error).message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportConfirm = async () => {
    if (!importResult || !onImport) return;

    try {
      await onImport(importResult.data);
      setImportResult(null);
      setPreviewData([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Import confirmation failed:', error);
      alert('Import failed: ' + (error as Error).message);
    }
  };

  const getDataTypeIcon = () => {
    switch (dataType) {
      case 'books': return BookOpen;
      case 'users': return Users;
      case 'borrowing': return Database;
      case 'reports': return BarChart3;
      default: return FileText;
    }
  };

  const DataTypeIcon = getDataTypeIcon();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DataTypeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Export / Import {dataType.charAt(0).toUpperCase() + dataType.slice(1)}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {data.length} records available for export
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('export')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'export'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Download className="h-4 w-4 mr-2 inline" />
              Export
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'import'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Upload className="h-4 w-4 mr-2 inline" />
              Import
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'export' && (
            <motion.div
              key="export"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Export Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Export Format
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['csv', 'json'] as ExportFormat[]).map((format) => (
                    <button
                      key={format}
                      onClick={() => setExportFormat(format)}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        exportFormat === format
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                    >
                      <FileText className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">{format.toUpperCase()}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Field Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Fields to Export
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  {availableFields.map((field) => (
                    <label key={field.key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFields.includes(field.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFields([...selectedFields, field.key]);
                          } else {
                            setSelectedFields(selectedFields.filter(f => f !== field.key));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{field.label}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-2 flex justify-between">
                  <button
                    onClick={() => setSelectedFields(availableFields.map(f => f.key))}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => setSelectedFields([])}
                    className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Export Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleExport}
                  disabled={isExporting || data.length === 0 || selectedFields.length === 0}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isExporting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'import' && (
            <motion.div
              key="import"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Import Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Import Format
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['csv', 'json'] as ExportFormat[]).map((format) => (
                    <button
                      key={format}
                      onClick={() => setImportFormat(format)}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        importFormat === format
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                    >
                      <FileText className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">{format.toUpperCase()}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select File to Import
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <div className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Choose a file to import
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Supported formats: {importFormat.toUpperCase()}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={importFormat === 'csv' ? '.csv' : '.json'}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isImporting ? 'Processing...' : 'Choose File'}
                  </button>
                </div>
              </div>

              {/* Import Results */}
              {importResult && (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Import Summary
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {importResult.totalRows}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Rows</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {importResult.validRows}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Valid Rows</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {importResult.errors.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Errors</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                          {importResult.warnings.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Warnings</div>
                      </div>
                    </div>
                  </div>

                  {/* Errors and Warnings */}
                  {(importResult.errors.length > 0 || importResult.warnings.length > 0) && (
                    <div className="space-y-3">
                      {importResult.errors.length > 0 && (
                        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                          <h5 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Errors ({importResult.errors.length})
                          </h5>
                          <div className="max-h-32 overflow-y-auto">
                            {importResult.errors.slice(0, 5).map((error, index) => (
                              <div key={index} className="text-sm text-red-700 dark:text-red-300">
                                Row {error.row}: {error.message}
                              </div>
                            ))}
                            {importResult.errors.length > 5 && (
                              <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                                ... and {importResult.errors.length - 5} more errors
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {importResult.warnings.length > 0 && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                          <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Warnings ({importResult.warnings.length})
                          </h5>
                          <div className="max-h-32 overflow-y-auto">
                            {importResult.warnings.slice(0, 3).map((warning, index) => (
                              <div key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                                Row {warning.row}: {warning.message}
                              </div>
                            ))}
                            {importResult.warnings.length > 3 && (
                              <div className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                                ... and {importResult.warnings.length - 3} more warnings
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Preview Data */}
                  {previewData.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                          Data Preview (First 10 rows)
                        </h5>
                        <button
                          onClick={() => setShowPreview(!showPreview)}
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {showPreview ? 'Hide' : 'Show'} Preview
                        </button>
                      </div>

                      {showPreview && (
                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                          <div className="overflow-x-auto max-h-64">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                              <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                  {Object.keys(previewData[0] || {}).map((key) => (
                                    <th
                                      key={key}
                                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                    >
                                      {key}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                                {previewData.map((row, index) => (
                                  <tr key={index}>
                                    {Object.values(row).map((value, cellIndex) => (
                                      <td
                                        key={cellIndex}
                                        className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                                      >
                                        {String(value || '')}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Import Actions */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setImportResult(null);
                        setPreviewData([]);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImportConfirm}
                      disabled={importResult.validRows === 0 || !onImport}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Import {importResult.validRows} Records</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
