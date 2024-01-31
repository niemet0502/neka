import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/domains/auth/providers/auth";
import { useGetTeam } from "@/domains/teams/hooks/useGetTeam";
import { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { ModuleItem } from "../components/ModuleItem";
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

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <button className="mr-2 hover:cursor-pointer text-muted-foreground">
                <AiOutlinePlus />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nouveau livrable</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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