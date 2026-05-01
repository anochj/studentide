import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
	FieldTitle,
} from "@/components/ui/field";
import { RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";

type IconRadioCardProps = {
	id: string,
	name: string;
	description: string;
	icon: string;
};

export function IconRadioCard({
	id,
	name,
	description,
	icon,
}: IconRadioCardProps) {
	return (
		<FieldLabel htmlFor={id} key={id}>
			<Field orientation="horizontal">
				<FieldContent className="flex flex-row items-center justify-center gap-4">
					<Image src={icon} alt={name} width={50} height={50} />
					<div>
						<FieldTitle>{name}</FieldTitle>
						<FieldDescription>{description}</FieldDescription>
					</div>
				</FieldContent>
				<RadioGroupItem value={id} id={id} />
			</Field>
		</FieldLabel>
	);
}
