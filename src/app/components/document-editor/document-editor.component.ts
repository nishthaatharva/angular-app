import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  FontFamily,
  FontSize,
  FontColor,
  FontBackgroundColor,
  Alignment,
  Autoformat,
  Autosave,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  BlockQuote,
  Clipboard,
  CodeBlock,
  Enter,
  FindAndReplace,
  Font,
  Highlight,
  List,
  PasteFromOffice,
  PageBreak,
  SpecialCharacters,
  Typing,
  SourceEditing,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import {
  AngularEditorConfig,
  AngularEditorModule,
} from '@kolkov/angular-editor';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Tag {
  name: string;
  type: string;
  options?: string[];
}

@Component({
  selector: 'app-document-editor',
  standalone: true,
  imports: [AngularEditorModule, FormsModule, CKEditorModule],
  templateUrl: './document-editor.component.html',
  styleUrl: './document-editor.component.scss',
})
export class DocumentEditorComponent {
  constructor(private sanitizer: DomSanitizer) {
    this.safeEditorData = this.sanitize(this.editorData);
  }
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  safeEditorData!: SafeHtml;

  editorConfig1: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '5rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']],
  };

  htmlContent: string = '';

  @HostListener('document:dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('document:drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const editor = document.getElementById('editor1');
    if (editor) {
      const tag = event.dataTransfer?.getData('text');
      if (tag) {
        this.insertTag(tag);
      }
    }
  }

  insertTag(tag: string) {
    const editor = document.getElementById('editor1') as HTMLElement;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const node = document.createElement('span');
      node.innerHTML = tag;
      range.insertNode(node);
    }
  }

  onDragStart(event: DragEvent, tag: Tag) {
    event.dataTransfer?.setData('text', `[[${tag.name}]]`);
  }

  public Editor = ClassicEditor;
  public editorData: string = '<p>Content of the editor.</p>';
  public config = {
    toolbar: [
      // 'undo',
      // 'redo',
      // '|',
      'heading',
      // '|',
      // 'fontfamily',
      // 'fontsize',
      // 'fontColor',
      // 'fontBackgroundColor',
      // '|',
      // 'bold',
      // 'italic',
      'strikethrough',
      'subscript',
      'superscript',
      // 'code',
      // '|',
      // 'link',
      'uploadImage',
      // 'blockQuote',
      // 'codeBlock',
      // '|',
      'bulletedList',
      'numberedList',
      'todoList',
      'outdent',
      'indent',
      'Essentials',
      'Bold',
      'Italic',
      'Underline',
      'Mention',
      'Paragraph',
      'Undo',
      'FontFamily',
      'FontSize',
      'FontColor',
      'FontBackgroundColor',
      'Alignment',
      'Autoformat',
      'List',
      'sourceEditing',
    ],
    plugins: [
      Essentials,
      Bold,
      Italic,
      Mention,
      Paragraph,
      Undo,
      FontFamily,
      FontSize,
      FontColor,
      FontBackgroundColor,
      Alignment,
      Autoformat,
      Autosave,
      Underline,
      Strikethrough,
      Subscript,
      Superscript,
      BlockQuote,
      Clipboard,
      CodeBlock,
      Enter,
      FindAndReplace,
      Font,
      Highlight,
      List,
      PasteFromOffice,
      PageBreak,
      SpecialCharacters,
      Typing,
      SourceEditing,
    ],
    licenseKey: 'DBCHHV747.FLG546VVS239',
  };

  public tags: Tag[] = [];
  public newTag: string = '';
  public newTagType: string = 'Text box';
  public newDropdownOption: string = '';
  public newDropdownOptions: string[] = [];
  public previewContent: string = '';

  addTag() {
    if (this.newTag.trim() !== '') {
      const newTag: Tag = { name: this.newTag.trim(), type: this.newTagType };
      if (this.newTagType === 'Dropdown') {
        newTag.options = [...this.newDropdownOptions];
        this.newDropdownOptions = [];
      }
      this.tags.push(newTag);
      this.newTag = '';
      this.newTagType = 'Text box';
    }
  }

  addDropdownOption() {
    if (this.newDropdownOption.trim() !== '') {
      this.newDropdownOptions.push(this.newDropdownOption.trim());
      this.newDropdownOption = '';
    }
  }

  showPreview() {
    let content = this.editorData;
    for (const tag of this.tags) {
      const tagPlaceholder = `${tag.name}`;
      const underscore = '_'.repeat(tag.name.length); // replace with underscores of tag name length
      content = content.replace(new RegExp(tagPlaceholder, 'g'), underscore);
    }
    this.safeEditorData = this.sanitize(content);
  }

  sanitize(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
