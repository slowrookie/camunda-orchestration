import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// camunda-bpmn-js
import 'camunda-bpmn-js/dist/assets/camunda-platform-modeler.css'

// react-data-grid
import 'react-data-grid/lib/styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <FluentProvider theme={webLightTheme}>
      <App />
    </FluentProvider>
)
