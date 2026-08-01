export interface ParsedOrderItem {
  productNumber: number;
  quantity: number;
}

/**
 * Parse WhatsApp order message.
 *
 * Supported formats:
 * 1 x2
 * 1x2
 * 1 X 2
 * 1 x 2
 *
 * Multiple lines:
 * 1 x2
 * 4 x1
 * 8 x3
 */
export function parseOrderMessage(
  message: string
): ParsedOrderItem[] {
  const items: ParsedOrderItem[] = [];

  const lines = message
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const match = line.match(
      /^(\d+)\s*[xX]\s*(\d+)$/
    );

    if (!match) {
      continue;
    }

    const productNumber = Number(match[1]);
    const quantity = Number(match[2]);

    if (
      Number.isNaN(productNumber) ||
      Number.isNaN(quantity)
    ) {
      continue;
    }

    items.push({
      productNumber,
      quantity,
    });
  }

  return items;
}