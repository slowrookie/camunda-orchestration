import { Form } from "@rjsf/fluentui-rc";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import validator from '@rjsf/validator-ajv8';
import { FormDesigner } from "../components/form/form-designer.component";

const schema: RJSFSchema = {
  "title": "A registration form",
  "description": "A simple form example.",
  "type": "object",
  "required": [
    "firstName",
    "lastName"
  ],
  "properties": {
    "firstName": {
      "type": "string",
      "title": "First name",
      "default": "Chuck"
    },
    "lastName": {
      "type": "string",
      "title": "Last name"
    },
    "age": {
      "type": "integer",
      "title": "Age"
    },
    "bio": {
      "type": "string",
      "title": "Bio"
    },
    "password": {
      "type": "string",
      "title": "Password",
      "minLength": 3
    },
    "telephone": {
      "type": "string",
      "title": "Telephone",
      "minLength": 10
    },
    "interests": {
      "type": "array",
      "title": "Select your interests",
      "items": {
        "type": "string",
        "enum": [
          "sports",
          "music",
          "movies",
          "books"
        ],
        "enumNames": [
          "Sports",
          "Music",
          "Movies",
          "Books"
        ]
      },
      "uniqueItems": true
    }
  }
};

const uiSchema: UiSchema = {}

export const FormPage = () => {
  return (<>
    {/* <Form schema={schema} validator={validator} uiSchema={}/> */}
    <FormDesigner />
  </>);
}