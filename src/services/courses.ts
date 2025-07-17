import { supabase } from '../lib/supabase';
import type { ApiResponse } from '../types';

// Course interfaces based on database schema
export interface Course {
  id: string;
  name: string;
  name_arabic?: string;
  description?: string;
  description_arabic?: string;
  course_code?: string;
  teacher_id?: string;
  class_id?: string;
  academic_year_id?: string;
  duration_weeks?: number;
  total_sessions?: number;
  credits?: number;
  schedule_days?: string[];
  schedule_time?: string;
  max_students?: number;
  current_enrolled?: number;
  enrollment_open?: boolean;
  syllabus?: string;
  learning_objectives?: string[];
  required_books?: string[];
  is_active?: boolean;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  student_id: string;
  enrollment_date?: string;
  status?: 'active' | 'completed' | 'dropped' | 'withdrawn';
  attendance_percentage?: number;
  current_grade?: number;
  final_grade?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Assignment {
  id: string;
  title: string;
  title_arabic?: string;
  description?: string;
  description_arabic?: string;
  course_id: string;
  teacher_id: string;
  assignment_type?: 'homework' | 'quiz' | 'exam' | 'project' | 'essay';
  max_score?: number;
  weight_percentage?: number;
  assigned_date?: string;
  due_date: string;
  late_submission_allowed?: boolean;
  late_penalty_percentage?: number;
  instructions?: string;
  instructions_arabic?: string;
  attachments?: string[];
  required_books?: string[];
  is_published?: boolean;
  allow_resubmission?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  submission_text?: string;
  attachments?: string[];
  submitted_at?: string;
  is_late?: boolean;
  score?: number;
  feedback?: string;
  feedback_arabic?: string;
  graded_by?: string;
  graded_at?: string;
  status?: 'draft' | 'submitted' | 'graded' | 'returned';
  created_at?: string;
  updated_at?: string;
}

export interface Quiz {
  id: string;
  title: string;
  title_arabic?: string;
  description?: string;
  description_arabic?: string;
  course_id?: string;
  teacher_id?: string;
  category?: string;
  total_questions: number;
  duration_minutes?: number;
  max_attempts?: number;
  passing_score?: number;
  available_from?: string;
  available_until?: string;
  is_published?: boolean;
  shuffle_questions?: boolean;
  show_results_immediately?: boolean;
  allow_review?: boolean;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  created_at?: string;
  updated_at?: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_text_arabic?: string;
  question_type?: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  options?: Record<string, string>;
  correct_answer?: string;
  correct_answer_text?: string;
  points?: number;
  question_order?: number;
  explanation?: string;
  explanation_arabic?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  student_id: string;
  attempt_number?: number;
  started_at?: string;
  completed_at?: string;
  score?: number;
  percentage?: number;
  passed?: boolean;
  answers?: Record<string, string>;
  status?: 'in_progress' | 'completed' | 'abandoned';
  created_at?: string;
  updated_at?: string;
}

export type CourseResponse = ApiResponse<Course | Course[]>;
export type CourseEnrollmentResponse = ApiResponse<CourseEnrollment | CourseEnrollment[]>;
export type AssignmentResponse = ApiResponse<Assignment | Assignment[]>;
export type AssignmentSubmissionResponse = ApiResponse<AssignmentSubmission | AssignmentSubmission[]>;
export type QuizResponse = ApiResponse<Quiz | Quiz[]>;
export type QuizQuestionResponse = ApiResponse<QuizQuestion | QuizQuestion[]>;
export type QuizAttemptResponse = ApiResponse<QuizAttempt | QuizAttempt[]>;

class CoursesService {
  // ============================================================================
  // COURSES MANAGEMENT
  // ============================================================================

