import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/domains/auth/providers/auth";
import { useGetTeam } from "@/domains/teams/hooks/useGetTeam";
import { useEffect } from "react";
import { LuActivity } from "react-icons/lu";
import { useParams } from "react-router-dom";
import { CreateModuleDialog } from "../components/CreateModuleDialog";
import { ModuleItem } from "../components/ModuleItem";
import { UpdatesList } from "../components/UpdatesList";
import { useModules } from "../hooks/useModules";

export const ModulesList: React.FC = () => {
  const { project } = useAuth();
  const { teamId } = useParams<{ teamId: string }>();
  const { data: team, isLoading } = useGetTeam(project?.id as number, teamId);
  const { fetchModules, data: modules } = useModules();

  useEffect(() => {
    if (!team) return;
    fetchModules(+team.id);
  }, [team]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-secondary py-3 px-5 flex items-center justify-between">
        <p>
          Livrables
          <span className="text-muted-foreground ml-2">{modules?.length}</span>
        </p>

        <div className="flex items-center gap-2">
          {modules && (
            <UpdatesList
              updates={modules?.flatMap(({ updates }) => updates)}
              showModuleName
            >
              <Button
                size="sm"
                variant="outline"
                className="flex gap-1 items-center"
              >
                <LuActivity /> Updates
              </Button>
            </UpdatesList>
          )}
          {team && <CreateModuleDialog teamId={+team.id} />}
        </div>
      </div>

      <div className="w-full flex flex-1 ">
        <div className="w-1/3 border-r">
          {isLoading && (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          )}
          {!isLoading &&
            modules &&
            modules.map((module) => (
              <ModuleItem key={module.id} module={module} />
            ))}
        </div>
        <div className="w-2/3 "></div>
      </div>
    </div>
  );
};
