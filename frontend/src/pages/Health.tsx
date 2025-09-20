import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { HealthStatus } from '../types';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import { 
  Heart, 
  Database, 
  Cloud, 
  Cpu, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Clock,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

const Health: React.FC = () => {
  const api = useApi();
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      setLoading(true);
      const status = await api.getHealth();
      setHealthStatus(status);
      setLastChecked(new Date());
    } catch (error) {
      toast.error('Failed to check system health');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'unhealthy':
      case 'disconnected':
      case 'unavailable':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'available':
        return 'text-green-600 bg-green-50';
      case 'unhealthy':
      case 'disconnected':
      case 'unavailable':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">System Health</h1>
          <p className="text-secondary-600 mt-2">
            Monitor the status of all system components and services
          </p>
        </div>
        <Button onClick={checkHealth} loading={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {healthStatus ? (
        <div className="space-y-6">
          {/* Overall Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Heart className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-secondary-900">Overall System Status</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className={`px-4 py-2 rounded-lg ${getStatusColor(healthStatus.status)}`}>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(healthStatus.status)}
                    <span className="font-medium capitalize">{healthStatus.status}</span>
                  </div>
                </div>
                <div className="text-sm text-secondary-600">
                  Last checked: {lastChecked?.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-secondary-600" />
                  <h3 className="font-medium text-secondary-900">Uptime</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary-900">
                  {formatUptime(healthStatus.uptime)}
                </div>
                <div className="text-sm text-secondary-600">
                  System running since {new Date(Date.now() - healthStatus.uptime * 1000).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Cpu className="h-5 w-5 text-secondary-600" />
                  <h3 className="font-medium text-secondary-900">Version</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary-900">
                  {healthStatus.version}
                </div>
                <div className="text-sm text-secondary-600">
                  Current API version
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-secondary-600" />
                  <h3 className="font-medium text-secondary-900">Timestamp</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-secondary-900">
                  {new Date(healthStatus.timestamp).toLocaleString()}
                </div>
                <div className="text-sm text-secondary-600">
                  Last health check
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Status */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-secondary-900">Service Status</h2>
              <p className="text-secondary-600">
                Status of all connected services and dependencies
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5 text-secondary-600" />
                    <div>
                      <h3 className="font-medium text-secondary-900">Database</h3>
                      <p className="text-sm text-secondary-600">Primary data storage</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${getStatusColor(healthStatus.services.database)}`}>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(healthStatus.services.database)}
                      <span className="text-sm font-medium capitalize">
                        {healthStatus.services.database}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Cloud className="h-5 w-5 text-secondary-600" />
                    <div>
                      <h3 className="font-medium text-secondary-900">Firebase</h3>
                      <p className="text-sm text-secondary-600">Authentication and storage</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${getStatusColor(healthStatus.services.firebase)}`}>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(healthStatus.services.firebase)}
                      <span className="text-sm font-medium capitalize">
                        {healthStatus.services.firebase}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Cpu className="h-5 w-5 text-secondary-600" />
                    <div>
                      <h3 className="font-medium text-secondary-900">AI Services</h3>
                      <p className="text-sm text-secondary-600">Gemini AI and recommendations</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${getStatusColor(healthStatus.services.ai)}`}>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(healthStatus.services.ai)}
                      <span className="text-sm font-medium capitalize">
                        {healthStatus.services.ai}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">Unable to check system health</h3>
            <p className="text-secondary-600 mb-6">
              There was an error connecting to the health check endpoint
            </p>
            <Button onClick={checkHealth}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Health;
