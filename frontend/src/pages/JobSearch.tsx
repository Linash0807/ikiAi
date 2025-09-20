import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useApi } from '../hooks/useApi';
import { JobSearchForm, JobSearchOutput, JobDetails } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  Search, 
  MapPin, 
  Building, 
  ExternalLink,
  Heart,
  Star,
  TrendingUp,
  Target,
  ArrowRight,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const JobSearch: React.FC = () => {
  const api = useApi();
  const [jobResults, setJobResults] = useState<JobSearchOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobSearchForm>();

  const onSubmit = async (data: JobSearchForm) => {
    try {
      setLoading(true);
      const results = await api.searchJobs(data);
      setJobResults(results);
      toast.success('Job search completed successfully!');
    } catch (error) {
      toast.error('Failed to search for jobs');
    } finally {
      setLoading(false);
    }
  };

  const toggleSavedJob = (jobUrl: string) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobUrl)) {
      newSavedJobs.delete(jobUrl);
    } else {
      newSavedJobs.add(jobUrl);
    }
    setSavedJobs(newSavedJobs);
  };

  const JobCard: React.FC<{ job: JobDetails; category: string }> = ({ job, category }) => {
    const isSaved = savedJobs.has(job.url);
    const categoryColors = {
      passionRoles: 'border-green-200 bg-green-50',
      strengthRoles: 'border-blue-200 bg-blue-50',
      growthRoles: 'border-purple-200 bg-purple-50',
    };

    return (
      <Card className={`hover:shadow-lg transition-shadow ${categoryColors[category as keyof typeof categoryColors]}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-secondary-900 mb-1">{job.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-secondary-600">
                <div className="flex items-center space-x-1">
                  <Building className="h-4 w-4" />
                  <span>{job.company}</span>
                </div>
                {job.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => toggleSavedJob(job.url)}
              className={`p-2 rounded-full transition-colors ${
                isSaved ? 'text-red-500 hover:text-red-600' : 'text-secondary-400 hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-secondary-700 line-clamp-3">{job.description}</p>
            
            {job.personalizedFit && (
              <div className="p-3 bg-primary-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Target className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-primary-800 mb-1">Why this job fits you:</p>
                    <p className="text-xs text-primary-700">{job.personalizedFit}</p>
                  </div>
                </div>
              </div>
            )}

            {job.isSteppingStone && (
              <div className="flex items-center space-x-2 text-xs text-warning-600">
                <TrendingUp className="h-4 w-4" />
                <span>Great stepping stone opportunity</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-secondary-200">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-warning-500" />
                  <span className="text-sm font-medium text-secondary-700">
                    {category === 'passionRoles' ? 'Passion Match' : 
                     category === 'strengthRoles' ? 'Strength Match' : 'Growth Opportunity'}
                  </span>
                </div>
              </div>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                <span>View Job</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Job Search</h1>
        <p className="text-secondary-600 mt-2">
          Find personalized job opportunities that match your profile and career goals
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-secondary-900">Search for Jobs</h2>
          <p className="text-secondary-600">
            Our AI will find jobs that match your skills, interests, and career goals
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  label="Search Query"
                  placeholder="e.g., software engineer, data scientist, product manager..."
                  {...register('query', { required: 'Search query is required' })}
                  error={errors.query?.message}
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  className="px-8"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Jobs
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-secondary-600">Searching for jobs...</p>
          </div>
        </div>
      )}

      {jobResults && !loading && (
        <div className="space-y-8">
          {/* Results Summary */}
          <div className="bg-primary-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-primary-900 mb-2">Search Results</h2>
            <p className="text-primary-700">
              Found {jobResults.passionRoles.length + jobResults.strengthRoles.length + jobResults.growthRoles.length} jobs matching your profile
            </p>
          </div>

          {/* Passion Roles */}
          {jobResults.passionRoles.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-secondary-900">Passion Matches</h2>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
                  {jobResults.passionRoles.length} jobs
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobResults.passionRoles.map((job, index) => (
                  <JobCard key={index} job={job} category="passionRoles" />
                ))}
              </div>
            </div>
          )}

          {/* Strength Roles */}
          {jobResults.strengthRoles.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Star className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-secondary-900">Strength Matches</h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
                  {jobResults.strengthRoles.length} jobs
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobResults.strengthRoles.map((job, index) => (
                  <JobCard key={index} job={job} category="strengthRoles" />
                ))}
              </div>
            </div>
          )}

          {/* Growth Roles */}
          {jobResults.growthRoles.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-secondary-900">Growth Opportunities</h2>
                <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2 py-1 rounded-full">
                  {jobResults.growthRoles.length} jobs
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobResults.growthRoles.map((job, index) => (
                  <JobCard key={index} job={job} category="growthRoles" />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {jobResults.passionRoles.length === 0 && 
           jobResults.strengthRoles.length === 0 && 
           jobResults.growthRoles.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">No jobs found</h3>
                <p className="text-secondary-600 mb-6">
                  Try adjusting your search query or complete your profile for better matches
                </p>
                <Button variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Complete Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default JobSearch;
