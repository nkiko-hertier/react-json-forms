// form-schema.types.ts

/**
 * Core Form Schema Types
 * Compatible with Google Forms (except file upload)
 * UI-agnostic, backend-safe, renderer-friendly
 */

/* -----------------------------
   Root Form Schema
------------------------------*/

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  version?: string;
  settings?: FormSettings;
  sections: FormSection[];
}

export interface FormSettings {
  collectEmail?: boolean;
  allowEditAfterSubmit?: boolean;
  showProgress?: boolean;
  confirmationMessage?: string;
}

/* -----------------------------
   Section
------------------------------*/

export interface FormSection {
  id: string;
  title: string;
  description?: string | null;
  fields: FormField[];
}

/* -----------------------------
   Field Union
------------------------------*/

export type FormField =
  | TextField
  | TextAreaField
  | RadioField
  | CheckboxField
  | SelectField
  | ScaleField
  | GridRadioField
  | GridCheckboxField
  | DateField
  | TimeField
  | DescriptionField;

/* -----------------------------
   Base Field
------------------------------*/

interface BaseField {
  id: string;
  label: string;
  name?: string;
  description?: string | null;
  required?: boolean;
  ui?: UIOptions;
  visibility?: VisibilityRule
}

export interface VisibilityRule {
  dependsOn: string; // field id to watch
  operator?: string; // defaults to 'equals'
  value?: string;
  equals: string | number | boolean;
}

export interface UIOptions {
  placeholder?: string;
  width?: "full" | "half" | "third";
  helpText?: string;
}

/* -----------------------------
   Text Fields
------------------------------*/

export interface TextField extends BaseField {
  type: "text";
  validation?: TextValidation;
}

export interface TextAreaField extends BaseField {
  type: "textarea";
  validation?: TextValidation;
}

export interface TextValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string; // regex
}

/* -----------------------------
   Choice Fields
------------------------------*/

export interface ChoiceOption {
  value: string;
  label: string;
}

interface BaseChoiceField extends BaseField {
  options: Array<string | ChoiceOption>;
}

export interface RadioField extends BaseChoiceField {
  type: "radio";
}

export interface CheckboxField extends BaseChoiceField {
  type: "checkbox";
}

export interface SelectField extends BaseChoiceField {
  type: "select";
}

/* -----------------------------
   Scale Field
------------------------------*/

export interface ScaleField extends BaseField {
  type: "scale";
  scale: {
    min: number;
    max: number;
    labels?: Record<number, string>;
  };
}

/* -----------------------------
   Grid Fields
------------------------------*/

interface BaseGridField extends BaseField {
  rows: string[];
  columns: string[];
}

export interface GridRadioField extends BaseGridField {
  type: "grid_radio";
}

export interface GridCheckboxField extends BaseGridField {
  type: "grid_checkbox";
}

/* -----------------------------
   Date & Time
------------------------------*/

export interface DateField extends BaseField {
  type: "date";
}

export interface TimeField extends BaseField {
  type: "time";
}

/* -----------------------------
   Description / Static Text
------------------------------*/

export interface DescriptionField {
  type: "description";
  id: string;
  content: string;
}
