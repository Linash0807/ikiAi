import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { 
  User, 
  Briefcase, 
  Search, 
  Map, 
  MessageSquare, 
  TrendingUp,
  Target,
  BookOpen,
  ArrowRight
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Complete Your Profile',
      description: 'Add your skills, experience, and career goals',
      icon: User,
      href: '/profile',
      color: 'bg-blue-500',
    },
    {
      title: 'Get Career Recommendations',
      description: 'Discover careers that match your ikigai',
      icon: Target,
      href: '/recommendations',
      color: 'bg-green-500',
    },
    {
      title: 'Search Jobs',
      description: 'Find personalized job opportunities',
      icon: Search,
      href: '/jobs',
      color: 'bg-purple-500',
    },
    {
      title: 'Create Roadmap',
      description: 'Build a 90-day career development plan',
      icon: Map,
      href: '/roadmaps',
      color: 'bg-orange-500',
    },
    {
      title: 'AI Career Chat',
      description: 'Get personalized career advice',
      icon: MessageSquare,
      href: '/chat',
      color: 'bg-indigo-500',
    },
  ];

  const stats = [
    {
      title: 'Profile Completion',
      value: '75%',
      description: 'Complete your profile for better recommendations',
      icon: User,
    },
    {
      title: 'Career Matches',
      value: '12',
      description: 'Careers that match your profile',
      icon: Briefcase,
    },
    {
      title: 'Active Roadmaps',
      value: '3',
      description: 'Career development plans in progress',
      icon: Map,
    },
    {
      title: 'Chat Sessions',
      value: '8',
      description: 'AI conversations this month',
      icon: MessageSquare,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.displayName || 'there'}!
        </h1>
        <p className="text-primary-100 text-lg">
          Ready to continue your career journey? Let's explore what's next.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                  <p className="text-xs text-secondary-500">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 h-12 w-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-secondary-600 mt-1">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-secondary-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">Recent Activity</h2>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-secondary-900">Your Career Journey</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-900">Profile updated</p>
                  <p className="text-xs text-secondary-500">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-900">New career recommendations available</p>
                  <p className="text-xs text-secondary-500">1 day ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-900">Chat session completed</p>
                  <p className="text-xs text-secondary-500">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
