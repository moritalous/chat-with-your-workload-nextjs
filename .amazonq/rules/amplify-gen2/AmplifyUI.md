# Amplify UI

Amplify UI is an open-source UI library with cloud-connected components that are endlessly customizable, accessible, and can integrate into _any_ application. Amplify UI consists of:

1. Connected components that simplify complex cloud-connected workflows, like Authenticator.
2. Primitive components that create consistency across Amplify UI and allow you to build complete applications that fit your brand, like Buttons and Badges.
3. Data-bound components that make it easy to display dynamic data, like DataStoreCollections.
4. Theming capabilities that allow you to customize the appearance of Amplify UI to match your brand.

ソースは以下のディレクトリにあるため必要に応じて確認すること。

node_modules/@aws-amplify/ui-react
node_modules/@aws-amplify/ui-react-ai

- アプリで使用しているスタイルシート

```tsx
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import 'highlight.js/styles/github.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import outputs from '../amplify_outputs.json';
import App from './App.tsx';
import './index.css';

Amplify.configure(outputs);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

@aws-amplify/ui-react/styles.cssの実態はここにあります

node_modules/@aws-amplify/ui-react/dist/styles.css

- コンポーネントのソースコード

```shell
ls node_modules/@aws-amplify/ui-react/dist/esm/primitives
```

```
Accordion     ButtonGroup    Field           HighlightMatch  Loader            Radio            shared        TextArea           View
Alert         Card           FieldGroup      Icon            Menu              RadioGroupField  SliderField   TextAreaField      VisuallyHidden
Autocomplete  Checkbox       FieldGroupIcon  Image           Message           Rating           StepperField  TextField
Avatar        CheckboxField  Fieldset        index.mjs       Pagination        ScrollView       SwitchField   ToggleButton
Badge         Collection     Flex            Input           PasswordField     SearchField      Table         ToggleButtonGroup
Breadcrumbs   Divider        Grid            Label           PhoneNumberField  Select           Tabs          types
Button        DropZone       Heading         Link            Placeholder       SelectField      Text          utils
```

```shell
ls node_modules/@aws-amplify/ui-react-ai/dist/esm/components
```

```
AIConversation
```
