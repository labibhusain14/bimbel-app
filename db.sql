-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE bimbel.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  full_name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  phone character varying,
  role character varying NOT NULL CHECK (role::text = ANY (ARRAY['admin'::character varying, 'teacher'::character varying, 'student'::character varying]::text[])),
  photo_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE bimbel.student_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  school_name character varying,
  grade character varying,
  parent_name character varying,
  parent_phone character varying,
  birth_date date,
  address text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT student_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES bimbel.users(id)
);
CREATE TABLE bimbel.subjects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT subjects_pkey PRIMARY KEY (id)
);
CREATE TABLE bimbel.classrooms (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL,
  name character varying NOT NULL,
  level character varying,
  schedule_day character varying,
  start_time time without time zone,
  end_time time without time zone,
  lokasi character varying,
  quota integer DEFAULT 20,
  created_at timestamp with time zone DEFAULT now(),
  teacher_id uuid,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying]::text[])),
  CONSTRAINT classrooms_pkey PRIMARY KEY (id),
  CONSTRAINT fk_class_subject FOREIGN KEY (subject_id) REFERENCES bimbel.subjects(id),
  CONSTRAINT fk_classroom_teacher FOREIGN KEY (teacher_id) REFERENCES bimbel.users(id)
);
CREATE TABLE bimbel.student_classrooms (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  classroom_id uuid NOT NULL,
  join_date date DEFAULT CURRENT_DATE,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying, 'completed'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT student_classrooms_pkey PRIMARY KEY (id),
  CONSTRAINT fk_student_classroom_student FOREIGN KEY (student_id) REFERENCES bimbel.users(id),
  CONSTRAINT fk_student_classroom_classroom FOREIGN KEY (classroom_id) REFERENCES bimbel.classrooms(id)
);
CREATE TABLE bimbel.classroom_meetings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  classroom_id uuid NOT NULL,
  meeting_no integer NOT NULL,
  meeting_date date NOT NULL,
  topic character varying,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT classroom_meetings_pkey PRIMARY KEY (id),
  CONSTRAINT fk_meeting_classroom FOREIGN KEY (classroom_id) REFERENCES bimbel.classrooms(id)
);
CREATE TABLE bimbel.materials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL,
  title character varying NOT NULL,
  description text,
  file_url text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT materials_pkey PRIMARY KEY (id),
  CONSTRAINT fk_material_meeting FOREIGN KEY (meeting_id) REFERENCES bimbel.classroom_meetings(id),
  CONSTRAINT fk_material_teacher FOREIGN KEY (created_by) REFERENCES bimbel.users(id)
);
CREATE TABLE bimbel.assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL,
  title character varying NOT NULL,
  description text,
  attachment_url text,
  deadline timestamp with time zone,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT assignments_pkey PRIMARY KEY (id),
  CONSTRAINT fk_assignment_meeting FOREIGN KEY (meeting_id) REFERENCES bimbel.classroom_meetings(id),
  CONSTRAINT fk_assignment_teacher FOREIGN KEY (created_by) REFERENCES bimbel.users(id)
);
CREATE TABLE bimbel.assignment_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL,
  student_id uuid NOT NULL,
  answer_text text,
  file_url text,
  submitted_at timestamp with time zone,
  score numeric,
  feedback text,
  status character varying DEFAULT 'submitted'::character varying CHECK (status::text = ANY (ARRAY['submitted'::character varying, 'late'::character varying, 'reviewed'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT assignment_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT fk_submission_assignment FOREIGN KEY (assignment_id) REFERENCES bimbel.assignments(id),
  CONSTRAINT fk_submission_student FOREIGN KEY (student_id) REFERENCES bimbel.users(id)
);
CREATE TABLE bimbel.attendances (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL,
  student_id uuid NOT NULL,
  status character varying NOT NULL CHECK (status::text = ANY (ARRAY['present'::character varying, 'permit'::character varying, 'sick'::character varying, 'absent'::character varying]::text[])),
  note text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT attendances_pkey PRIMARY KEY (id),
  CONSTRAINT fk_attendance_meeting FOREIGN KEY (meeting_id) REFERENCES bimbel.classroom_meetings(id),
  CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES bimbel.users(id),
  CONSTRAINT fk_attendance_teacher FOREIGN KEY (created_by) REFERENCES bimbel.users(id)
);
CREATE TABLE bimbel.learning_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL,
  student_id uuid NOT NULL,
  understanding_level character varying CHECK (understanding_level::text = ANY (ARRAY['excellent'::character varying, 'good'::character varying, 'fair'::character varying, 'poor'::character varying]::text[])),
  note text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT learning_progress_pkey PRIMARY KEY (id),
  CONSTRAINT fk_progress_meeting FOREIGN KEY (meeting_id) REFERENCES bimbel.classroom_meetings(id),
  CONSTRAINT fk_progress_student FOREIGN KEY (student_id) REFERENCES bimbel.users(id),
  CONSTRAINT fk_progress_teacher FOREIGN KEY (created_by) REFERENCES bimbel.users(id)
);
CREATE TABLE bimbel.assessments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  classroom_id uuid NOT NULL,
  title character varying NOT NULL,
  type character varying CHECK (type::text = ANY (ARRAY['quiz'::character varying, 'tryout'::character varying, 'exam'::character varying]::text[])),
  assessment_date date,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT assessments_pkey PRIMARY KEY (id),
  CONSTRAINT fk_assessment_classroom FOREIGN KEY (classroom_id) REFERENCES bimbel.classrooms(id),
  CONSTRAINT fk_assessment_teacher FOREIGN KEY (created_by) REFERENCES bimbel.users(id)
);
CREATE TABLE bimbel.assessment_scores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL,
  student_id uuid NOT NULL,
  score numeric,
  feedback text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT assessment_scores_pkey PRIMARY KEY (id),
  CONSTRAINT fk_score_assessment FOREIGN KEY (assessment_id) REFERENCES bimbel.assessments(id),
  CONSTRAINT fk_score_student FOREIGN KEY (student_id) REFERENCES bimbel.users(id)
);
CREATE TABLE bimbel.certificates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  classroom_id uuid NOT NULL,
  certificate_number character varying NOT NULL UNIQUE,
  issue_date date,
  file_url text,
  status character varying DEFAULT 'draft'::character varying CHECK (status::text = ANY (ARRAY['draft'::character varying, 'issued'::character varying, 'revoked'::character varying]::text[])),
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT certificates_pkey PRIMARY KEY (id),
  CONSTRAINT fk_certificate_student FOREIGN KEY (student_id) REFERENCES bimbel.users(id),
  CONSTRAINT fk_certificate_classroom FOREIGN KEY (classroom_id) REFERENCES bimbel.classrooms(id),
  CONSTRAINT fk_certificate_admin FOREIGN KEY (created_by) REFERENCES bimbel.users(id)
);
CREATE TABLE bimbel.registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  full_name character varying NOT NULL,
  email character varying,
  phone character varying NOT NULL,
  school_name character varying,
  grade character varying,
  desired_subject uuid,
  notes text,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT registrations_pkey PRIMARY KEY (id),
  CONSTRAINT fk_registration_subject FOREIGN KEY (desired_subject) REFERENCES bimbel.subjects(id)
);