import { IconRadioCard } from "../icon-radio-card";
import { RadioGroup } from "../ui/radio-group";

type EnvironmentSelectorProps = {
	value?: string;
	onChange?: (value: string) => void;
};

export default function EnvironmentSelector({
	value,
	onChange,
}: EnvironmentSelectorProps) {
	return (
		<RadioGroup
			defaultValue={value}
			className="w-full grid grid-cols-2"
			onValueChange={onChange}
		>
			<IconRadioCard
				id="1"
				name="Python"
				description="A Python development environment with popular libraries pre-installed."
				icon="/python-logo.png"
			/>
			<IconRadioCard
				id="2"
				name="Node.js"
				description="A Node.js environment with npm and common packages ready to use."
				icon="/nodejs-logo.png"
			/>
			<IconRadioCard
				id="2"
				name="C/C++"
				description="A C/C++ development environment with essential tools and libraries."
				icon="/cpp-logo.png"
			/>{" "}
			<IconRadioCard
				id="3"
				name="Custom"
				description="A custom development environment for your specific needs."
				icon="/custom-logo.png"
			/>
		</RadioGroup>
	);
}
