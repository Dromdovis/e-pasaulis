'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { pb } from '@/lib/db';
import { Product } from '@/types';
import BulkProductEdit from '@/components/admin/BulkProductEdit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';

export default function BulkOperationsPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState("users");
  const [csvData, setCsvData] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState(false);

  // Fetch products when needed
  const fetchProducts = async () => {
    try {
      const records = await pb.collection('products').getFullList<Product>({
        requestKey: null
      });
      setProducts(records);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdateEmailVisibility = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await AuthService.updateAllUsersEmailVisibility();
      setSuccess('All users email visibility updated successfully');
    } catch (err) {
      console.error('Error updating email visibility:', err);
      
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update email visibility');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProductPrices = async (percentageChange: number) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Get all products
      const products = await pb.collection('products').getFullList<Product>({
        requestKey: null
      });
      
      // Update each product's price
      const updates = products.map(product => {
        const newPrice = Math.round(product.price * (1 + percentageChange / 100) * 100) / 100;
        
        return pb.collection('products').update(product.id, { 
          price: newPrice
        }, {
          requestKey: null
        });
      });
      
      await Promise.all(updates);
      
      const changeText = percentageChange > 0 ? 'increased' : 'decreased';
      setSuccess(`All product prices ${changeText} by ${Math.abs(percentageChange)}%`);
    } catch (err) {
      console.error('Error updating product prices:', err);
      
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update product prices');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProductStock = async (action: 'increase' | 'zero' | 'random') => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Get all products
      const products = await pb.collection('products').getFullList<Product>({
        requestKey: null
      });
      
      // Update each product's stock
      const updates = products.map(product => {
        let newStock: number;
        
        switch (action) {
          case 'increase':
            newStock = product.stock + 10;
            break;
          case 'zero':
            newStock = 0;
            break;
          case 'random':
            newStock = Math.floor(Math.random() * 100);
            break;
          default:
            newStock = product.stock;
        }
        
        return pb.collection('products').update(product.id, {
          stock: newStock
        }, {
          requestKey: null
        });
      });
      
      await Promise.all(updates);
      
      let successMessage: string;
      if (action === 'increase') {
        successMessage = 'All product stock increased by 10';
      } else if (action === 'zero') {
        successMessage = 'All product stock set to 0';
      } else {
        successMessage = 'All product stock set to random values';
      }
      
      setSuccess(successMessage);
    } catch (err) {
      console.error('Error updating product stock:', err);
      
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update product stock');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileSelected(!!file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvData(text);
      };
      reader.readAsText(file);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCsvData(null);
    setFileSelected(false);
  };

  // Dummy function for save handling
  const handleSaveUsers = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Users saved successfully!");
    }, 1000);
  };

  // Tabs content components to keep the main component cleaner
  const UsersTabContent = () => (
    <div className="space-y-4">
      <div className="grid gap-4">
        <label className="block">
          <span className="text-gray-700 dark:text-gray-300">CSV File</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
      </div>

      {csvData && (
        <div className="overflow-auto max-h-96 border rounded-md p-4">
          <pre className="text-sm">{csvData}</pre>
        </div>
      )}

      <Button 
        onClick={handleSaveUsers} 
        disabled={!fileSelected || loading}
        className="w-full"
      >
        {loading ? (t('loading') || 'Loading...') : (t('save') || 'Save')}
      </Button>
    </div>
  );

  // Products tab with our specialized component
  const ProductsTabContent = () => (
    <BulkProductEdit 
      products={products} 
      onUpdate={fetchProducts} 
    />
  );

  // Products tab with our specialized component
  const ExportTabContent = () => (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-2">Products Export</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Export your product catalog in CSV format. This file can be used for backups or to make bulk edits.
        </p>
        <Button onClick={() => alert("Export functionality would go here")}>
          Export Products
        </Button>
      </div>
      
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-2">Users Export</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Export your user database in CSV format. This excludes sensitive information like passwords.
        </p>
        <Button onClick={() => alert("Export functionality would go here")}>
          Export Users
        </Button>
      </div>
      
      <div className="rounded-lg border p-4">
        <h3 className="text-lg font-medium mb-2">Orders Export</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Export orders data for accounting, fulfillment, or analysis purposes.
        </p>
        <Button onClick={() => alert("Export functionality would go here")}>
          Export Orders
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('bulk_operations') || 'Bulk Operations'}</h1>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{success}</h3>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="users" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users Import</TabsTrigger>
          <TabsTrigger value="products">Products Import</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="p-4 rounded-md border mt-2">
          <h2 className="text-xl font-semibold mb-2">
            {t('users') || 'Users'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('users_description') || 'Import multiple user accounts at once using a CSV file.'}
          </p>
          <UsersTabContent />
        </TabsContent>
        <TabsContent value="products" className="p-4 rounded-md border mt-2">
          <h2 className="text-xl font-semibold mb-2">
            {t('products') || 'Products'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('products_description') || 'Import or edit multiple products at once.'}
          </p>
          <ProductsTabContent />
        </TabsContent>
        <TabsContent value="export" className="p-4 rounded-md border mt-2">
          <h2 className="text-xl font-semibold mb-2">
            {t('products') || 'Products'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('products_description') || 'Export your data in CSV format for backups or external processing.'}
          </p>
          <ExportTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
} 