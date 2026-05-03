"use client";

import { MarkdownEditor } from "@/components/markdown-editor";
import { ProjectCreationForm } from "@/components/project-creation-form";
import { AvailabilitySelector } from "@/components/project-creation/availability-selector";
import StarterFilesDropzone from "@/components/project-creation/starter-files-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
	FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Link, Lock } from "lucide-react";
import Image from "next/image";

export default function CreateProjectPage() {
	return (
		<div className="w-full">
			{/* <Button type="submit" form="project-form" variant="default">
				Create Project
			</Button>

			<ProjectCreationForm /> */}

			<div>
				<h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 font-satoshi">
					Create a Project Definition
				</h1>

				<form>
					<div className="grid grid-cols-1 lg:grid-cols-5 p-4 md:p-8 gap-8">
						<div className="lg:col-span-3 flex flex-col gap-6">
							<FieldSet>
								<FieldLegend>Project Details</FieldLegend>
								<FieldDescription>
									Basic information to categorize your project.
								</FieldDescription>
								<FieldGroup>
									<Field>
										<FieldLabel htmlFor="name" className="tracking-tighter word-spacing-[-0.2em]">Name<span className="text-destructive">*</span></FieldLabel>
										<Input
											id="name"
											autoComplete="off"
											placeholder="e.g. Web development starter kit"
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor="username">Description</FieldLabel>
										<Textarea
											id="username"
											autoComplete="off"
											placeholder="e.g. A simple web development starter kit"
										/>
									</Field>
								</FieldGroup>
							</FieldSet>

							<FieldSet>
								<FieldLegend>Development Environment</FieldLegend>
								<FieldDescription>
									Choose the environment the project will have.
								</FieldDescription>
								<RadioGroup
									defaultValue="python"
									className="w-full grid grid-cols-2"
								>
									<FieldLabel htmlFor="python" className="">
										<Field orientation="horizontal">
											<FieldContent className="flex flex-row gap-4 items-center">
												<Image
													src="https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/files/python-logo-only.svg"
													alt=""
													className="h-full"
													width={40}
													height={40}
												/>
												<div>
													<FieldTitle>Python</FieldTitle>
													<FieldDescription>
														Python 3.1 with Ubuntu 22.04
													</FieldDescription>
												</div>
											</FieldContent>
											<RadioGroupItem value="python" id="python" />
										</Field>
									</FieldLabel>

									<FieldLabel htmlFor="webdev" className="">
										<Field orientation="horizontal">
											<FieldContent className="flex flex-row gap-4 items-center">
												<Image
													src="https://nodejs.org/static/logos/jsIconGreen.svg"
													alt=""
													className="h-full"
													width={40}
													height={40}
												/>
												<div>
													<FieldTitle>Web Development</FieldTitle>
													<FieldDescription>
														Node 18 with Ubuntu 22.04, with popular web
														development
													</FieldDescription>
												</div>
											</FieldContent>
											<RadioGroupItem value="webdev" id="webdev" />
										</Field>
									</FieldLabel>

									<FieldLabel htmlFor="c-cpp" className="">
										<Field orientation="horizontal">
											<FieldContent className="flex flex-row gap-4 items-center">
												<Image
													src="https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/files/python-logo-only.svg"
													alt=""
													className="h-full"
													width={40}
													height={40}
												/>
												<div>
													<FieldTitle>C/C++</FieldTitle>
													<FieldDescription>
														GCC 12 with Ubuntu 22.04
													</FieldDescription>
												</div>
											</FieldContent>
											<RadioGroupItem value="c-cpp" id="c-cpp" />
										</Field>
									</FieldLabel>

									<FieldLabel htmlFor="Java" className="">
										<Field orientation="horizontal">
											<FieldContent className="flex flex-row gap-4 items-center">
												<Image
													src="https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/files/python-logo-only.svg"
													alt=""
													className="h-full"
													width={40}
													height={40}
												/>
												<div>
													<FieldTitle>Java</FieldTitle>
													<FieldDescription>
														OpenJDK 17 with Ubuntu 22.04
													</FieldDescription>
												</div>
											</FieldContent>
											<RadioGroupItem value="Java" id="Java" />
										</Field>
									</FieldLabel>
								</RadioGroup>
							</FieldSet>

							<FieldSet>
								<FieldLegend>Upload Starter Folder</FieldLegend>
								<FieldDescription>
									This folder will be used as the initial content of the project
									when the student first creates it.
								</FieldDescription>
								<FieldGroup>
									<StarterFilesDropzone />
								</FieldGroup>
							</FieldSet>

							<FieldSet>
								<FieldLegend>Overview</FieldLegend>
								<FieldDescription>
									Enter the project outline. This will be visible to students
									and can include instructions, resources, and any other
									relevant information.
								</FieldDescription>
								<FieldGroup>
									<MarkdownEditor />
								</FieldGroup>
							</FieldSet>
						</div>

						<div className="lg:col-span-2 flex flex-col gap-6">
							<FieldSet>
								<FieldLegend>Visibility</FieldLegend>
								<FieldDescription>
									Choose the visibility of the project.
								</FieldDescription>
								<RadioGroup
									defaultValue="python"
									className="w-full flex flex-col"
								>
									<FieldLabel htmlFor="private" className="">
										<Field orientation="horizontal">
											<FieldContent className="flex flex-row gap-4 items-center">
												<Lock />
												<div>
													<FieldTitle>Private</FieldTitle>
													<FieldDescription>
														Your project will be visible only to you.
													</FieldDescription>
												</div>
											</FieldContent>
											<RadioGroupItem value="private" id="private" />
										</Field>
									</FieldLabel>

									<FieldLabel htmlFor="public" className="">
										<Field orientation="horizontal">
											<FieldContent className="flex flex-row gap-4 items-center">
												<Globe />
												<div>
													<FieldTitle>Public</FieldTitle>
													<FieldDescription>
														Your project will be visible to everyone.
													</FieldDescription>
												</div>
											</FieldContent>
											<RadioGroupItem value="public" id="public" />
										</Field>
									</FieldLabel>

									<FieldLabel htmlFor="Share by Link" className="">
										<Field orientation="horizontal">
											<FieldContent className="flex flex-row gap-4 items-center">
												<Link />
												<div>
													<FieldTitle>Share by Link</FieldTitle>
													<FieldDescription>
														Your project will be visible to anyone with the
														link.
													</FieldDescription>
												</div>
											</FieldContent>
											<RadioGroupItem
												value="Share by Link"
												id="Share by Link"
											/>
										</Field>
									</FieldLabel>
								</RadioGroup>
							</FieldSet>

							<FieldSet>
								<FieldLegend>Availability</FieldLegend>
								<FieldDescription>
									Choose the availability of the project.
								</FieldDescription>

								<AvailabilitySelector />
							</FieldSet>

							<FieldSet>
								<FieldLegend>Extra Controls</FieldLegend>
								<FieldDescription>
									Additional controls to show in the IDE for this project.
								</FieldDescription>

								<Field orientation="horizontal" className="w-fit">
									<FieldLabel htmlFor="2fa">
										Disable Extension Marketplace
									</FieldLabel>
									<Switch id="disable-extensions" />
								</Field>
							</FieldSet>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
