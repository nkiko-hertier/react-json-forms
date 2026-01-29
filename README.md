# react-json-forms

A **JSON-driven form renderer for React** inspired by Google Forms, built on top of **react-hook-form** and **shadcn/ui**.

Design complex, multi-section forms using pure JSON schemas — no hardcoded JSX, no repetitive boilerplate.

---

## ✨ Features

* JSON-based form schemas
* Supports most Google Forms field types (except file upload)
* Sectioned forms (perfect for step-based navigation)
* Conditional visibility logic
* Built on react-hook-form (fast & scalable)
* Uses shadcn/ui components (clean & modern UI)
* Fully typed with TypeScript

---

## 📦 Installation

```bash
npm install json-schema-forms react-hook-form
```

### Install required shadcn components

```bash
npx shadcn-ui@latest add card button input textarea checkbox label select
```

> This library **expects shadcn/ui to be installed** in the host application.

---

## 🚀 Basic Usage

```tsx
import { FormRenderer } from "react-json-forms";
import type { FormSchema } from "react-json-forms";

const schema: FormSchema = {
  id: "example_form",
  title: "Example Form",
  sections: [
    {
      id: "personal",
      title: "Personal Info",
      fields: [
        {
          id: "name",
          type: "text",
          label: "Full Name",
          required: true
        }
      ]
    }
  ]
};

<FormRenderer
  schema={schema}
  onSubmit={(data) => console.log(data)}
/>;
```

---

## 🧩 FormRenderer Props

| Prop            | Type                  | Description             |
| --------------- | --------------------- | ----------------------- |
| `schema`        | `FormSchema`          | JSON form definition    |
| `onSubmit`      | `(data) => void`      | Submit handler          |
| `defaultValues` | `Record<string, any>` | Optional initial values |
| `onChange`      | `(values) => void`    | Fires on form change    |
| `disabled`      | `boolean`             | Disable submit button   |

---

## 🧠 Schema Structure

### FormSchema

```ts
interface FormSchema {
  id: string;
  title?: string;
  description?: string;
  sections: FormSection[];
}
```

### FormSection

```ts
interface FormSection {
  id: string;
  title?: string;
  description?: string;
  fields: FormField[];
}
```

---

## 🧾 Supported Field Types

### Text Input

```json
{
  "id": "email",
  "type": "text",
  "label": "Email",
  "required": true
}
```

### Textarea

```json
{
  "id": "message",
  "type": "textarea",
  "label": "Message"
}
```

### Select (Dropdown)

```json
{
  "id": "experience",
  "type": "select",
  "label": "Years of Experience",
  "options": ["0–2", "3–5", "6–10", "10+"],
  "required": true
}
```

### Checkbox Group

```json
{
  "id": "skills",
  "type": "checkbox",
  "label": "Skills",
  "options": ["Frontend", "Backend", "DevOps"]
}
```

### Radio Group

```json
{
  "id": "level",
  "type": "radio",
  "label": "Level",
  "options": ["Junior", "Mid", "Senior"]
}
```

### Description / Static Text

```json
{
  "id": "note",
  "type": "description",
  "content": "Please ensure all details are correct."
}
```

---

## 👁️ Conditional Visibility

Fields can be conditionally shown based on other field values.

```json
{
  "id": "expertise",
  "type": "text",
  "label": "Expertise Area",
  "visibility": {
    "dependsOn": "role",
    "equals": "expert"
  }
}
```

### Visibility Rules

| Rule        | Description                |
| ----------- | -------------------------- |
| `dependsOn` | Field ID to watch          |
| `equals`    | Show when value equals     |
| `notEquals` | Show when value differs    |
| `in`        | Show when value is in list |
| `exists`    | Show when value exists     |

> ⚠️ Fields using `visibility` **must not be required** (enforced by renderer).

---

## 📤 Form Submission Output

On submit, you receive a plain object:

```ts
{
  full_name: "Jane Doe",
  experience: "6–10",
  skills: ["Frontend", "Backend"]
}
```

Perfect for:

* API submission
* Database storage
* Google Forms export

---

## 🧭 Roadmap

* Multi-step navigation (Next / Back)
* Progress bar support
* Review & confirmation step
* Zod validation generator
* Google Forms API exporter
* Visual form builder UI

---

## 🛠️ Philosophy

react-json-forms is intentionally **unopinionated**:

* You control styling via shadcn
* You control submission logic
* You own the schema

The library focuses on one thing:

> **Turning JSON into beautiful, usable forms.**

---

## 📄 License

MIT

---

Built for scale. Built for clarity. 🚀
