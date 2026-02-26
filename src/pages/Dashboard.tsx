import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import FileList from "@/components/FileList";
import { Cloud } from "lucide-react";

const Dashboard = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  return (
    <AppLayout
      selectedProjectId={selectedProjectId}
      onSelectProject={setSelectedProjectId}
    >
      {selectedProjectId ? (
        <FileList projectId={selectedProjectId} />
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="text-center animate-fade-in">
            <Cloud className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">Select or create a project to get started</p>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Dashboard;
