import { BoundingDocumentRect } from './bounding-document-rect';
import { Offset } from './element-follower';
import { ElementMetadata } from './element-metadata';

export class ObjectInstanceWrangler {
  private element: HTMLElement;
  private optionsButton: HTMLSsFreedomObjectOptionsButtonElement;
  private alertButton: HTMLSsFreedomObjectAlertButtonElement;
  private deleteButton: HTMLSsFreedomObjectDeleteButtonElement;
  private adjacentSiblingButtons: {
    before?: HTMLSsFreedomAddSiblingButtonElement,
    after?: HTMLSsFreedomAddSiblingButtonElement
  } = {};
  private hoverState = false;

  constructor(element: HTMLElement) {
    this.element = element;
    this.handleUpdate = this.handleUpdate.bind(this);
    this.setup();
  }

  public setup() {
    this.element.addEventListener('mouseover', this.handleUpdate);
    this.handleUpdate();
  }

  public destroy() {
    this.element.removeEventListener('mouseover', this.handleUpdate);
    this.removeHoverState();
  }

  private handleUpdate(e: MouseEvent = null) {
    if (e) {
      e.stopPropagation();
    }

    const metadata = ElementMetadata.getObjectData(this.element);
    const monitoredElements: Element[] = [
      this.element,
      this.optionsButton,
      this.alertButton,
      this.deleteButton,
      this.adjacentSiblingButtons?.before,
      this.adjacentSiblingButtons?.after,
      ...Array.from(
        document.querySelectorAll(`ss-freedom-object-options-panel[ss-freedom-uid="${metadata.uid}"]`)
      )
    ];

    const activeEditor = window.tinymce.activeEditor;
    const activeField = activeEditor && activeEditor.getBody();
    if (activeField && activeField.closest(`[ss-freedom-object="${metadata.uid}"]`) === this.element) {
      monitoredElements.push(activeEditor.getContainer());
    }

    const hoveredElements = monitoredElements.filter(element => element && element.matches(':hover'));
    hoveredElements.forEach((element) => {
      element.removeEventListener('mouseleave', this.handleUpdate);
      element.addEventListener('mouseleave', this.handleUpdate, { once: true })
    });

    const newHoverState = hoveredElements.length > 0;
    if (newHoverState) {
      this.ensureButtonsPresent();
      this.showAdjacentAddButtonsIfInList();
      if (newHoverState != this.hoverState) {
        this.showEmptyFields();
      }
    } else {
      this.ensureButtonsNotPresent();
      this.hideAdjacentAddButtons();
      if (newHoverState != this.hoverState) {
        this.removeHoverState();
      }
    }
    this.hoverState = newHoverState;
  }

  private showAdjacentAddButtonsIfInList() {
    if (
      this.element.parentElement.hasAttribute('ss-freedom-relation') &&
      !(this.adjacentSiblingButtons.before && this.adjacentSiblingButtons.after)
    ) {
      const adjacentOffsets = this.discoverClosestListSiblingsAdjacentEdges();
      Object.keys(adjacentOffsets).forEach((position) => {
        if (!this.adjacentSiblingButtons[position]) {
          const button = document.createElement('ss-freedom-add-sibling-button');
          button.element = this.element;
          button.offset = adjacentOffsets[position];
          button.adjacentSibling = (position === 'before' ?
            this.element.previousElementSibling :
            this.element.nextElementSibling) as HTMLElement;
          this.adjacentSiblingButtons[position] = button;
          document.body.prepend(button);
        }
      });
    }
  }

  private discoverClosestListSiblingsAdjacentEdges() {
    const edges: {before?: Offset, after?: Offset} = {};
    if (this.element.previousElementSibling) {
      edges.before = this.calculateAdjacentEdgeOffset(this.element.previousElementSibling);
      if (!this.element.nextElementSibling) {
        edges.after = this.mirrorSiblingEdge(edges.before);
      }
    }
    if (this.element.nextElementSibling) {
      edges.after = this.calculateAdjacentEdgeOffset(this.element.nextElementSibling);
      if (!this.element.previousElementSibling) {
        edges.before = this.mirrorSiblingEdge(edges.after);
      }
    }
    return edges;
  }

  private calculateAdjacentEdgeOffset(siblingElement: Element): Offset {
    const thisBounds = BoundingDocumentRect.for(this.element);
    const siblingBounds = BoundingDocumentRect.for(siblingElement);

    const edgeDistances = {
      top: Math.abs(thisBounds.top - siblingBounds.bottom),
      right: Math.abs(thisBounds.right - siblingBounds.left),
      bottom: Math.abs(thisBounds.bottom - siblingBounds.top),
      left: Math.abs(thisBounds.left - siblingBounds.right)
    };

    const smallestDistance = Math.min(...Object.values(edgeDistances));
    const offset: Offset = {};

    if (
      ((thisBounds.top > siblingBounds.bottom || thisBounds.bottom < siblingBounds.top) &&
        (thisBounds.right > siblingBounds.right || thisBounds.left < siblingBounds.left)) ||
      [edgeDistances.left, edgeDistances.right].includes(smallestDistance)
    ) {
      let edge = siblingElement === this.element.previousElementSibling ? 'left' : 'right';
      if (window.getComputedStyle(this.element).direction === 'rtl') {
        edge = edge === 'left' ? 'right' : 'left';
      }
      offset[edge] = '-1rem';
      offset.top = '0rem';
      offset.bottom = '0rem';
    } else {
      offset[smallestDistance === edgeDistances.top ? 'top' : 'bottom'] = '-1rem';
      offset.left = '0rem';
      offset.right = '0rem';
    }


    return offset;
  }

