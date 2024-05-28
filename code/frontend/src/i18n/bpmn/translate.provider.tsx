import i18nBpmnJsZhCN from './zh_CN/bpmn-js';
import i18nBpmnModelerZhCN from './zh_CN/bpmn-modeler';
import i18nCamundaProprtiesPanelZhCN from './zh_CN/camunda-properties-panel';
import i18nExtensionZhCN from './zh_CN/extension';
import i18nPropertiesPanelZhCN from './zh_CN/properties-panel';

export const translateModule = {
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