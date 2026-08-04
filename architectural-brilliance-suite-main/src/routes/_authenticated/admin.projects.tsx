import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/admin/projects")({
  component: () => (
    <ResourceManager
      table="projects"
      title="Projects"
      subtitle="Manage the project portfolio shown on /projects."
      orderBy={{ column: "created_at", ascending: false }}
      defaults={{ published: true, featured: false, gallery: [] }}
      listColumns={[
        { name: "title", label: "Title" },
        { name: "category", label: "Category" },
        { name: "location", label: "Location" },
        { name: "year", label: "Year" },
        { name: "featured", label: "Featured" },
        { name: "published", label: "Published" },
      ]}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "slug", label: "Slug (URL)", required: true, placeholder: "lakeview-residence" },
        { name: "category", label: "Category", placeholder: "Residential / Commercial / Interior" },
        { name: "location", label: "Location" },
        { name: "year", label: "Year", type: "number" },
        { name: "client", label: "Client" },
        { name: "summary", label: "Short summary", type: "textarea" },
        { name: "content", label: "Full description", type: "textarea" },
        { name: "cover_url", label: "Cover image", type: "image" },
        { name: "gallery", label: "Gallery images", type: "image-list" },
        { name: "video_url", label: "Video URL (YouTube/Vimeo)", type: "url" },
        { name: "brochure_url", label: "Brochure PDF URL", type: "url" },
        { name: "seo_title", label: "SEO title" },
        { name: "seo_description", label: "SEO description", type: "textarea" },
        { name: "featured", label: "Featured on homepage", type: "boolean" },
        { name: "published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});
