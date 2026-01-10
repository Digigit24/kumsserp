import { OrganizationNodeTree } from "../../../types/core.types";
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Users,
  Briefcase,
  Target,
  FolderTree,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../../lib/utils";
import { Badge } from "../../../components/ui/badge";

interface OrganizationTreeProps {
  nodes: OrganizationNodeTree[];
  level?: number;
}

export const OrganizationTree = ({
  nodes,
  level = 0,
}: OrganizationTreeProps) => {
  if (!nodes || nodes.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        level > 0 && "pl-6 border-l border-gray-200 ml-3"
      )}
    >
      {nodes.map((node) => (
        <OrganizationTreeNode key={node.id} node={node} level={level} />
      ))}
    </div>
  );
};

const OrganizationTreeNode = ({
  node,
  level,
}: {
  node: OrganizationNodeTree;
  level: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  // Get icon based on node type
  const getNodeIcon = () => {
    switch (node.node_type) {
      case "department":
        return <Building2 className="w-4 h-4" />;
      case "unit":
        return <Briefcase className="w-4 h-4" />;
      case "team":
        return <Users className="w-4 h-4" />;
      case "position":
        return <Target className="w-4 h-4" />;
      default:
        return <FolderTree className="w-4 h-4" />;
    }
  };

  // Get color scheme based on node type
  const getColorScheme = () => {
    switch (node.node_type) {
      case "department":
        return {
          border: "border-l-blue-500",
          bg: "bg-blue-50",
          text: "text-blue-600",
          badge: "bg-blue-100 text-blue-700",
        };
      case "unit":
        return {
          border: "border-l-purple-500",
          bg: "bg-purple-50",
          text: "text-purple-600",
          badge: "bg-purple-100 text-purple-700",
        };
      case "team":
        return {
          border: "border-l-green-500",
          bg: "bg-green-50",
          text: "text-green-600",
          badge: "bg-green-100 text-green-700",
        };
      case "position":
        return {
          border: "border-l-orange-500",
          bg: "bg-orange-50",
          text: "text-orange-600",
          badge: "bg-orange-100 text-orange-700",
        };
      default:
        return {
          border: "border-l-gray-500",
          bg: "bg-gray-50",
          text: "text-gray-600",
          badge: "bg-gray-100 text-gray-700",
        };
    }
  };

  const colorScheme = getColorScheme();

  return (
    <div className="relative group animate-in fade-in slide-in-from-top-1 duration-200">
      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border bg-white transition-all",
          "hover:shadow-md hover:border-blue-200",
          "border-l-4",
          colorScheme.border
        )}
      >
        {/* Expand toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "p-1 rounded hover:bg-gray-100 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors",
            !hasChildren && "invisible"
          )}
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Icon */}
        <div
          className={cn(
            "p-2 rounded-full flex items-center justify-center",
            colorScheme.bg,
            colorScheme.text
          )}
        >
          {getNodeIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-sm text-gray-900 truncate">
              {node.name}
            </h4>
            <Badge variant="secondary" className={cn("text-[10px]", colorScheme.badge)}>
              {node.node_type_display}
            </Badge>
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-[10px] text-gray-600">
              {node.code}
            </span>
            <span className="text-xs text-gray-400">Level {node.level}</span>
            {hasChildren && (
              <span className="text-xs text-gray-400">
                • {node.children.length}{" "}
                {node.children.length === 1 ? "child" : "children"}
              </span>
            )}
          </div>

          {node.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
              {node.description}
            </p>
          )}
        </div>

        {/* Active status indicator */}
        {node.is_active && (
          <div className="h-2 w-2 rounded-full bg-green-500" title="Active" />
        )}
        {!node.is_active && (
          <div className="h-2 w-2 rounded-full bg-gray-300" title="Inactive" />
        )}
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div className="mt-2">
          <OrganizationTree nodes={node.children} level={level + 1} />
        </div>
      )}
    </div>
  );
};
