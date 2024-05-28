import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import BpmnModeler from 'camunda-bpmn-js/lib/camunda-platform/Modeler';
import { SaveSVGResult, SaveXMLOptions, SaveXMLResult, ImportXMLResult } from 'bpmn-js/lib/BaseViewer';
// @ts-ignore
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import axios from "axios";

import customPropertiesProvider from "./provider/custom.provider";
import { SelectUserDiglog } from "./provider/select-user.componet";
import { SelectGroupDiglog } from "./provider/select-group.componet";
import { generateId } from "../../utils/generate-id.util";
import { translateModule } from '../../i18n/bpmn/translate.provider';

// // i18n
// const translateModule = {
//   translate: ['value', (key: any) => {
//     const trs = (i18nBpmnJsZhCN as any)[key]
//       || (i18nPropertiesPanelZhCN as any)[key]
//       || (i18nCamundaProprtiesPanelZhCN as any)[key]
//       || (i18nBpmnModelerZhCN as any)[key]
//       || (i18nExtensionZhCN as any)[key]
//       || key;
//     // if (trs == key && ["ID"].indexOf(key) === -1) {
//     //   console.debug('key not found:', key);
//     // }
//     return trs;
//   }]
// };

export type IBpmnDesigerProps = {
  className?: string;
  url?: string;
  diagramXml?: string;
}

export interface IBpmnDesigerRef {
  createDiagram: () => Promise<ImportXMLResult>;
  importXML: (xml: string) => Promise<ImportXMLResult>;
  saveSVG: () => Promise<SaveSVGResult>;
  saveXML: (options?: SaveXMLOptions) => Promise<SaveXMLResult>;
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

export const BpmnDesigner = forwardRef<IBpmnDesigerRef, IBpmnDesigerProps>((props, ref) => {
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
      bpmnModeler.current.importXML(props.diagramXml);
    }

    return () => {
      bpmnModeler.current && bpmnModeler.current.destroy();
    }
  }, [props]);

  // 暴露组件函数
  useImperativeHandle(ref, () => ({
    createDiagram: async (): Promise<ImportXMLResult> => {
      if (!bpmnModeler.current) {
        return { warnings: [] };
      }
      return bpmnModeler.current.importXML(TEMPLATE_EMPTY());
    },
    importXML: async (xml: string): Promise<ImportXMLResult> => {
      console.log(xml);

      if (!bpmnModeler.current) {
        return { warnings: [] };
      }
      
      return bpmnModeler.current.importXML(xml);
    },
    saveSVG: async (): Promise<SaveSVGResult> => {
      if (!bpmnModeler.current) {
        return { svg: '' };
      }
      return bpmnModeler.current.saveSVG();
    },
    saveXML: async (options?: SaveXMLOptions): Promise<SaveXMLResult> => {
      if (!bpmnModeler.current) {
        return { xml: '' };
      }
      return bpmnModeler.current.saveXML({ ...options, format: true });
    },
    
  }), [bpmnModeler.current]);

  return (
    <div className={mergeClasses(styles.root, props.className)}>
      <div ref={containerRef} className={styles.modelerPanel}>
      </div>
      <div ref={propertiesPanelRef} className={styles.propertiesPanel} />
      <SelectUserDiglog />
      <SelectGroupDiglog />
    </div>
  )
});

export const TEMPLATE_EMPTY = (): string => {
  let id = generateId();
  return `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_0ze82wo" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="5.22.0" modeler:executionPlatform="Camunda Platform" modeler:executionPlatformVersion="7.21.0">
  <bpmn:process id="Process_${id}" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_09eeh7n">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="192" y="82" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`};