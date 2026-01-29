// FormRenderer.tsx

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import type {
  FormSchema,
  ChoiceOption,
} from "../schema/types";

/* ----------------------------------
   Visibility Logic
-----------------------------------*/

function isFieldVisible(field: any, values: any): boolean {
  if (!field.visibility) return true;
  const { dependsOn, equals } = field.visibility;
  return values?.[dependsOn] === equals;
}

/* ----------------------------------
   Renderer Component (Stepper Style)
-----------------------------------*/

export function FormRenderer({
  schema,
  onSubmit,
}: {
  schema: FormSchema;
  onSubmit: (data: any) => void;
}) {
  const { control, handleSubmit, watch, trigger } = useForm();
  const values = watch();
  const [step, setStep] = useState(0);

  const totalSteps = schema.sections.length;
  const progress = Math.round(((step + 1) / totalSteps) * 100);
  const currentSection = schema.sections[step];

  async function nextStep() {
    const valid = await trigger(
      currentSection.fields.map((f) => f.id)
    );
    if (valid) setStep((s) => Math.min(s + 1, totalSteps - 1));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <Card className="border-none shadow-lg">
      <CardContent className="p-8 md:p-12 space-y-8">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Step {step + 1} of {totalSteps}
            </span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">
              {currentSection.title}
            </h2>
            {currentSection.description && (
              <p className="text-sm text-muted-foreground">
                {currentSection.description}
              </p>
            )}
          </div>

          <div className="space-y-6">
            {currentSection.fields.map((field) => {
              const visible = isFieldVisible(field, values);
              if (!visible) return null;

              return (
                <FieldRenderer
                  key={field.id}
                  field={field}
                  control={control}
                />
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 pt-6">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                className="h-12"
                onClick={prevStep}
              >
                Back
              </Button>
            )}

            {step < totalSteps - 1 ? (
              <Button
                type="button"
                className="h-12 ml-auto"
                onClick={nextStep}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" className="h-14 text-lg ml-auto">
                Submit Application
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ----------------------------------
   Field Renderer (Design-Aligned)
-----------------------------------*/

function FieldRenderer({ field, control }: any) {
  switch (field.type) {
    case "text":
      return (
        <div className="space-y-2">
          <Label>{field.label}</Label>
          <Controller
            name={field.id}
            control={control}
            rules={{ required: field.required }}
            render={({ field: rhf }) => (
              <Input {...rhf} placeholder={field.placeholder} className="h-12" />
            )}
          />
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-2">
          <Label>{field.label}</Label>
          <Controller
            name={field.id}
            control={control}
            rules={{ required: field.required }}
            render={({ field: rhf }) => (
              <Textarea {...rhf} placeholder={field.placeholder} />
            )}
          />
        </div>
      );

    case "select":
      return (
        <div className="space-y-2">
          <Label>{field.label}</Label>
          <Controller
            name={field.id}
            control={control}
            rules={{ required: field.required }}
            render={({ field: rhf }) => (
              <Select onValueChange={rhf.onChange} value={rhf.value}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={field.placeholder || "Select"} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((opt: any) => {
                    const option = normalizeOption(opt);
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-2">
          <Label>{field.label}</Label>
          <Controller
            name={field.id}
            control={control}
            render={({ field: rhf }) => (
              <div className="space-y-2">
                {field.options.map((opt: any) => {
                  const option = normalizeOption(opt);
                  const checked = rhf.value?.includes(option.value) ?? false;
                  return (
                    <div key={option.value} className="flex items-center gap-2">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) => {
                          const next = new Set(rhf.value || []);
                          v ? next.add(option.value) : next.delete(option.value);
                          rhf.onChange(Array.from(next));
                        }}
                      />
                      <Label>{option.label}</Label>
                    </div>
                  );
                })}
              </div>
            )}
          />
        </div>
      );

    case "description":
      return <p className="text-sm text-muted-foreground">{field.content}</p>;

    default:
      return null;
  }
}

/* ----------------------------------
   Helpers
-----------------------------------*/

function normalizeOption(opt: string | ChoiceOption): ChoiceOption {
  return typeof opt === "string"
    ? { value: opt, label: opt }
    : opt;
}
