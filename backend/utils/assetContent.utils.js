export function extractAssetIds(content) {
    const assetIds = new Set();

    function visit(node) {
        if (!node || typeof node !== "object") return;
        if (node.type === "image" && node.attrs?.assetId) {
            assetIds.add(String(node.attrs.assetId));
        }
        if (Array.isArray(node.content)) {
            node.content.forEach(visit);
        }
    }

    visit(content);
    return [...assetIds];
}

export function isTiptapDocument(content) {
    return Boolean(content && typeof content === "object" && content.type === "doc");
}