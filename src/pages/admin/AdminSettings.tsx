import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Database,
  Shield,
  Bell,
  Palette,
  Globe,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  BookOpen,
  Users,
  Clock,
  Lock,
  Eye,
  Moon,
  Sun,
  Download,
  Upload,
  DollarSign,
  Bookmark,
  Zap,
  Mail,
  Phone,
  FileText,
  Activity,
  HardDrive,
  Archive,
  Calendar,
  X
} from 'lucide-react';

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'IDARAH WALI UL ASER Islamic Library',
      siteDescription: 'Digital Islamic Educational Institution and Maktabah',
      contactEmail: 'admin@idarahwaliulaser.org',
      contactPhone: '+91-XXXX-XXXXXX',
      address: 'Chattergam, Kashmir, India',
      website: 'https://idarahwaliulaser.org',
      maxBooksPerUser: 5,
      borrowingPeriodDays: 14,
      renewalLimit: 2,
      institutionType: 'Islamic Educational Institution',
      establishedYear: 2005,
      location: 'Chattergam, Kashmir',
      timezone: 'Asia/Kolkata',
      academicYearStart: '04-01', // April 1st
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      workingHours: { start: '09:00', end: '17:00' }
    },
    library: {
      defaultLanguage: 'en',
      enableArabicSupport: true,
      enableUrduSupport: true,
      enablePersianSupport: true,
      enableTurkishSupport: false,
      autoBackupEnabled: true,
      backupFrequency: 'daily',
      backupRetentionDays: 30,
      maxFileSize: 50, // MB
      allowedFileTypes: ['pdf', 'epub', 'audio', 'video'],
      enableDigitalLibrary: true,
      enablePhysicalLibrary: true,
      catalogingSystem: 'dewey',
      enableReservations: true,
      reservationExpiryHours: 24,
      enableRatings: true,
      enableReviews: true,
      enableBookmarks: true,
      enableReadingProgress: true
    },
    borrowing: {
      maxBooksPerStudent: 5,
      maxBooksPerTeacher: 10,
      maxBooksPerAdmin: 15,
      borrowingPeriodDays: 14,
      renewalPeriodDays: 7,
      maxRenewals: 2,
      overdueGracePeriodDays: 3,
      enableFines: true,
      finePerDay: 1.0, // Currency units
      maxFineAmount: 100.0,
      enableFineWaivers: true,
      autoReturnOverdueBooks: false,
      sendOverdueReminders: true,
      reminderIntervalDays: 3,
      enableHolds: true,
      maxHoldsPerUser: 3,
      holdExpiryDays: 7
    },
    security: {
      enableTwoFactor: false,
      sessionTimeout: 30,
      passwordMinLength: 8,
      requirePasswordChange: false,
      passwordChangeIntervalDays: 90,
      enableLoginLogging: true,
      maxLoginAttempts: 5,
      lockoutDurationMinutes: 15,
      enableIPWhitelist: false,
      allowedIPs: [],
      enableSSL: true,
      enableCORS: true,
      allowedOrigins: ['https://idarahwaliulaser.org'],
      enableRateLimiting: true,
      rateLimit: 100, // requests per minute
      enableAuditLog: true,
      auditLogRetentionDays: 365
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      overdueReminders: true,
      newBookAlerts: true,
      systemMaintenance: true,
      reminderDaysBefore: 3,
      emailProvider: 'smtp',
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: '',
      smtpPassword: '',
      smsProvider: 'twilio',
      twilioAccountSid: '',
      twilioAuthToken: '',
      twilioPhoneNumber: '',
      notificationTemplates: {
        overdueReminder: 'Your book "{bookTitle}" is overdue. Please return it as soon as possible.',
        newBookAlert: 'New book "{bookTitle}" has been added to the library.',
        reservationReady: 'Your reserved book "{bookTitle}" is now available for pickup.'
      }
    },
    appearance: {
      theme: 'light',
      primaryColor: '#10b981',
      secondaryColor: '#3b82f6',
      accentColor: '#8b5cf6',
      enableAnimations: true,
      compactMode: false,
      islamicCalendar: true,
      rightToLeftSupport: true,
      fontSize: 'medium',
      fontFamily: 'inter',
      enableDarkMode: true,
      autoThemeSwitch: false,
      customCSS: '',
      logoUrl: '',
      faviconUrl: '',
      headerColor: '#ffffff',
      sidebarColor: '#f8fafc'
    },
    integrations: {
      enableGoogleBooks: false,
      googleBooksApiKey: '',
      enableOpenLibrary: true,
      enableISBNLookup: true,
      enableBarcodeScan: false,
      enableQRCodes: true,
      enableExternalAuth: false,
      googleAuthEnabled: false,
      googleClientId: '',
      googleClientSecret: '',
      microsoftAuthEnabled: false,
      microsoftClientId: '',
      microsoftClientSecret: '',
      enableWebhooks: false,
      webhookUrl: '',
      webhookSecret: ''
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['institution']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const tabs = [
    { id: 'general', label: 'Institution Settings', icon: Settings, description: 'Basic institution information and policies' },
    { id: 'library', label: 'Maktabah Settings', icon: BookOpen, description: 'Library-specific configurations and preferences' },
    { id: 'borrowing', label: 'Borrowing Rules', icon: Clock, description: 'Book borrowing, returns, and fine policies' },
    { id: 'security', label: 'Security & Access', icon: Shield, description: 'User authentication and security policies' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email, SMS, and system notification preferences' },
    { id: 'appearance', label: 'Interface & Display', icon: Palette, description: 'Theme, language, and display settings' },
    { id: 'integrations', label: 'Integrations', icon: Globe, description: 'External services and API integrations' },
    { id: 'system', label: 'System Management', icon: Database, description: 'Database, backups, and system maintenance' }
  ];

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Track unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Show notification helper
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setIsLoading(true);

    try {
      // Validate settings before saving
      const validationErrors = validateSettings();
      if (validationErrors.length > 0) {
        showNotification('error', `Validation failed: ${validationErrors.join(', ')}`);
        return;
      }

      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real implementation, this would save to Supabase
      console.log('Saving settings:', settings);

      setSaveStatus('success');
      setHasUnsavedChanges(false);
      showNotification('success', 'Settings saved successfully!');

      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      showNotification('error', 'Failed to save settings. Please try again.');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  const validateSettings = (): string[] => {
    const errors: string[] = [];

    // Validate general settings
    if (!settings.general.siteName.trim()) {
      errors.push('Institution name is required');
    }
    if (!settings.general.contactEmail.trim()) {
      errors.push('Contact email is required');
    }
    if (settings.general.maxBooksPerUser < 1 || settings.general.maxBooksPerUser > 50) {
      errors.push('Max books per user must be between 1 and 50');
    }

    // Validate borrowing settings
    if (settings.borrowing.borrowingPeriodDays < 1 || settings.borrowing.borrowingPeriodDays > 365) {
      errors.push('Borrowing period must be between 1 and 365 days');
    }

    // Validate security settings
    if (settings.security.passwordMinLength < 6 || settings.security.passwordMinLength > 32) {
      errors.push('Password minimum length must be between 6 and 32 characters');
    }

    return errors;
  };

  const handleTestConnection = async (type: 'email' | 'sms' | 'database') => {
    setIsTestingConnection(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      showNotification('success', `${type.toUpperCase()} connection test successful!`);
    } catch (error) {
      showNotification('error', `${type.toUpperCase()} connection test failed.`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleResetToDefaults = (category: string) => {
    if (window.confirm(`Are you sure you want to reset ${category} settings to defaults? This action cannot be undone.`)) {
      // Reset specific category to defaults
      const defaultSettings = getDefaultSettings();
      setSettings(prev => ({
        ...prev,
        [category]: defaultSettings[category as keyof typeof defaultSettings]
      }));
      setHasUnsavedChanges(true);
      showNotification('info', `${category} settings reset to defaults`);
    }
  };

  const getDefaultSettings = () => {
    // Return default settings object
    return {
      general: {
        siteName: 'IDARAH WALI UL ASER Islamic Library',
        siteDescription: 'Digital Islamic Educational Institution and Maktabah',
        contactEmail: 'admin@idarahwaliulaser.org',
        maxBooksPerUser: 5,
        borrowingPeriodDays: 14,
        // ... other defaults
      },
      // ... other categories
    };
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `idarah-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('success', 'Settings exported successfully!');
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings(importedSettings);
        setHasUnsavedChanges(true);
        showNotification('success', 'Settings imported successfully!');
      } catch (error) {
        showNotification('error', 'Failed to import settings. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  const renderBorrowingSettings = () => (
    <div className="space-y-8">
      {/* Borrowing Limits */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            Borrowing Limits & Periods
          </h3>
          <button
            onClick={() => handleResetToDefaults('borrowing')}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Reset to Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Books - Students
            </label>
            <input
              type="number"
              value={settings.borrowing.maxBooksPerStudent}
              onChange={(e) => updateSetting('borrowing', 'maxBooksPerStudent', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              min="1"
              max="20"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Maximum books a student can borrow
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Books - Teachers
            </label>
            <input
              type="number"
              value={settings.borrowing.maxBooksPerTeacher}
              onChange={(e) => updateSetting('borrowing', 'maxBooksPerTeacher', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              min="1"
              max="50"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Maximum books a teacher can borrow
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Books - Admins
            </label>
            <input
              type="number"
              value={settings.borrowing.maxBooksPerAdmin}
              onChange={(e) => updateSetting('borrowing', 'maxBooksPerAdmin', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              min="1"
              max="100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Maximum books an admin can borrow
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Borrowing Period (Days)
            </label>
            <input
              type="number"
              value={settings.borrowing.borrowingPeriodDays}
              onChange={(e) => updateSetting('borrowing', 'borrowingPeriodDays', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              min="1"
              max="365"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Default borrowing period for all books
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Renewals
            </label>
            <input
              type="number"
              value={settings.borrowing.maxRenewals}
              onChange={(e) => updateSetting('borrowing', 'maxRenewals', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              min="0"
              max="10"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              How many times a book can be renewed
            </p>
          </div>
        </div>
      </div>

      {/* Fine Management */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-red-600" />
          Fine Management
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Enable Fines</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Charge fines for overdue books</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.borrowing.enableFines}
                onChange={(e) => updateSetting('borrowing', 'enableFines', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
            </label>
          </div>

          {settings.borrowing.enableFines && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fine Per Day (₹)
                </label>
                <input
                  type="number"
                  step="0.50"
                  value={settings.borrowing.finePerDay}
                  onChange={(e) => updateSetting('borrowing', 'finePerDay', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Fine (₹)
                </label>
                <input
                  type="number"
                  value={settings.borrowing.maxFineAmount}
                  onChange={(e) => updateSetting('borrowing', 'maxFineAmount', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  min="0"
                  max="10000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Grace Period (Days)
                </label>
                <input
                  type="number"
                  value={settings.borrowing.overdueGracePeriodDays}
                  onChange={(e) => updateSetting('borrowing', 'overdueGracePeriodDays', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  min="0"
                  max="30"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Holds & Reservations */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Bookmark className="h-5 w-5 mr-2 text-purple-600" />
          Holds & Reservations
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Enable Book Holds</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Allow users to place holds on checked-out books</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.borrowing.enableHolds}
                onChange={(e) => updateSetting('borrowing', 'enableHolds', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {settings.borrowing.enableHolds && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Holds Per User
                </label>
                <input
                  type="number"
                  value={settings.borrowing.maxHoldsPerUser}
                  onChange={(e) => updateSetting('borrowing', 'maxHoldsPerUser', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  min="1"
                  max="20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hold Expiry (Days)
                </label>
                <input
                  type="number"
                  value={settings.borrowing.holdExpiryDays}
                  onChange={(e) => updateSetting('borrowing', 'holdExpiryDays', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  min="1"
                  max="30"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-8">
      {/* Institution Information */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2 text-emerald-600" />
          Institution Information
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Institution Name
            </label>
            <input
              type="text"
              value={settings.general.siteName}
              onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              placeholder="Enter institution name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={settings.general.contactEmail}
              onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              placeholder="admin@institution.org"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Institution Description
          </label>
          <textarea
            value={settings.general.siteDescription}
            onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
            placeholder="Brief description of your Islamic educational institution"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Institution Type
            </label>
            <select
              value={settings.general.institutionType}
              onChange={(e) => updateSetting('general', 'institutionType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
            >
              <option value="Islamic Educational Institution">Islamic Educational Institution</option>
              <option value="Madrasa">Madrasa</option>
              <option value="Islamic University">Islamic University</option>
              <option value="Maktab">Maktab</option>
              <option value="Islamic Research Center">Islamic Research Center</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Established Year
            </label>
            <input
              type="number"
              value={settings.general.establishedYear}
              onChange={(e) => updateSetting('general', 'establishedYear', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={settings.general.location}
              onChange={(e) => updateSetting('general', 'location', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              placeholder="City, Country"
            />
          </div>
        </div>
      </div>

      {/* Library Policies */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
          Library Policies
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Books Per Student
            </label>
            <input
              type="number"
              value={settings.general.maxBooksPerUser}
              onChange={(e) => updateSetting('general', 'maxBooksPerUser', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              min="1"
              max="20"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Maximum number of books a student can borrow simultaneously
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Borrowing Period (Days)
            </label>
            <input
              type="number"
              value={settings.general.borrowingPeriodDays}
              onChange={(e) => updateSetting('general', 'borrowingPeriodDays', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              min="1"
              max="90"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Default borrowing period for books
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSettings = () => (
    <div className="space-y-8">
      {/* Notification Types */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-green-600" />
          Notification Types
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Send notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">SMS Notifications</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Send notifications via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.smsNotifications}
                  onChange={(e) => updateSetting('notifications', 'smsNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Browser push notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.pushNotifications}
                  onChange={(e) => updateSetting('notifications', 'pushNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Overdue Reminders</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Remind users of overdue books</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.overdueReminders}
                  onChange={(e) => updateSetting('notifications', 'overdueReminders', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">New Book Alerts</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Notify about new book additions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.newBookAlerts}
                  onChange={(e) => updateSetting('notifications', 'newBookAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">System Maintenance</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Notify about system updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.systemMaintenance}
                  onChange={(e) => updateSetting('notifications', 'systemMaintenance', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Email Configuration */}
      {settings.notifications.emailNotifications && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-600" />
              Email Configuration
            </h3>
            <button
              onClick={() => handleTestConnection('email')}
              disabled={isTestingConnection}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {isTestingConnection ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <span>Test Connection</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SMTP Host
              </label>
              <input
                type="text"
                value={settings.notifications.smtpHost}
                onChange={(e) => updateSetting('notifications', 'smtpHost', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                placeholder="smtp.gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SMTP Port
              </label>
              <input
                type="number"
                value={settings.notifications.smtpPort}
                onChange={(e) => updateSetting('notifications', 'smtpPort', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                placeholder="587"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SMTP Username
              </label>
              <input
                type="email"
                value={settings.notifications.smtpUsername}
                onChange={(e) => updateSetting('notifications', 'smtpUsername', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                placeholder="your-email@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SMTP Password
              </label>
              <input
                type="password"
                value={settings.notifications.smtpPassword}
                onChange={(e) => updateSetting('notifications', 'smtpPassword', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>
      )}

      {/* SMS Configuration */}
      {settings.notifications.smsNotifications && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Phone className="h-5 w-5 mr-2 text-purple-600" />
              SMS Configuration (Twilio)
            </h3>
            <button
              onClick={() => handleTestConnection('sms')}
              disabled={isTestingConnection}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {isTestingConnection ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <span>Test Connection</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account SID
              </label>
              <input
                type="text"
                value={settings.notifications.twilioAccountSid}
                onChange={(e) => updateSetting('notifications', 'twilioAccountSid', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Auth Token
              </label>
              <input
                type="password"
                value={settings.notifications.twilioAuthToken}
                onChange={(e) => updateSetting('notifications', 'twilioAuthToken', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                placeholder="••••••••••••••••••••••••••••••••"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Twilio Phone Number
              </label>
              <input
                type="tel"
                value={settings.notifications.twilioPhoneNumber}
                onChange={(e) => updateSetting('notifications', 'twilioPhoneNumber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                placeholder="+1234567890"
              />
            </div>
          </div>
        </div>
      )}

      {/* Notification Templates */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-amber-600" />
          Notification Templates
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Overdue Reminder Template
            </label>
            <textarea
              value={settings.notifications.notificationTemplates.overdueReminder}
              onChange={(e) => updateSetting('notifications', 'notificationTemplates', {
                ...settings.notifications.notificationTemplates,
                overdueReminder: e.target.value
              })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              placeholder="Your book '{bookTitle}' is overdue..."
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Available variables: {'{bookTitle}'}, {'{userName}'}, {'{dueDate}'}, {'{daysOverdue}'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Book Alert Template
            </label>
            <textarea
              value={settings.notifications.notificationTemplates.newBookAlert}
              onChange={(e) => updateSetting('notifications', 'notificationTemplates', {
                ...settings.notifications.notificationTemplates,
                newBookAlert: e.target.value
              })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              placeholder="New book '{bookTitle}' has been added..."
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Available variables: {'{bookTitle}'}, {'{author}'}, {'{category}'}, {'{addedDate}'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reservation Ready Template
            </label>
            <textarea
              value={settings.notifications.notificationTemplates.reservationReady}
              onChange={(e) => updateSetting('notifications', 'notificationTemplates', {
                ...settings.notifications.notificationTemplates,
                reservationReady: e.target.value
              })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              placeholder="Your reserved book '{bookTitle}' is ready..."
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Available variables: {'{bookTitle}'}, {'{userName}'}, {'{pickupDeadline}'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <div>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Security Settings</h4>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Changes to security settings require admin confirmation</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Require 2FA for admin accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.enableTwoFactor}
              onChange={(e) => updateSetting('security', 'enableTwoFactor', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
    </div>
  );

  const renderIntegrationsSettings = () => (
    <div className="space-y-8">
      {/* External APIs */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-cyan-200 dark:border-cyan-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-cyan-600" />
          External APIs & Services
        </h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Google Books API</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fetch book metadata from Google Books</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.integrations.enableGoogleBooks}
                onChange={(e) => updateSetting('integrations', 'enableGoogleBooks', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          {settings.integrations.enableGoogleBooks && (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Google Books API Key
              </label>
              <input
                type="password"
                value={settings.integrations.googleBooksApiKey}
                onChange={(e) => updateSetting('integrations', 'googleBooksApiKey', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                placeholder="AIzaSyC..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Get your API key from <a href="https://console.developers.google.com" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">Google Cloud Console</a>
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Open Library API</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Free book metadata from Internet Archive</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.integrations.enableOpenLibrary}
                onChange={(e) => updateSetting('integrations', 'enableOpenLibrary', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">ISBN Lookup</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Automatic book data retrieval by ISBN</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.integrations.enableISBNLookup}
                onChange={(e) => updateSetting('integrations', 'enableISBNLookup', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">QR Code Generation</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Generate QR codes for books and users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.integrations.enableQRCodes}
                onChange={(e) => updateSetting('integrations', 'enableQRCodes', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Authentication Providers */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-indigo-600" />
          External Authentication
        </h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Enable External Auth</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Allow login with external providers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.integrations.enableExternalAuth}
                onChange={(e) => updateSetting('integrations', 'enableExternalAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {settings.integrations.enableExternalAuth && (
            <div className="space-y-6">
              {/* Google Auth */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Google Authentication</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Login with Google accounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.integrations.googleAuthEnabled}
                      onChange={(e) => updateSetting('integrations', 'googleAuthEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {settings.integrations.googleAuthEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Google Client ID
                      </label>
                      <input
                        type="text"
                        value={settings.integrations.googleClientId}
                        onChange={(e) => updateSetting('integrations', 'googleClientId', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                        placeholder="123456789-abc.apps.googleusercontent.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Google Client Secret
                      </label>
                      <input
                        type="password"
                        value={settings.integrations.googleClientSecret}
                        onChange={(e) => updateSetting('integrations', 'googleClientSecret', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                        placeholder="••••••••••••••••••••••••"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Microsoft Auth */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Microsoft Authentication</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Login with Microsoft accounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.integrations.microsoftAuthEnabled}
                      onChange={(e) => updateSetting('integrations', 'microsoftAuthEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {settings.integrations.microsoftAuthEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Microsoft Client ID
                      </label>
                      <input
                        type="text"
                        value={settings.integrations.microsoftClientId}
                        onChange={(e) => updateSetting('integrations', 'microsoftClientId', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                        placeholder="12345678-1234-1234-1234-123456789012"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Microsoft Client Secret
                      </label>
                      <input
                        type="password"
                        value={settings.integrations.microsoftClientSecret}
                        onChange={(e) => updateSetting('integrations', 'microsoftClientSecret', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                        placeholder="••••••••••••••••••••••••"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Webhooks */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-green-600" />
          Webhooks & Integrations
        </h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Enable Webhooks</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Send real-time notifications to external services</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.integrations.enableWebhooks}
                onChange={(e) => updateSetting('integrations', 'enableWebhooks', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </div>

          {settings.integrations.enableWebhooks && (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={settings.integrations.webhookUrl}
                    onChange={(e) => updateSetting('integrations', 'webhookUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="https://your-app.com/webhook"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Webhook Secret
                  </label>
                  <input
                    type="password"
                    value={settings.integrations.webhookSecret}
                    onChange={(e) => updateSetting('integrations', 'webhookSecret', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                    placeholder="••••••••••••••••••••••••"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Webhooks will be sent for book borrowing, returns, new user registrations, and other events.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSystemInfo = () => (
    <div className="space-y-8">
      {/* System Status */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-gray-600" />
          System Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Database</span>
              <span className="flex items-center text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4 mr-1" />
                Connected
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Response time: 45ms
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage</span>
              <span className="text-gray-900 dark:text-white">2.4 GB / 10 GB</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Uptime</span>
              <span className="text-gray-900 dark:text-white">7d 14h 32m</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              99.9% availability
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Memory Usage</span>
              <span className="text-gray-900 dark:text-white">1.2 GB / 4 GB</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">CPU Usage</span>
              <span className="text-gray-900 dark:text-white">15%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '15%' }}></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Backup</span>
              <span className="text-gray-900 dark:text-white">2 hours ago</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Automatic backup
            </div>
          </div>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <HardDrive className="h-5 w-5 mr-2 text-blue-600" />
          Backup & Restore
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Database Backup</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create a complete backup of your library database including all books, users, and borrowing records.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleTestConnection('database')}
                disabled={isTestingConnection}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isTestingConnection ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>Create Backup</span>
              </button>
              <button className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Schedule</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Restore Database</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Restore your database from a previous backup. This will overwrite all current data.
            </p>
            <div className="flex space-x-3">
              <label className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer flex items-center justify-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload Backup</span>
                <input
                  type="file"
                  accept=".sql,.json,.zip"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      showNotification('info', `Selected backup file: ${file.name}`);
                    }
                  }}
                />
              </label>
              <button className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Restore</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Important Notice</h4>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                Always test backups in a staging environment before restoring to production.
                Database restoration will permanently overwrite all existing data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Maintenance */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2 text-purple-600" />
          System Maintenance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => showNotification('info', 'Cache cleared successfully')}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-5 w-5 text-purple-600" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Clear Cache</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Clear application cache</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => showNotification('info', 'Database optimization started')}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <Database className="h-5 w-5 text-purple-600" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Optimize Database</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Optimize database performance</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => showNotification('info', 'System logs exported')}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Export Logs</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Download system logs</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => showNotification('info', 'Security scan initiated')}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Security Scan</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Run security audit</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => showNotification('info', 'Performance analysis started')}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <Activity className="h-5 w-5 text-purple-600" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Performance Check</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Analyze system performance</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleExportSettings}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <Download className="h-5 w-5 text-purple-600" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Export Settings</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Backup configuration</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Import/Export Settings */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Archive className="h-5 w-5 mr-2 text-emerald-600" />
          Configuration Management
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Export Configuration</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Download all system settings as a JSON file for backup or migration purposes.
            </p>
            <button
              onClick={handleExportSettings}
              className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Settings</span>
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Import Configuration</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload a previously exported settings file to restore configuration.
            </p>
            <label className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center justify-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Import Settings</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportSettings}
              />
            </label>
          </div>
        </div>

        {hasUnsavedChanges && (
          <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <div>
                <h4 className="font-medium text-orange-800 dark:text-orange-200">Unsaved Changes</h4>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  You have unsaved changes. Remember to save your settings before exporting.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderLibrarySettings = () => (
    <div className="space-y-8">
      {/* Language & Localization */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-emerald-600" />
          Language & Localization
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Language
            </label>
            <select
              value={settings.library.defaultLanguage}
              onChange={(e) => updateSetting('library', 'defaultLanguage', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
              <option value="ur">Urdu</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              id="arabicSupport"
              checked={settings.library.enableArabicSupport}
              onChange={(e) => updateSetting('library', 'enableArabicSupport', e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="arabicSupport" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable Arabic Support
            </label>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              id="urduSupport"
              checked={settings.library.enableUrduSupport}
              onChange={(e) => updateSetting('library', 'enableUrduSupport', e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="urduSupport" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable Urdu Support
            </label>
          </div>
        </div>
      </div>

      {/* File Management */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Upload className="h-5 w-5 mr-2 text-blue-600" />
          File Management
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum File Size (MB)
            </label>
            <input
              type="number"
              value={settings.library.maxFileSize}
              onChange={(e) => updateSetting('library', 'maxFileSize', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              min="1"
              max="500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Backup Frequency
            </label>
            <select
              value={settings.library.backupFrequency}
              onChange={(e) => updateSetting('library', 'backupFrequency', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoBackup"
              checked={settings.library.autoBackupEnabled}
              onChange={(e) => updateSetting('library', 'autoBackupEnabled', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="autoBackup" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable Automatic Backups
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'library':
        return renderLibrarySettings();
      case 'borrowing':
        return renderBorrowingSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationsSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'integrations':
        return renderIntegrationsSettings();
      case 'system':
        return renderSystemInfo();
      default:
        return (
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Settings panel coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              System Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Configure and manage your Islamic library system
            </p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
              saveStatus === 'success'
                ? 'bg-green-500 text-white'
                : saveStatus === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:shadow-lg hover:scale-105'
            }`}
          >
            {isSaving ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : saveStatus === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            <span>
              {isSaving ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save Changes'}
            </span>
          </button>
        </motion.div>

        {/* Settings Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Settings Categories</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Configure your Islamic library system</p>
              </div>

              <nav className="space-y-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex flex-col items-start space-y-1 px-4 py-4 rounded-xl transition-all duration-200 text-left group ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg transform scale-105'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-102'
                      }`}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <Icon className={`h-5 w-5 flex-shrink-0 ${
                          activeTab === tab.id ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'
                        }`} />
                        <span className="font-medium text-sm">{tab.label}</span>
                      </div>
                      {tab.description && (
                        <p className={`text-xs ml-8 ${
                          activeTab === tab.id ? 'text-emerald-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {tab.description}
                        </p>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              {renderTabContent()}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
