import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useApi } from '../hooks/useApi';
import { IkigaiInput, RecommendationOutput } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  Target, 
  Heart, 
  Zap, 
  Globe, 
  DollarSign,
  BookOpen,
  Calendar,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const Recommendations: React.FC = () => {
  const api = useApi();
  const [recommendations, setRecommendations] = useState<RecommendationOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IkigaiInput>();

  const onSubmit = async (data: IkigaiInput) => {
    try {
      setLoading(true);
      const response = await api.createRecommendation(data);
      setRecommendations(response.recommendation);
      setSessionId(response.sessionId);
      toast.success('Career recommendations generated successfully!');
    } catch (error) {
      toast.error('Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  const IkigaiIcon = ({ type }: { type: 'love' | 'goodAt' | 'worldNeeds' | 'paidFor' }) => {
    const icons = {
      love: Heart,
      goodAt: Zap,
      worldNeeds: Globe,
      paidFor: DollarSign,
    };
    const Icon = icons[type];
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Career Recommendations</h1>
        <p className="text-secondary-600 mt-2">
          Discover careers that align with your ikigai - what you love, what you're good at, what the world needs, and what you can be paid for.
        </p>
      </div>

      {!recommendations ? (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-secondary-900">Tell Us About Yourself</h2>
            <p className="text-secondary-600">
              Complete the ikigai assessment to get personalized career recommendations
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    What do you love? (Interests & Passions)
                  </label>
                  <textarea
                    rows={3}
                    className="block w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm placeholder-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="e.g., technology, helping others, creative problem-solving..."
                    {...register('interests')}
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    Separate multiple interests with commas
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    What are you good at? (Skills & Strengths)
                  </label>
                  <textarea
                    rows={3}
                    className="block w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm placeholder-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="e.g., programming, communication, analysis, leadership..."
                    {...register('skills')}
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    Separate multiple skills with commas
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    What does the world need? (Values & Mission)
                  </label>
                  <textarea
                    rows={3}
                    className="block w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm placeholder-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="e.g., sustainability, education, healthcare, innovation..."
                    {...register('values')}
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    What causes or values matter most to you?
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    What can you be paid for? (Career Goals)
                  </label>
                  <textarea
                    rows={3}
                    className="block w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm placeholder-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="e.g., software development, consulting, teaching, entrepreneurship..."
                    {...register('goals')}
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    What career paths interest you financially?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Personality Type (Optional)"
                  placeholder="e.g., INTJ, ENFP, etc."
                  {...register('personalityType')}
                />
                <Input
                  label="Preferred Location (Optional)"
                  placeholder="e.g., San Francisco, Remote, etc."
                  {...register('location')}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                <Target className="h-4 w-4 mr-2" />
                Generate Career Recommendations
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Personalized Summary */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-secondary-900">Your Career Profile</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-secondary-700 leading-relaxed">
                  {recommendations.personalizedSummary}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Careers */}
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Recommended Careers</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recommendations.recommendedCareers.map((career, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-secondary-900">{career.title}</h3>
                    <p className="text-secondary-600">{career.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-secondary-900 mb-2">Why This Career Fits You</h4>
                        <p className="text-sm text-secondary-700">{career.whyFit}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-secondary-900 mb-3">Ikigai Alignment</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(career.ikigaiAlignment).map(([key, value]) => (
                            <div key={key} className="flex items-start space-x-2 p-3 bg-secondary-50 rounded-lg">
                              <IkigaiIcon type={key as any} />
                              <div>
                                <p className="text-xs font-medium text-secondary-600 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </p>
                                <p className="text-xs text-secondary-700">{value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Skill Development Plan */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-secondary-900">Skill Development Plan</h2>
              <p className="text-secondary-600">
                Skills to develop for your recommended career paths
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.skillDevelopmentPlan.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      skill.type === 'technical' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      <BookOpen className={`h-4 w-4 ${
                        skill.type === 'technical' ? 'text-blue-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">{skill.skill}</p>
                      <p className="text-xs text-secondary-500 capitalize">{skill.type} skill</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 90-Day Roadmap */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-secondary-900">90-Day Career Roadmap</h2>
              <p className="text-secondary-600">
                A structured plan to start your career transition
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recommendations.roadmap90Days.map((phase, index) => (
                  <div key={index} className="border-l-4 border-primary-500 pl-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Calendar className="h-5 w-5 text-primary-600" />
                      <h3 className="font-semibold text-secondary-900">{phase.phase}</h3>
                    </div>
                    <ul className="space-y-2">
                      {phase.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-secondary-700">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => {
                setRecommendations(null);
                setSessionId(null);
              }}
              variant="outline"
            >
              Generate New Recommendations
            </Button>
            <Button>
              <ArrowRight className="h-4 w-4 mr-2" />
              Create Career Roadmap
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
