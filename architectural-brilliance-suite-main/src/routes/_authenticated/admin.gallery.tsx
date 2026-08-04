import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  component: () => (
    <ResourceManager
      table="gallery_images"
      title="Gallery"
      subtitle="Upload images shown on the public /gallery page."
      orderBy={{ column: "display_order", ascending: true }}
      defaults={{ published: true, display_order: 0 }}
      listColumns={[
        { name: "image_url", label: "Image" },
        { name: "caption", label: "Caption" },
        { name: "display_order", label: "Order" },
        { name: "published", label: "Published" },
      ]}
      fields={[
        { name: "image_url", label: "Image", type: "image", required: true },
        { name: "caption", label: "Caption" },
        { name: "alt_text", label: "Alt text (SEO)" },
        { name: "display_order", label: "Display order", type: "number" },
        { name: "published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});
