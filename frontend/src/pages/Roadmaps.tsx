import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { Roadmap, RoadmapTask, JobDetails } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  Map, 
  Plus, 
  CheckCircle, 
  Circle, 
  Calendar,
  Target,
  TrendingUp,
  Clock,
  Building,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const Roadmaps: React.FC = () => {
  const api = useApi();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingRoadmap, setCreatingRoadmap] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newRoadmap, setNewRoadmap] = useState<Partial<JobDetails>>({
    title: '',
    company: '',
    location: '',
    description: '',
    url: '',
  });

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = async () => {
    try {
      setLoading(true);
      // Mock data for now - in real implementation, you'd fetch from API
      const mockRoadmaps: Roadmap[] = [
        {
          id: '1',
          jobTitle: 'Senior Software Engineer',
          company: 'Tech Corp',
          tasks: [
            {
              id: '1',
              title: 'Complete React certification',
              description: 'Finish the React Developer certification course',
              isCompleted: true,
              phase: 'Foundation',
              dueDate: '2024-01-15',
            },
            {
              id: '2',
              title: 'Build portfolio project',
              description: 'Create a full-stack application showcasing skills',
              isCompleted: false,
              phase: 'Foundation',
              dueDate: '2024-02-01',
            },
            {
              id: '3',
              title: 'Network with industry professionals',
              description: 'Attend 3 tech meetups and connect on LinkedIn',
              isCompleted: false,
              phase: 'Networking',
              dueDate: '2024-02-15',
            },
          ],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15',
        },
      ];
      setRoadmaps(mockRoadmaps);
    } catch (error) {
      toast.error('Failed to load roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const createRoadmap = async () => {
    try {
      setCreatingRoadmap(true);
      const jobDetails: JobDetails = {
        title: newRoadmap.title!,
        company: newRoadmap.company!,
        location: newRoadmap.location,
        description: newRoadmap.description!,
        url: newRoadmap.url!,
      };
      
      await api.createRoadmap(jobDetails);
      toast.success('Roadmap created successfully!');
      setShowCreateForm(false);
      setNewRoadmap({
        title: '',
        company: '',
        location: '',
        description: '',
        url: '',
      });
      loadRoadmaps();
    } catch (error) {
      toast.error('Failed to create roadmap');
    } finally {
      setCreatingRoadmap(false);
    }
  };

  const updateTaskStatus = async (roadmapId: string, task: string, isCompleted: boolean) => {
    try {
      await api.updateRoadmapTask(roadmapId, { task, isCompleted });
      toast.success('Task updated successfully!');
      loadRoadmaps();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const getProgressPercentage = (roadmap: Roadmap) => {
    const completedTasks = roadmap.tasks.filter(task => task.isCompleted).length;
    return Math.round((completedTasks / roadmap.tasks.length) * 100);
  };

  const getPhaseTasks = (roadmap: Roadmap, phase: string) => {
    return roadmap.tasks.filter(task => task.phase === phase);
  };

  const getUniquePhases = (roadmap: Roadmap) => {
  return Array.from(new Set(roadmap.tasks.map(task => task.phase)));
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
          <h1 className="text-3xl font-bold text-secondary-900">Career Roadmaps</h1>
          <p className="text-secondary-600 mt-2">
            Track your progress on personalized 90-day career development plans
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Roadmap
        </Button>
      </div>

      {/* Create Roadmap Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-secondary-900">Create New Roadmap</h2>
            <p className="text-secondary-600">
              Create a 90-day roadmap for a specific job or career goal
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Job Title"
                  placeholder="e.g., Senior Software Engineer"
                  value={newRoadmap.title}
                  onChange={(e) => setNewRoadmap({ ...newRoadmap, title: e.target.value })}
                />
                <Input
                  label="Company"
                  placeholder="e.g., Tech Corp"
                  value={newRoadmap.company}
                  onChange={(e) => setNewRoadmap({ ...newRoadmap, company: e.target.value })}
                />
                <Input
                  label="Location (Optional)"
                  placeholder="e.g., San Francisco, CA"
                  value={newRoadmap.location}
                  onChange={(e) => setNewRoadmap({ ...newRoadmap, location: e.target.value })}
                />
                <Input
                  label="Job URL (Optional)"
                  placeholder="https://company.com/job-posting"
                  value={newRoadmap.url}
                  onChange={(e) => setNewRoadmap({ ...newRoadmap, url: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Job Description
                </label>
                <textarea
                  rows={4}
                  className="block w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm placeholder-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Describe the job requirements and your goals..."
                  value={newRoadmap.description}
                  onChange={(e) => setNewRoadmap({ ...newRoadmap, description: e.target.value })}
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={createRoadmap}
                  loading={creatingRoadmap}
                  disabled={!newRoadmap.title || !newRoadmap.company || !newRoadmap.description}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Create Roadmap
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Roadmaps List */}
      {roadmaps.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Map className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No roadmaps yet</h3>
            <p className="text-secondary-600 mb-6">
              Create your first career roadmap to start tracking your progress
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Roadmap
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {roadmaps.map((roadmap) => (
            <Card key={roadmap.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-secondary-900">{roadmap.jobTitle}</h3>
                    <div className="flex items-center space-x-4 text-sm text-secondary-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <Building className="h-4 w-4" />
                        <span>{roadmap.company}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Created {new Date(roadmap.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {getProgressPercentage(roadmap)}%
                    </div>
                    <div className="text-sm text-secondary-600">Complete</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(roadmap)}%` }}
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {getUniquePhases(roadmap).map((phase) => (
                    <div key={phase}>
                      <div className="flex items-center space-x-2 mb-4">
                        <Target className="h-5 w-5 text-primary-600" />
                        <h4 className="text-lg font-medium text-secondary-900">{phase}</h4>
                        <span className="bg-primary-100 text-primary-800 text-sm font-medium px-2 py-1 rounded-full">
                          {getPhaseTasks(roadmap, phase).length} tasks
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {getPhaseTasks(roadmap, phase).map((task) => (
                          <div
                            key={task.id}
                            className="flex items-start space-x-3 p-3 bg-secondary-50 rounded-lg"
                          >
                            <button
                              onClick={() => updateTaskStatus(roadmap.id, task.title, !task.isCompleted)}
                              className="mt-0.5"
                            >
                              {task.isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <Circle className="h-5 w-5 text-secondary-400 hover:text-primary-500" />
                              )}
                            </button>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h5 className={`font-medium ${
                                  task.isCompleted ? 'text-secondary-500 line-through' : 'text-secondary-900'
                                }`}>
                                  {task.title}
                                </h5>
                                {task.dueDate && (
                                  <div className="flex items-center space-x-1 text-xs text-secondary-500">
                                    <Clock className="h-3 w-3" />
                                    <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-secondary-600 mt-1">{task.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-secondary-200 mt-6">
                  <div className="text-sm text-secondary-600">
                    {roadmap.tasks.filter(task => task.isCompleted).length} of {roadmap.tasks.length} tasks completed
                  </div>
                  <Button variant="outline" size="sm">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Roadmaps;
