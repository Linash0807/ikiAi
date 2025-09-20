import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useApi } from '../hooks/useApi';
import { UserProfile, WorkExperience, Education } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import FileUpload from '../components/ui/FileUpload';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Upload, 
  Save,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const api = useApi();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'experience' | 'education' | 'preferences'>('basic');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserProfile>();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await api.getProfile();
      setProfile(profileData);
      reset(profileData);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UserProfile) => {
    try {
      setSaving(true);
      const updatedProfile = await api.updateProfile(data);
      setProfile(updatedProfile);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'picture' | 'resume') => {
    try {
      setUploading(true);
      const response = type === 'picture' 
        ? await api.uploadProfilePicture(file)
        : await api.uploadResume(file);
      
      const updatedProfile = { ...profile };
      if (type === 'picture') {
        updatedProfile.profilePictureUrl = response.profilePictureUrl;
      } else {
        updatedProfile.resumePath = response.resumePath;
      }
      
      setProfile(updatedProfile);
      toast.success(`${type === 'picture' ? 'Profile picture' : 'Resume'} uploaded successfully!`);
    } catch (error) {
      toast.error(`Failed to upload ${type === 'picture' ? 'profile picture' : 'resume'}`);
    } finally {
      setUploading(false);
    }
  };

  const addWorkExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      role: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    
    const updatedProfile = {
      ...profile,
      workExperience: [...(profile?.workExperience || []), newExperience],
    };
    setProfile(updatedProfile);
  };

  const removeWorkExperience = (id: string) => {
    const updatedProfile = {
      ...profile,
      workExperience: profile?.workExperience?.filter(exp => exp.id !== id) || [],
    };
    setProfile(updatedProfile);
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      graduationDate: '',
    };
    
    const updatedProfile = {
      ...profile,
      education: [...(profile?.education || []), newEducation],
    };
    setProfile(updatedProfile);
  };

  const removeEducation = (id: string) => {
    const updatedProfile = {
      ...profile,
      education: profile?.education?.filter(edu => edu.id !== id) || [],
    };
    setProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'preferences', label: 'Preferences', icon: Edit },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Profile</h1>
        <p className="text-secondary-600 mt-2">
          Manage your professional profile and career information
        </p>
      </div>

      {/* Profile Picture and Resume Upload */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-secondary-900">Documents</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUpload
              label="Profile Picture"
              acceptedFileTypes={['image/*']}
              maxSize={2 * 1024 * 1024} // 2MB
              onFileSelect={(file) => handleFileUpload(file, 'picture')}
              file={null}
              helperText="Upload a professional headshot (max 2MB)"
            />
            
            <FileUpload
              label="Resume"
              acceptedFileTypes={['.pdf', '.doc', '.docx']}
              maxSize={5 * 1024 * 1024} // 5MB
              onFileSelect={(file) => handleFileUpload(file, 'resume')}
              file={null}
              helperText="Upload your resume (PDF, DOC, DOCX - max 5MB)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-secondary-900">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
              <Button type="submit" loading={saving} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    {...register('fullName')}
                    error={errors.fullName?.message}
                  />
                  <Input
                    label="Headline"
                    placeholder="e.g., Software Engineer"
                    {...register('headline')}
                    error={errors.headline?.message}
                  />
                </div>
                
                <Input
                  label="Location"
                  placeholder="e.g., San Francisco, CA"
                  {...register('location')}
                  error={errors.location?.message}
                />
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Summary
                  </label>
                  <textarea
                    rows={4}
                    className="block w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm placeholder-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="Tell us about yourself and your career goals..."
                    {...register('summary')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Skills (comma-separated)
                  </label>
                  <Input
                    placeholder="JavaScript, React, Node.js, Python..."
                    {...register('skills')}
                    error={errors.skills?.message}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Career Goals
                  </label>
                  <textarea
                    rows={3}
                    className="block w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm placeholder-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="What are your career aspirations and goals?"
                    {...register('careerGoals')}
                  />
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-secondary-900">Work Experience</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addWorkExperience}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
                
                {profile?.workExperience?.map((exp, index) => (
                  <div key={exp.id} className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-secondary-900">Experience #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWorkExperience(exp.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Job Title"
                        {...register(`workExperience.${index}.role`)}
                      />
                      <Input
                        label="Company"
                        {...register(`workExperience.${index}.company`)}
                      />
                      <Input
                        label="Start Date"
                        type="date"
                        {...register(`workExperience.${index}.startDate`)}
                      />
                      <Input
                        label="End Date"
                        type="date"
                        {...register(`workExperience.${index}.endDate`)}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        className="block w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm placeholder-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        placeholder="Describe your role and achievements..."
                        {...register(`workExperience.${index}.description`)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-secondary-900">Education</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addEducation}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </div>
                
                {profile?.education?.map((edu, index) => (
                  <div key={edu.id} className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-secondary-900">Education #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(edu.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Institution"
                        {...register(`education.${index}.institution`)}
                      />
                      <Input
                        label="Degree"
                        {...register(`education.${index}.degree`)}
                      />
                      <Input
                        label="Field of Study"
                        {...register(`education.${index}.fieldOfStudy`)}
                      />
                      <Input
                        label="Graduation Date"
                        type="date"
                        {...register(`education.${index}.graduationDate`)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Preferred Job Titles (comma-separated)
                  </label>
                  <Input
                    placeholder="Software Engineer, Product Manager, Data Scientist..."
                    {...register('jobPreferences.jobTitles')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Work Models
                  </label>
                  <div className="space-y-2">
                    {['Remote', 'Hybrid', 'On-site'].map((model) => (
                      <label key={model} className="flex items-center">
                        <input
                          type="checkbox"
                          value={model}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                          {...register('jobPreferences.workModels')}
                        />
                        <span className="ml-2 text-sm text-secondary-700">{model}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Target Industries (comma-separated)
                  </label>
                  <Input
                    placeholder="Technology, Healthcare, Finance, Education..."
                    {...register('jobPreferences.targetIndustries')}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="LinkedIn URL"
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    {...register('links.linkedin')}
                  />
                  <Input
                    label="GitHub URL"
                    type="url"
                    placeholder="https://github.com/username"
                    {...register('links.github')}
                  />
                  <Input
                    label="Portfolio URL"
                    type="url"
                    placeholder="https://yourportfolio.com"
                    {...register('links.portfolio')}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default Profile;
