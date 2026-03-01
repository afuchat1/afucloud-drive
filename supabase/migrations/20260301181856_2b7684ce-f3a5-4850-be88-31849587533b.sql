
-- Re-create the triggers that are missing
CREATE OR REPLACE TRIGGER on_file_insert
  AFTER INSERT ON public.files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_storage_on_insert();

CREATE OR REPLACE TRIGGER on_file_delete
  AFTER DELETE ON public.files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_storage_on_delete();
