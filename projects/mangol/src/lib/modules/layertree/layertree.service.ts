import { Injectable } from '@angular/core';

import { MangolLayer } from '../../classes/Layer';
import { MangolLayerGroup } from '../../classes/LayerGroup';
import { LayertreeItemNode } from './Layertree.class';

@Injectable({
  providedIn: 'root'
})
export class LayertreeService {
  constructor() {}

  processLayersAndLayerGroups(
    items: (MangolLayer | MangolLayerGroup)[]
  ): LayertreeItemNode[] {
    const data: LayertreeItemNode[] = [];
    items.forEach((i: MangolLayer | MangolLayerGroup) => {
      if (i instanceof MangolLayer) {
        this.processLayer(i, data);
      } else if (i instanceof MangolLayerGroup) {
        this.processLayerGroup(i, data);
      }
    });
    return data;
  }

  private processLayer(layer: MangolLayer, data: LayertreeItemNode[]) {
    const item = {
      name: layer.name,
      checked: layer.layer.getVisible(),
      layer: layer.layer
    } as LayertreeItemNode;
    data.push(item);
  }

  private processLayerGroup(
    group: MangolLayerGroup,
    data: LayertreeItemNode[]
  ) {
    const item = { name: group.name } as LayertreeItemNode;
    item.children = [];
    if (
      group.hasOwnProperty('children') &&
      Array.isArray(group.children) &&
      group.children.length > 0
    ) {
      group.children
        .slice()
        .reverse()
        .forEach((c: MangolLayer | MangolLayerGroup) => {
          if (c instanceof MangolLayer) {
            this.processLayer(c, item.children);
          } else if (c instanceof MangolLayerGroup) {
            this.processLayerGroup(c, item.children);
          }
        });
    }
    data.push(item);
  }
}
