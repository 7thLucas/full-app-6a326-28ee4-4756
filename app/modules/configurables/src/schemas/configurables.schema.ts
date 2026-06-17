/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "App Tagline",
      maxLength: 120,
    },
    {
      fieldName: "heroHeading",
      type: "string",
      required: false,
      label: "Hero Heading",
      maxLength: 80,
    },
    {
      fieldName: "heroSubheading",
      type: "string",
      required: false,
      label: "Hero Subheading",
      maxLength: 200,
    },
    {
      fieldName: "ctaLabel",
      type: "string",
      required: false,
      label: "CTA Button Label",
      maxLength: 50,
    },
    {
      fieldName: "uploadAreaLabel",
      type: "string",
      required: false,
      label: "Upload Area Label",
      maxLength: 100,
    },
    {
      fieldName: "defaultSecondsPerClip",
      type: "number",
      required: false,
      label: "Default Seconds Per Clip",
      min: 1,
      max: 30,
    },
    {
      fieldName: "maxClips",
      type: "number",
      required: false,
      label: "Maximum Clips Allowed",
      min: 1,
      max: 100,
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent",
        },
      ],
    },
    {
      fieldName: "features",
      type: "array",
      required: false,
      label: "Feature Highlights",
      item: {
        type: "object",
        fields: [
          { fieldName: "icon", type: "string", required: true, label: "Icon (emoji or name)" },
          { fieldName: "title", type: "string", required: true, label: "Title" },
          { fieldName: "description", type: "string", required: true, label: "Description" },
        ],
      },
    },
    {
      fieldName: "footerText",
      type: "string",
      required: false,
      label: "Footer Text",
      maxLength: 200,
    },
  ],
};