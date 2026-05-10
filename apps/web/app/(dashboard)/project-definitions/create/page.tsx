import type { Metadata } from "next";
import { ProjectDefinitionCreateForm } from "@/components/project-creation/project-definition-create-form";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Create Project Definition",
  description: "Create a structured coding project definition in studentide.",
  path: "/project-definitions/create",
  noIndex: true,
});

export default function CreateProjectPage() {
  return (
    <div className="w-full pt-6">
      <h1 className="scroll-m-20 border-b pb-2 pl-8 font-satoshi font-semibold text-3xl tracking-tight first:mt-0">
        Create a Project Definition
      </h1>
      <ProjectDefinitionCreateForm />
    </div>
  );
}
