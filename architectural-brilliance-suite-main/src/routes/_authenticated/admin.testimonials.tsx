import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({
  component: () => (
    <ResourceManager
      table="testimonials"
      title="Testimonials"
      subtitle="Manage client testimonials shown across the site."
      orderBy={{ column: "display_order", ascending: true }}
      defaults={{ published: true, rating: 5, display_order: 0 }}
      listColumns={[
        { name: "name", label: "Name" },
        { name: "company", label: "Company" },
        { name: "rating", label: "Rating" },
        { name: "published", label: "Published" },
      ]}
      fields={[
        { name: "name", label: "Client name", required: true },
        { name: "role", label: "Role / Title" },
        { name: "company", label: "Company" },
        { name: "message", label: "Testimonial", type: "textarea", required: true },
        { name: "rating", label: "Rating (1-5)", type: "number" },
        { name: "avatar_url", label: "Avatar", type: "image" },
        { name: "display_order", label: "Display order", type: "number" },
        { name: "published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});
