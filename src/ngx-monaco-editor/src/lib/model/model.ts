import Uri = monaco.Uri;

/*
 @see {@link https://microsoft.github.io/monaco-editor/api/modules/monaco.editor.html#createModel}
 */
export interface EditorModel {
  value: string,
  language?: string,
  uri?: Uri
}