  // Get all courses with optional filtering
  async getCourses(teacherId?: string, classId?: string, isActive = true): Promise<CourseResponse> {
    try {
      let query = supabase
        .from('courses')
        .select(`
          *,
          teacher:profiles!courses_teacher_id_fkey(id, full_name, name_arabic),
          class:classes(id, name, name_arabic),
          academic_year:academic_years(id, name, is_current)
        `);

      if (teacherId) {
        query = query.eq('teacher_id', teacherId);
      }

      if (classId) {
        query = query.eq('class_id', classId);
      }

      if (isActive !== undefined) {
        query = query.eq('is_active', isActive);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Get course by ID
  async getCourseById(id: string): Promise<CourseResponse> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:profiles!courses_teacher_id_fkey(id, full_name, name_arabic),
          class:classes(id, name, name_arabic),
          academic_year:academic_years(id, name, is_current),
          enrollments:course_enrollments(
            id,
            student_id,
            enrollment_date,
            status,
            student:profiles(id, full_name, name_arabic, student_id)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Create new course
  async createCourse(courseData: Partial<Course>): Promise<CourseResponse> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          ...courseData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Update course
  async updateCourse(id: string, updates: Partial<Course>): Promise<CourseResponse> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Delete course
  async deleteCourse(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // ============================================================================
  // COURSE ENROLLMENTS
  // ============================================================================

  // Get course enrollments
  async getCourseEnrollments(courseId?: string, studentId?: string): Promise<CourseEnrollmentResponse> {
    try {
      let query = supabase
        .from('course_enrollments')
        .select(`
          *,
          course:courses(id, name, name_arabic, course_code),
          student:profiles(id, full_name, name_arabic, student_id)
        `);

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      query = query.order('enrollment_date', { ascending: false });

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Enroll student in course
  async enrollStudent(courseId: string, studentId: string): Promise<CourseEnrollmentResponse> {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: courseId,
          student_id: studentId,
          enrollment_date: new Date().toISOString().split('T')[0],
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      // Update course enrollment count
      await supabase.rpc('increment_course_enrollment', { course_id: courseId });

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Update enrollment status
  async updateEnrollmentStatus(enrollmentId: string, status: string): Promise<CourseEnrollmentResponse> {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', enrollmentId)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // ============================================================================
  // ASSIGNMENTS MANAGEMENT
  // ============================================================================

  // Get assignments
  async getAssignments(courseId?: string, teacherId?: string, studentId?: string): Promise<AssignmentResponse> {
    try {
      let query = supabase
        .from('assignments')
        .select(`
          *,
          course:courses(id, name, name_arabic),
          teacher:profiles!assignments_teacher_id_fkey(id, full_name, name_arabic)
        `);

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      if (teacherId) {
        query = query.eq('teacher_id', teacherId);
      }

      // If student ID is provided, only show published assignments
      if (studentId) {
        query = query.eq('is_published', true);
      }

      query = query.order('due_date', { ascending: true });

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Get assignment by ID
  async getAssignmentById(id: string): Promise<AssignmentResponse> {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          course:courses(id, name, name_arabic),
          teacher:profiles!assignments_teacher_id_fkey(id, full_name, name_arabic),
          submissions:assignment_submissions(
            id,
            student_id,
            submitted_at,
            status,
            score,
            student:profiles(id, full_name, name_arabic, student_id)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Create assignment
  async createAssignment(assignmentData: Partial<Assignment>): Promise<AssignmentResponse> {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert({
          ...assignmentData,
          assigned_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Update assignment
  async updateAssignment(id: string, updates: Partial<Assignment>): Promise<AssignmentResponse> {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // ============================================================================
  // ASSIGNMENT SUBMISSIONS
  // ============================================================================

  // Get assignment submissions
  async getAssignmentSubmissions(assignmentId?: string, studentId?: string): Promise<AssignmentSubmissionResponse> {
    try {
      let query = supabase
        .from('assignment_submissions')
        .select(`
          *,
          assignment:assignments(id, title, title_arabic, due_date, max_score),
          student:profiles(id, full_name, name_arabic, student_id)
        `);

      if (assignmentId) {
        query = query.eq('assignment_id', assignmentId);
      }

      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      query = query.order('submitted_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Submit assignment
  async submitAssignment(submissionData: Partial<AssignmentSubmission>): Promise<AssignmentSubmissionResponse> {
    try {
      const { data, error } = await supabase
        .from('assignment_submissions')
        .insert({
          ...submissionData,
          submitted_at: new Date().toISOString(),
          status: 'submitted',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Grade assignment submission
  async gradeSubmission(submissionId: string, score: number, feedback?: string, gradedBy?: string): Promise<AssignmentSubmissionResponse> {
    try {
      const { data, error } = await supabase
        .from('assignment_submissions')
        .update({
          score,
          feedback,
          graded_by: gradedBy,
          graded_at: new Date().toISOString(),
          status: 'graded',
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // ============================================================================
  // QUIZZES MANAGEMENT
  // ============================================================================

  // Get quizzes
  async getQuizzes(courseId?: string, teacherId?: string, category?: string): Promise<QuizResponse> {
    try {
      let query = supabase
        .from('quizzes')
        .select(`
          *,
          course:courses(id, name, name_arabic),
          teacher:profiles!quizzes_teacher_id_fkey(id, full_name, name_arabic),
          questions:quiz_questions(id, question_text, question_type, points)
        `);

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      if (teacherId) {
        query = query.eq('teacher_id', teacherId);
      }

      if (category) {
        query = query.eq('category', category);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Get quiz by ID with questions
  async getQuizById(id: string): Promise<QuizResponse> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          course:courses(id, name, name_arabic),
          teacher:profiles!quizzes_teacher_id_fkey(id, full_name, name_arabic),
          questions:quiz_questions(
            id,
            question_text,
            question_text_arabic,
            question_type,
            options,
            correct_answer,
            points,
            question_order,
            explanation,
            explanation_arabic
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      // Sort questions by order
      if (data.questions) {
        data.questions.sort((a: any, b: any) => (a.question_order || 0) - (b.question_order || 0));
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Create quiz
  async createQuiz(quizData: Partial<Quiz>): Promise<QuizResponse> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert({
          ...quizData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Update quiz
  async updateQuiz(id: string, updates: Partial<Quiz>): Promise<QuizResponse> {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // ============================================================================
  // QUIZ QUESTIONS
  // ============================================================================

  // Add question to quiz
  async addQuizQuestion(questionData: Partial<QuizQuestion>): Promise<QuizQuestionResponse> {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .insert({
          ...questionData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Update quiz question
  async updateQuizQuestion(id: string, updates: Partial<QuizQuestion>): Promise<QuizQuestionResponse> {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Delete quiz question
  async deleteQuizQuestion(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('id', id);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // ============================================================================
  // QUIZ ATTEMPTS
  // ============================================================================

  // Get quiz attempts
  async getQuizAttempts(quizId?: string, studentId?: string): Promise<QuizAttemptResponse> {
    try {
      let query = supabase
        .from('quiz_attempts')
        .select(`
          *,
          quiz:quizzes(id, title, title_arabic, total_questions, duration_minutes),
          student:profiles(id, full_name, name_arabic, student_id)
        `);

      if (quizId) {
        query = query.eq('quiz_id', quizId);
      }

      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      query = query.order('started_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Start quiz attempt
  async startQuizAttempt(quizId: string, studentId: string): Promise<QuizAttemptResponse> {
    try {
      // Check if student has remaining attempts
      const { data: existingAttempts } = await supabase
        .from('quiz_attempts')
        .select('attempt_number')
        .eq('quiz_id', quizId)
        .eq('student_id', studentId)
        .order('attempt_number', { ascending: false })
        .limit(1);

      const nextAttemptNumber = existingAttempts && existingAttempts.length > 0
        ? (existingAttempts[0].attempt_number || 0) + 1
        : 1;

      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: quizId,
          student_id: studentId,
          attempt_number: nextAttemptNumber,
          started_at: new Date().toISOString(),
          status: 'in_progress',
          answers: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Submit quiz attempt
  async submitQuizAttempt(
    attemptId: string,
    answers: Record<string, string>,
    score?: number
  ): Promise<QuizAttemptResponse> {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .update({
          answers,
          score,
          completed_at: new Date().toISOString(),
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', attemptId)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }

  // Update quiz attempt progress
  async updateQuizProgress(
    attemptId: string,
    answers: Record<string, string>
  ): Promise<QuizAttemptResponse> {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .update({
          answers,
          updated_at: new Date().toISOString()
        })
        .eq('id', attemptId)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }
}

export const coursesService = new CoursesService();