  private mirrorSiblingEdge(offset: Offset): Offset {
    const clone = Object.assign({}, offset);
    if (!clone.top) {
      clone.top = clone.bottom;
      delete clone.bottom;
    } else if (!clone.right) {
      clone.right = clone.left;
      delete clone.left;
    } else if (!clone.bottom) {
      clone.bottom = clone.top;
      delete clone.top;
    } else if (!clone.left) {
      clone.left = clone.right;
      delete clone.right;
    }
    return clone;
  }

  private hideAdjacentAddButtons() {
    Object.keys(this.adjacentSiblingButtons).forEach((position) => {
      const button = this.adjacentSiblingButtons[position];
      if (!button.processing) {
        button.remove();
        delete this.adjacentSiblingButtons[position];
      }
    });
  }

  private ensureButtonsPresent() {
    const metadata = ElementMetadata.getObjectData(this.element);
    const relationMetadata = this.element.parentElement.hasAttribute('ss-freedom-relation') &&
      ElementMetadata.getDataForClosestRelation(this.element);

    if (document.querySelector(`ss-freedom-object-options-panel[ss-freedom-uid="${metadata.uid}"]`)) {
      return;
    }

    if (metadata.hasOptions && !(this.optionsButton && this.optionsButton.parentElement)) {
      this.optionsButton = document.createElement('ss-freedom-object-options-button');
      this.optionsButton.element = this.element;
      this.optionsButton.setAttribute('ss-freedom-uid', metadata.uid);
      document.body.prepend(this.optionsButton);
    }

    if (metadata.alerts && !(this.alertButton && this.alertButton.parentElement)) {
      this.alertButton = document.createElement('ss-freedom-object-alert-button');
      this.alertButton.element = this.element;
      this.alertButton.setAttribute('ss-freedom-uid', metadata.uid);
      document.body.prepend(this.alertButton);
    }

    if (
      (metadata.canDelete || relationMetadata.removeMethod === 'unlink') &&
      !(this.deleteButton && this.deleteButton.parentElement)
    ) {
      this.deleteButton = document.createElement('ss-freedom-object-delete-button');
      this.deleteButton.element = this.element;
      this.deleteButton.setAttribute('ss-freedom-uid', metadata.uid);
      document.body.prepend(this.deleteButton);
    }
  }

  private ensureButtonsNotPresent() {
    const metadata = ElementMetadata.getObjectData(this.element);

    const buttons = document.querySelectorAll([
      `ss-freedom-object-options-button[ss-freedom-uid="${metadata.uid}"]`,
      `ss-freedom-object-alert-button[ss-freedom-uid="${metadata.uid}"]`,
      `ss-freedom-object-delete-button[ss-freedom-uid="${metadata.uid}"]:not([deleting])`
    ].join(','));
    buttons.forEach(element => !element['processing'] && element.remove());

    this.optionsButton = null;
    this.alertButton = null;
  }

  private showEmptyFields() {
    const ancestry = [this.element];
    let closest = this.element;
    do {
      closest = closest.parentElement.closest('[ss-freedom-object]');
      if (closest) {
        ancestry.unshift(closest);
      }
    } while (closest);

    document.querySelectorAll('.ss-freedom-show-hidden-empty')
      .forEach(e => e.classList.remove('ss-freedom-show-hidden-empty'));
    ancestry.forEach((element) => {
      element.querySelectorAll('[ss-freedom-hidden-when-empty]')
        .forEach(e => e.classList.add('ss-freedom-show-hidden-empty'));
      element.querySelectorAll(':scope [ss-freedom-object] [ss-freedom-object] [ss-freedom-hidden-when-empty]')
        .forEach(e => e.classList.remove('ss-freedom-show-hidden-empty'));
    });
  }

  private removeHoverState() {
    this.element.removeEventListener('mouseleave', this.handleUpdate);

    if (this.optionsButton) {
      this.optionsButton.removeEventListener('mouseleave', this.handleUpdate);
      this.optionsButton.remove();
      delete this.optionsButton;
    }

    if (this.alertButton) {
      this.alertButton.removeEventListener('mouseleave', this.handleUpdate);
      this.alertButton.remove();
      delete this.alertButton;
    }
  }
}
