import { TextEditor, Grammar } from 'atom'
import * as util from './util'
import { MarkdownPreviewView, SerializedMPV } from './markdown-preview-view'
import { handlePromise } from '../util'

export class MarkdownPreviewViewEditor extends MarkdownPreviewView {
  private static editorMap = new WeakMap<
    TextEditor,
    MarkdownPreviewViewEditor
  >()

  private constructor(private editor: TextEditor) {
    super()
    this.handleEditorEvents()
  }

  public static create(editor: TextEditor) {
    let mppv = MarkdownPreviewViewEditor.editorMap.get(editor)
    if (!mppv) {
      mppv = new MarkdownPreviewViewEditor(editor)
      MarkdownPreviewViewEditor.editorMap.set(editor, mppv)
    }
    return mppv
  }

  public static viewForEditor(editor: TextEditor) {
    return MarkdownPreviewViewEditor.editorMap.get(editor)
  }

  public destroy() {
    super.destroy()
    MarkdownPreviewViewEditor.editorMap.delete(this.editor)
  }

  public serialize(): SerializedMPV {
    return {
      deserializer: 'markdown-preview-plus/MarkdownPreviewView',
      editorId: this.editor && this.editor.id,
    }
  }

  public getTitle() {
    return `${this.editor.getTitle()} Preview`
  }

  public getURI() {
    return `markdown-preview-plus://editor/${this.editor.id}`
  }

  public getPath() {
    return this.editor.getPath()
  }

  protected async getMarkdownSource() {
    return this.editor.getText()
  }

  protected getGrammar(): Grammar {
    return this.editor.getGrammar()
  }

  private handleEditorEvents() {
    this.disposables.add(
      atom.workspace.onDidChangeActiveTextEditor((ed) => {
        if (
          atom.config.get('markdown-preview-plus.activatePreviewWithEditor')
        ) {
          if (ed === this.editor) {
            const pane = atom.workspace.paneForItem(this)
            if (!pane) return
            pane.activateItem(this)
          }
        }
      }),
      this.editor.getBuffer().onDidStopChanging(() => {
        if (atom.config.get('markdown-preview-plus.liveUpdate')) {
          this.changeHandler()
        }
        if (atom.config.get('markdown-preview-plus.syncPreviewOnChange')) {
          handlePromise(this.syncPreviewHelper())
        }
      }),
      this.editor.onDidChangePath(() => {
        this.emitter.emit('did-change-title')
      }),
      this.editor.onDidDestroy(() => {
        if (atom.config.get('markdown-preview-plus.closePreviewWithEditor')) {
          util.destroy(this)
        }
      }),
      this.editor.getBuffer().onDidSave(() => {
        if (!atom.config.get('markdown-preview-plus.liveUpdate')) {
          this.changeHandler()
        }
      }),
      this.editor.getBuffer().onDidReload(() => {
        if (!atom.config.get('markdown-preview-plus.liveUpdate')) {
          this.changeHandler()
        }
      }),
      atom.commands.add(atom.views.getView(this.editor), {
        'markdown-preview-plus:sync-preview': this.syncPreviewHelper,
      }),
    )
  }

  private syncPreviewHelper = async () => {
    const pos = this.editor.getCursorBufferPosition().row
    const source = await this.getMarkdownSource()
    this.syncPreview(source, pos)
  }
}
