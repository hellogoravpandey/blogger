import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

const BlogImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      assetId: {
        default: null,
      },
    };
  },
});

export const blogEditorExtensions = [StarterKit, BlogImage];
