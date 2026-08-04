import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/admin/blogs")({
  component: () => (
    <ResourceManager
      table="blogs"
      title="Blogs"
      subtitle="Manage articles shown on /blog."
      orderBy={{ column: "created_at", ascending: false }}
      defaults={{ published: false, tags: [] }}
      listColumns={[
        { name: "title", label: "Title" },
        { name: "author", label: "Author" },
        { name: "published", label: "Published" },
        { name: "published_at", label: "Date" },
      ]}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "slug", label: "Slug (URL)", required: true },
        { name: "excerpt", label: "Excerpt", type: "textarea" },
        { name: "content", label: "Content (markdown / html)", type: "textarea" },
        { name: "cover_url", label: "Cover image", type: "image" },
        { name: "tags", label: "Tags (comma-separated)", placeholder: "interiors, modular kitchen" },
        { name: "author", label: "Author" },
        { name: "seo_title", label: "SEO title" },
        { name: "seo_description", label: "SEO description", type: "textarea" },
        { name: "published", label: "Published", type: "boolean" },
        { name: "published_at", label: "Publish date", type: "date" },
      ]}
    />
  ),
});
