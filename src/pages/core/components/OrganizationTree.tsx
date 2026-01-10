import { useMemo, useState } from "react";
import {
  Building2,
  Users,
  Briefcase,
  Target,
  FolderTree,
  Minus,
  Plus,
} from "lucide-react";
import { OrganizationNodeTree } from "../../../types/core.types";
import { cn } from "../../../lib/utils";
import { Badge } from "../../../components/ui/badge";

type ColorScheme = {
  border: string;
  bg: string;
  text: string;
  badge: string;
};

const colorByType: Record<string, ColorScheme> = {
  ceo: {
    border: "border-gray-400",
    bg: "bg-gray-50",
    text: "text-gray-700",
    badge: "bg-gray-200 text-gray-800",
  },
  college: {
    border: "border-blue-300",
    bg: "bg-blue-50",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700",
  },
  department: {
    border: "border-indigo-300",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    badge: "bg-indigo-100 text-indigo-700",
  },
  unit: {
    border: "border-purple-300",
    bg: "bg-purple-50",
    text: "text-purple-700",
    badge: "bg-purple-100 text-purple-700",
  },
  team: {
    border: "border-emerald-300",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700",
  },
  position: {
    border: "border-amber-300",
    bg: "bg-amber-50",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700",
  },
  default: {
    border: "border-slate-300",
    bg: "bg-slate-50",
    text: "text-slate-700",
    badge: "bg-slate-100 text-slate-700",
  },
};

const iconByType: Record<string, JSX.Element> = {
  ceo: <Building2 className="w-4 h-4" />,
  college: <Building2 className="w-4 h-4" />,
  department: <Building2 className="w-4 h-4" />,
  unit: <Briefcase className="w-4 h-4" />,
  team: <Users className="w-4 h-4" />,
  position: <Target className="w-4 h-4" />,
  default: <FolderTree className="w-4 h-4" />,
};

interface OrganizationTreeProps {
  nodes: OrganizationNodeTree[];
}

export const OrganizationTree = ({ nodes }: OrganizationTreeProps) => {
  if (!nodes || nodes.length === 0) return null;
  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="flex justify-start w-full">
        <div className="flex items-start justify-start gap-8 px-4 min-w-fit whitespace-nowrap">
          {nodes.map((node) => (
            <OrgNode key={node.id} node={node} isRoot />
          ))}
        </div>
      </div>
    </div>
  );
};

const OrgNode = ({
  node,
  isRoot = false,
}: {
  node: OrganizationNodeTree;
  isRoot?: boolean;
}) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const scheme = colorByType[node.node_type || ""] || colorByType.default;
  const icon = iconByType[node.node_type || ""] || iconByType.default;

  const children = useMemo(() => node.children || [], [node.children]);

  return (
    <div className="flex flex-col items-center min-w-[180px]">
      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            "rounded-md border bg-white px-4 py-3 shadow-sm",
            "min-w-[180px] text-center transition hover:shadow-md",
            scheme.border,
            "border",
            "flex flex-col gap-1"
          )}
        >
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className={cn("p-2 rounded-full", scheme.bg, scheme.text)}>
                {icon}
              </span>
              <span className="font-semibold text-sm text-foreground">
                {node.name}
              </span>
            </div>
            {hasChildren && (
              <button
                className="ml-2 rounded hover:bg-muted p-1 transition"
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? (
                  <Minus className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Plus className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )}
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <Badge className={cn("text-[10px]", scheme.badge)}>
              {node.node_type_display || node.node_type || "Node"}
            </Badge>
            {node.is_active !== undefined && (
              <span
                className={cn(
                  "flex items-center gap-1",
                  node.is_active ? "text-emerald-600" : "text-slate-400"
                )}
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    node.is_active ? "bg-emerald-500" : "bg-slate-300"
                  )}
                />
                {node.is_active ? "Active" : "Inactive"}
              </span>
            )}
          </div>
          {node.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {node.description}
            </p>
          )}
        </div>
        {hasChildren && expanded && (
          <div className="absolute left-1/2 -bottom-5 h-5 w-px bg-slate-300" />
        )}
      </div>

      {hasChildren && expanded && (
        <div className="flex flex-col items-center">
          <div className="relative flex w-full justify-center">
            <div className="absolute left-0 right-0 top-2 h-px bg-slate-300" />
            <div className="flex items-start justify-center gap-8 whitespace-nowrap pt-4">
              {children.map((child) => (
                <div key={child.id} className="relative flex flex-col items-center">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-3 w-px bg-slate-300" />
                  <OrgNode node={child} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
