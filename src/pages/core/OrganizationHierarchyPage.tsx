import { useQuery } from "@tanstack/react-query";
import { organizationNodeApi } from "../../services/organization.service";
import { OrganizationTree } from "./components/OrganizationTree";
import { Button } from "../../components/ui/button";
import {
  RefreshCw,
  Plus,
  Building2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { cn } from "../../lib/utils";

export const OrganizationHierarchyPage = () => {
  const {
    data: treeData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["organization-tree"],
    queryFn: async () => {
      const response = await organizationNodeApi.getTree();
      // API returns an array of root nodes; fall back to response.tree if present.
      if (Array.isArray(response)) return response;
      return response?.tree || [];
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const tree = treeData || [];
  const loading = isLoading || isRefetching;

  // Count total nodes recursively
  const countNodes = (nodes: any[]): number => {
    if (!nodes || nodes.length === 0) return 0;
    return nodes.reduce((total, node) => {
      return total + 1 + countNodes(node.children || []);
    }, 0);
  };

  const totalNodes = countNodes(tree);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 px-4 md:px-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Organization Hierarchy
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Visualize and manage your organization's hierarchical structure
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCw
              className={cn("w-4 h-4 mr-2", loading && "animate-spin")}
            />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Node
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load organization hierarchy:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Card */}
      <Card className="w-full rounded-none border-0 shadow-none">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Organization Structure</CardTitle>
              <CardDescription>
                {tree.length === 0 && !loading && !error ? (
                  "No organization nodes found"
                ) : (
                  <>
                    {tree.length} Root Node{tree.length !== 1 ? "s" : ""} •{" "}
                    {totalNodes} Total Node{totalNodes !== 1 ? "s" : ""}
                  </>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 md:px-4">
          {loading && tree.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm">Loading organization structure...</p>
            </div>
          ) : tree.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400 gap-3">
              <Building2 className="w-12 h-12 stroke-1" />
              <div className="text-center">
                <p className="font-medium text-gray-600">No nodes yet</p>
                <p className="text-sm mt-1">
                  Get started by creating your first organization node
                </p>
              </div>
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Create Root Node
              </Button>
            </div>
          ) : (
            <div className="w-full overflow-x-auto pb-4">
              <OrganizationTree nodes={tree} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationHierarchyPage;
