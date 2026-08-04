import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: () => (
    <ResourceManager
      table="services"
      title="Services"
      subtitle="Manage everything that appears on /services and individual service pages."
      orderBy={{ column: "display_order", ascending: true }}
      defaults={{ published: true, display_order: 0, gallery: [], faqs: [] }}
      listColumns={[
        { name: "title", label: "Title" },
        { name: "slug", label: "Slug" },
        { name: "display_order", label: "Order" },
        { name: "published", label: "Published" },
        { name: "updated_at", label: "Updated" },
      ]}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "slug", label: "Slug (URL)", required: true, placeholder: "residential-architecture" },
        { name: "icon", label: "Icon name (lucide)", placeholder: "Home" },
        { name: "summary", label: "Short summary", type: "textarea" },
        { name: "content", label: "Full content (markdown / html)", type: "textarea" },
        { name: "banner_url", label: "Banner image", type: "image" },
        { name: "gallery", label: "Gallery images", type: "image-list" },
        { name: "faqs", label: "FAQs (JSON array of {q,a})", type: "textarea", placeholder: '[{"q":"...","a":"..."}]' },
        { name: "seo_title", label: "SEO title" },
        { name: "seo_description", label: "SEO description", type: "textarea" },
        { name: "display_order", label: "Display order", type: "number" },
        { name: "published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});
