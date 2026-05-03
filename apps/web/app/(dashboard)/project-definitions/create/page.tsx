import { ProjectDefinitionCreateForm } from "@/components/project-creation/project-definition-create-form";

export default function CreateProjectPage() {
  return (
    <div className="w-full">
      <h1 className="scroll-m-20 border-b pb-2 font-satoshi font-semibold text-3xl tracking-tight first:mt-0">
        Create a Project Definition
      </h1>
      <ProjectDefinitionCreateForm />
    </div>
  );
}
