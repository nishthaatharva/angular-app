// src/app/custom-upload-plugin.ts
import { Plugin, ButtonView } from 'ckeditor5';

export default class WordUploadPlugin extends Plugin {
  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add('uploadButton', (locale) => {
      const view = new ButtonView(locale);

      view.set({
        label: 'Upload Document',
        icon: '', // Add icon if needed
        tooltip: true,
      });

      view.on('execute', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.doc,.docx,.pdf';
        input.click();

        input.addEventListener('change', async () => {
          const file = input.files ? input.files[0] : null;
          if (file) {
            const reader = new FileReader();
            reader.onload = (event: any) => {
              const content = event.target.result;
              editor.model.change((writer) => {
                const insertPosition =
                  editor.model.document.selection.getFirstPosition()!;
                writer.insertText(content, insertPosition);
              });
            };
            reader.readAsText(file);
          }
        });
      });

      return view;
    });
  }
}
