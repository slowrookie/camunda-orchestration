import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { useEffect, useRef } from "react";
import BpmnModeler from 'camunda-bpmn-js/lib/camunda-platform/Modeler';
// @ts-ignore
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import axios from "axios";

import i18nBpmnModelerZhCN from '../../i18n/zh_CN/bpmn-modeler';
import i18nCamundaProprtiesPanelZhCN from '../../i18n/zh_CN/camunda-properties-panel';
import i18nPropertiesPanelZhCN from '../../i18n/zh_CN/properties-panel';
import i18nBpmnJsZhCN from '../../i18n/zh_CN/bpmn-js';
import i18nExtensionZhCN from '../../i18n/zh_CN/extension';
import  customPropertiesProvider from "./provider/custom.provider";
import { SelectUserDiglog } from "./provider/select-user.componet";
import { SelectGroupDiglog } from "./provider/select-group.componet";

// i18n
const translateModule = {
  translate: ['value', (key: any) => {
    const trs = (i18nBpmnJsZhCN as any)[key] 
      || (i18nPropertiesPanelZhCN as any)[key] 
      || (i18nCamundaProprtiesPanelZhCN as any)[key]
      || (i18nBpmnModelerZhCN as any)[key]
      || (i18nExtensionZhCN as any)[key]
      || key;
    // if (trs == key && ["ID"].indexOf(key) === -1) {
    //   console.debug('key not found:', key);
    // }
    return trs;
  }]
};

export type IBpmnDesigerProps = {
  className?: string;
  url?: string;
  diagramXml?: string;
}

const useStyles = makeStyles({
  root: {
    padding: 0,
    margin: 0,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  modelerPanel: {
    flex: 1,
  },
  propertiesPanel: {
    borderLeft: '1px solid #ccc',
    width: '300px',
  }
});

export const BpmnDesigner = (props: IBpmnDesigerProps) => {
  const styles = useStyles();
  const containerRef = useRef<any>(null);
  const propertiesPanelRef = useRef<any>(null);
  const bpmnModeler = useRef<BpmnModeler>();

  useEffect(() => {
    if (!containerRef || !containerRef.current) {
      return;
    }

    if (bpmnModeler.current) {
      bpmnModeler.current.destroy();
    }

    bpmnModeler.current = new BpmnModeler({
      container: containerRef.current,
      propertiesPanel: {
        parent: propertiesPanelRef.current
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        translateModule,
        customPropertiesProvider
      ],
      keyboard: {
        bindTo: window
      }
    });

    // load
    if (props.url) {
      axios.create().get(props.url).then((res) => {
        bpmnModeler.current && bpmnModeler.current.importXML(res.data);
      });
    } else if (props.diagramXml) {
      bpmnModeler.current && bpmnModeler.current.importXML(props.diagramXml);
    }

    return () => {
      bpmnModeler.current && bpmnModeler.current.destroy();
    }
  }, [props]);

  return (
    <div className={mergeClasses(styles.root, props.className)}>
      <div ref={containerRef} className={styles.modelerPanel}>
      </div>
      <div ref={propertiesPanelRef} className={styles.propertiesPanel} />
      <SelectUserDiglog />
      <SelectGroupDiglog />
    </div>
  )
};