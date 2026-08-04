import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/admin/videos")({
  component: () => (
    <ResourceManager
      table="videos"
      title="Videos"
      subtitle="Add YouTube videos shown on the public Videos page."
      orderBy={{ column: "sort_order", ascending: true }}
      defaults={{ published: true, sort_order: 0 }}
      listColumns={[
        { name: "title", label: "Title" },
        { name: "youtube_url", label: "YouTube URL" },
        { name: "sort_order", label: "Order" },
        { name: "published", label: "Published" },
      ]}
      fields={[
        { name: "title", label: "Title", required: true, placeholder: "Project walkthrough" },
        {
          name: "youtube_url",
          label: "YouTube link",
          type: "url",
          required: true,
          placeholder: "https://www.youtube.com/watch?v=...",
        },
        { name: "description", label: "Description", type: "textarea" },
        { name: "sort_order", label: "Display order", type: "number" },
        { name: "published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});
