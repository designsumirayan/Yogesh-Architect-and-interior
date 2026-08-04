import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/admin/members")({
  component: () => (
    <ResourceManager
      table={"team_members" as never}
      title="Team Members"
      subtitle="Add, edit, or remove members shown on the Team page."
      orderBy={{ column: "sort_order", ascending: true }}
      defaults={{ published: true, sort_order: 0 }}
      listColumns={[
        { name: "name", label: "Name" },
        { name: "designation", label: "Designation" },
        { name: "sort_order", label: "Order" },
        { name: "published", label: "Live" },
      ]}
      fields={[
        { name: "name", label: "Full Name", required: true },
        { name: "designation", label: "Designation", required: true, placeholder: "e.g. Civil Engineer" },
        { name: "image_url", label: "Photo", type: "image" },
        { name: "bio", label: "About / Bio", type: "textarea", placeholder: "Short paragraph about this member…" },
        { name: "sort_order", label: "Sort order (lower = first)", type: "number" },
        { name: "published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});
