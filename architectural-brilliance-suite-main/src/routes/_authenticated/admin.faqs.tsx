import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/_authenticated/admin/faqs")({
  component: () => (
    <ResourceManager
      table="faqs"
      title="FAQs"
      subtitle="Manage the FAQ accordion shown on the homepage and service pages."
      orderBy={{ column: "display_order", ascending: true }}
      defaults={{ published: true, display_order: 0 }}
      listColumns={[
        { name: "question", label: "Question" },
        { name: "category", label: "Category" },
        { name: "display_order", label: "Order" },
        { name: "published", label: "Published" },
      ]}
      fields={[
        { name: "question", label: "Question", required: true },
        { name: "answer", label: "Answer", type: "textarea", required: true },
        { name: "category", label: "Category", placeholder: "General / Services / Pricing" },
        { name: "display_order", label: "Display order", type: "number" },
        { name: "published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});
