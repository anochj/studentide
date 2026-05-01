import type { Project } from "@/lib/validations/project";
import { IconRadioCard } from "../icon-radio-card";
import { RadioGroup } from "../ui/radio-group";

type AccessSelectorProps = {
  value?: Project["access"];
  onChange?: (value: Project["access"]) => void;
};

export default function AccessSelector({
  value,
  onChange,
}: AccessSelectorProps) {
  return (
    <RadioGroup
      defaultValue={value || "private"}
      className="w-full"
      onValueChange={(value) => onChange?.(value as Project["access"])}
    >
      <IconRadioCard
        id="private"
        name="private"
        description="Only you can access this project."
        icon="/file.svg"
      />
      <IconRadioCard
        id="public"
        name="public"
        description="Anyone can find and access this project."
        icon="/globe.svg"
      />
      <IconRadioCard
        id="link"
        name="link"
        description="Anyone with the link can access this project."
        icon="/window.svg"
      />
    </RadioGroup>
  );
}
