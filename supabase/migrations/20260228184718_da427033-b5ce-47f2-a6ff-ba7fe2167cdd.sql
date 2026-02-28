
-- Trigger to update storage_used on file insert
CREATE OR REPLACE FUNCTION public.update_storage_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE profiles SET storage_used = storage_used + NEW.size WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_file_insert
  AFTER INSERT ON public.files
  FOR EACH ROW EXECUTE FUNCTION public.update_storage_on_insert();

-- Trigger to update storage_used on file delete
CREATE OR REPLACE FUNCTION public.update_storage_on_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE profiles SET storage_used = GREATEST(0, storage_used - OLD.size) WHERE id = OLD.user_id;
  RETURN OLD;
END;
$$;

CREATE TRIGGER on_file_delete
  AFTER DELETE ON public.files
  FOR EACH ROW EXECUTE FUNCTION public.update_storage_on_delete();
