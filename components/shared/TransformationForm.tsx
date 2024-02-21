"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import {
	aspectRatioOptions,
	defaultValues,
	transformationTypes,
} from "@/constants";
import { CustomField } from "./CustomField";
import { AspectRatioKey } from "@/lib/utils";

export const formSchema = z.object({
	title: z.string(),
	aspectRatio: z.string().optional(),
	color: z.string().optional(),
	prompt: z.string().optional(),
	publicId: z.string(),
});

const TransformationForm = ({
	action,
	data = null,
	userId,
	type,
	creditBalance,
}: TransformationFormProps) => {
	const transformationType = transformationTypes[type];
	const [image, setImage] = useState(data);
	const [newTransformation, setNewTransformation] =
		useState<Transformations | null>(null);
	const initialValues =
		data && action === "Update"
			? {
					title: data?.title,
					aspectRatio: data?.aspectRatio,
					color: data?.color,
					prompt: data?.prompt,
					publicId: data?.publicId,
			  }
			: defaultValues;
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialValues,
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	const onSelectFieldHandler = (
		value: string,
		onChangeField: (value: string) => void
	) => {};

	const onInputChangeHandler = (
		fieldName: string,
		value: string,
		type: string,
		onChangeField: (value: string) => void
	) => {};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<CustomField
					control={form.control}
					name={"title"}
					formLabel="Image Title"
					className="w-full"
					render={({ field }) => <Input {...field} className="input-field" />}
				/>
				{type === "fill" && (
					<CustomField
						render={({ field }) => (
							<Select
								onValueChange={(value) =>
									onSelectFieldHandler(value, field.onChange)
								}
							>
								<SelectTrigger className="select-field">
									<SelectValue placeholder="Select Size" />
								</SelectTrigger>
								<SelectContent>
									{Object.keys(aspectRatioOptions).map((key) => (
										<SelectItem key={key} value={key}>
											{aspectRatioOptions[key as AspectRatioKey].label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
						control={form.control}
						name={"aspectRatio"}
						formLabel="Aspect Ratio"
						className="w-full"
					/>
				)}

				{(type === "remove" || type === "recolor") && (
					<div className="prompt-field">
						<CustomField
							control={form.control}
							name="prompt"
							formLabel={
								type === "remove" ? "Object to remove" : "Object to recolor"
							}
							className="w-full"
							render={({ field }) => (
								<Input
									value={field.value}
									className="input-field"
									onChange={(e) =>
										onInputChangeHandler(
											"prompt",
											e.target.value,
											type,
											field.onChange
										)
									}
								/>
							)}
						/>
					</div>
				)}
			</form>
		</Form>
	);
};

export default TransformationForm;
