
-- User roles enum and table (must be before profiles trigger)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  storage_used bigint NOT NULL DEFAULT 0,
  storage_limit bigint NOT NULL DEFAULT 1073741824,
  suspended boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (new.id, new.email);
  INSERT INTO public.user_roles (user_id, role) VALUES (new.id, 'user');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Projects table
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  api_key text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own projects" ON public.projects FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can read all projects" ON public.projects FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete all projects" ON public.projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Files table
CREATE TABLE public.files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  size bigint NOT NULL DEFAULT 0,
  type text,
  visibility text NOT NULL DEFAULT 'private',
  storage_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own files" ON public.files FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public files are readable" ON public.files FOR SELECT TO anon USING (visibility = 'public');
CREATE POLICY "Admins can read all files" ON public.files FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', true);

CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-files');
CREATE POLICY "Authenticated users can read own files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'project-files');
CREATE POLICY "Authenticated users can delete own files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-files');
CREATE POLICY "Public can read project files" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'project-files');
