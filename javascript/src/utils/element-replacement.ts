export class ElementReplacement {
  static replaceObjectWithMostLikelyEquivalent(original: HTMLElement, newDocument: HTMLDocument) {
    const mostLikelyNewEquivalent = ElementReplacement.findMostLikelyEquivalentElement(original, newDocument);
    if (mostLikelyNewEquivalent) {
      original.replaceWith(mostLikelyNewEquivalent);
    }
  }

  static findMostLikelyEquivalentElement(original: HTMLElement, newDocument: HTMLDocument) {
    const ancestry: string[][] = [];
    let current = original;

    while (current.closest('body') && current !== document.body) {
      const queryParts = ElementReplacement.generateQueryPartsForElement(current);
      const usedParts: string[] = [];

      while (queryParts.length) {
        usedParts.push(queryParts.shift());
        const result = ElementReplacement.queryDocumentFor(newDocument, [usedParts].concat(ancestry));
        if (result.length <= 1) {
          return result[0];
        }
      }

      ancestry.unshift(usedParts);
      current = current.closest('[ss-freedom-object],[ss-freedom-field],[ss-freedom-relation]');
    }

    return ElementReplacement.queryDocumentFor(newDocument, ancestry)[0];
  }

  static generateQueryPartsForElement(element: HTMLElement): string[] {
    const parts = [];
    if (element.hasAttribute('ss-freedom-object')) {
      parts.push(`[ss-freedom-object="${element.getAttribute('ss-freedom-object')}"]`);
    }
    if (element.hasAttribute('ss-freedom-field')) {
      parts.push(`[ss-freedom-field="${element.getAttribute('ss-freedom-field')}]`);
    }
    if (element.hasAttribute('ss-freedom-relation')) {
      parts.push(`[ss-freedom-relation="${element.getAttribute('ss-freedom-relation')}]`);
    }
    return parts;
  }

  static queryDocumentFor(document: HTMLDocument, ancestry: string[][]) {
    const query = ancestry.map((queryParts) => queryParts.join(''));
    return document.querySelectorAll(query.join('>'));
  }
}
