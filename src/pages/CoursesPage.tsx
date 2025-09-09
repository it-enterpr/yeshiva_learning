import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Clock, ArrowRight } from 'lucide-react';
import { Course } from '../types/global';
import { supabase, demoData, isSupabaseConfigured } from '../lib/supabase';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase!
          .from('courses')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Supabase error, falling back to demo data:', error);
          setCourses(demoData.courses);
        } else {
          setCourses(data || []);
        }
      } else {
        console.log('Using demo data - Supabase not configured');
        setCourses(demoData.courses);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses(demoData.courses);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-300 text-lg">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Torah Study Courses</h1>
        <p className="text-slate-400">Choose a course to begin your learning journey</p>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <Link
            key={course.id}
            to={`/course/${course.id}`}
            className="block bg-slate-800 rounded-xl p-6 border border-slate-700 hover:bg-slate-750 transition-colors"
          >
            <div className="flex items-start mb-4">
              <BookOpen size={24} className="text-blue-500 mt-1" />
              <div className="ml-3 flex-1">
                <h3 className="text-xl font-semibold text-white mb-2 text-right">
                  {course.title}
                </h3>
                <p className="text-slate-400 text-right leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-slate-500">
                  <Users size={16} className="mr-2" />
                  <span className="text-sm">Active students</span>
                </div>
                <div className="flex items-center text-slate-500">
                  <Clock size={16} className="mr-2" />
                  <span className="text-sm">Self-paced</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-blue-500 font-semibold">Start Learning</span>
              <ArrowRight size={20} className="text-blue-500" />
            </div>
          </Link>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-16">
          <BookOpen size={64} className="text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No courses available</h3>
          <p className="text-slate-400">Check back later for new courses</p>
        </div>
      )}
    </div>
  );
}